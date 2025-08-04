const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chat-app')
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schemas
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  friends: [{ type: String }],
  friendRequests: [{ type: String }],
  blocked: [{ type: String }],
});

const messageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

const JWT_SECRET = 'my_secure_random_string_123';

app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    console.log(`Attempting to register user: ${username}`);
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`Username ${username} already taken`);
      return res.status(400).json({ message: 'Username taken' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, friends: [], friendRequests: [], blocked: [] });
    await user.save();
    const token = jwt.sign({ username }, JWT_SECRET);
    console.log(`User registered successfully: ${username}`);
    res.json({ token });
  } catch (err) {
    console.error('Registration error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
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
    req.user = await User.findOne({ username: decoded.username });
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.get('/api/users/me', authMiddleware, (req, res) => {
  res.json({
    username: req.user.username,
    friends: req.user.friends,
    friendRequests: req.user.friendRequests,
  });
});

app.get('/api/users/search', authMiddleware, async (req, res) => {
  const { query } = req.query;
  try {
    if (!query) return res.status(400).json({ message: 'Query parameter required' });
    const users = await User.find({ username: new RegExp(query, 'i') }).select('username');
    res.json(users.map(user => user.username));
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/request', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    console.log(`Friend request from ${req.user.username} to ${username}`);
    const targetUser = await User.findOne({ username });
    if (!targetUser) {
      console.log(`User ${username} not found`);
      return res.status(404).json({ message: 'User not found' });
    }
    if (targetUser.username === req.user.username) {
      console.log('Cannot add self');
      return res.status(400).json({ message: 'Cannot add self' });
    }
    if (targetUser.friendRequests.includes(req.user.username) || req.user.friends.includes(username)) {
      console.log('Request already sent or already friends');
      return res.status(400).json({ message: 'Request already sent or already friends' });
    }
    targetUser.friendRequests.push(req.user.username);
    await targetUser.save();
    console.log(`Friend request sent to ${username}`);
    res.json({ message: 'Friend request sent' });
  } catch (err) {
    console.error('Friend request error:', err.message, err.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/accept', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    if (!req.user.friendRequests.includes(username)) {
      return res.status(400).json({ message: 'No friend request from this user' });
    }
    req.user.friendRequests = req.user.friendRequests.filter((req) => req !== username);
    req.user.friends.push(username);
    await req.user.save();
    const friend = await User.findOne({ username });
    friend.friends.push(req.user.username);
    await friend.save();
    res.json({ message: 'Friend request accepted' });
  } catch (err) {
    console.error('Accept friend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/unfriend', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    req.user.friends = req.user.friends.filter((f) => f !== username);
    await req.user.save();
    const friend = await User.findOne({ username });
    friend.friends = friend.friends.filter((f) => f !== req.user.username);
    await friend.save();
    res.json({ message: 'Unfriended' });
  } catch (err) {
    console.error('Unfriend error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/friends/block', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    req.user.friends = req.user.friends.filter((f) => f !== username);
    req.user.blocked.push(username);
    await req.user.save();
    const friend = await User.findOne({ username });
    friend.friends = friend.friends.filter((f) => f !== req.user.username);
    await friend.save();
    res.json({ message: 'User blocked' });
  } catch (err) {
    console.error('Block error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/messages/:friend', authMiddleware, async (req, res) => {
  const { friend } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.username, receiver: friend },
        { sender: friend, receiver: req.user.username },
      ],
    }).sort({ timestamp: 1 });
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
    const message = new Message({ sender, receiver, content });
    await message.save();
    io.emit('message', msg);
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));