const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
}));
app.use(express.json());

// Log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Initialize database schema
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      friends TEXT[] DEFAULT '{}',
      friend_requests TEXT[] DEFAULT '{}',
      blocked TEXT[] DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender VARCHAR(255) NOT NULL,
      receiver VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
initDb().catch(err => console.error('Database initialization error:', err));

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'my_secure_random_string_123';
const PORT = process.env.PORT || 3000;

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (existingUsers.length > 0) {
      console.log(`Username ${username} already taken`);
      return res.status(400).json({ message: 'Username taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    const token = jwt.sign({ username }, JWT_SECRET);
    console.log(`User registered: ${username}`);
    res.json({ token });
  } catch (err) {
    console.error('Registration error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const { rows: users } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (users.length === 0) return res.status(400).json({ message: 'Invalid credentials' });
    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ username }, JWT_SECRET);
    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { rows: users } = await pool.query('SELECT * FROM users WHERE username = $1', [decoded.username]);
    if (users.length === 0) return res.status(401).json({ message: 'Unauthorized' });
    req.user = users[0];
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.get('/api/users/me', authMiddleware, (req, res) => {
  res.json({
    username: req.user.username,
    friends: req.user.friends,
    friendRequests: req.user.friend_requests,
  });
});

app.get('/api/users/search', authMiddleware, async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) return res.status(400).json({ message: 'Query parameter required' });
    const { rows: users } = await pool.query('SELECT username FROM users WHERE username ILIKE $1', [`%${query}%`]);
    res.json(users.map(user => user.username));
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/request', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    const { rows: targetUsers } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (targetUsers.length === 0) return res.status(404).json({ message: 'User not found' });
    const targetUser = targetUsers[0];
    if (targetUser.username === req.user.username) return res.status(400).json({ message: 'Cannot add self' });
    if (targetUser.friend_requests.includes(req.user.username) || req.user.friends.includes(username)) {
      return res.status(400).json({ message: 'Request already sent or already friends' });
    }
    await pool.query('UPDATE users SET friend_requests = array_append(friend_requests, $1) WHERE username = $2', [req.user.username, username]);
    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Friend request error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/accept', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    if (!req.user.friend_requests.includes(username)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }
    await pool.query('UPDATE users SET friend_requests = array_remove(friend_requests, $1), friends = array_append(friends, $1) WHERE username = $2', [username, req.user.username]);
    await pool.query('UPDATE users SET friends = array_append(friends, $1) WHERE username = $2', [req.user.username, username]);
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Accept friend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/unfriend', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    await pool.query('UPDATE users SET friends = array_remove(friends, $1) WHERE username = $2', [username, req.user.username]);
    await pool.query('UPDATE users SET friends = array_remove(friends, $1) WHERE username = $2', [req.user.username, username]);
    res.json({ message: 'Unfriended' });
  } catch (err) {
    console.error('Unfriend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/block', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    await pool.query('UPDATE users SET friends = array_remove(friends, $1), blocked = array_append(blocked, $1) WHERE username = $2', [username, req.user.username]);
    await pool.query('UPDATE users SET friends = array_remove(friends, $1) WHERE username = $2', [req.user.username, username]);
    res.json({ message: 'User blocked' });
  } catch (err) {
    console.error('Block error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/messages/:friend', authMiddleware, async (req, res) => {
  const { friend } = req.params;
  try {
    const { rows: messages } = await pool.query(
      'SELECT * FROM messages WHERE (sender = $1 AND receiver = $2) OR (sender = $2 AND receiver = $1) ORDER BY timestamp ASC',
      [req.user.username, friend]
    );
    res.json(messages);
  } catch (err) {
    console.error('Messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Unauthorized'));
  }
});

io.on('connection', (socket) => {
  socket.on('message', async (msg) => {
    const { sender, receiver, content } = msg;
    await pool.query('INSERT INTO messages (sender, receiver, content) VALUES ($1, $2, $3)', [sender, receiver, content]);
    io.emit('message', msg);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
