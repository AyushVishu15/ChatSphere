import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

interface User {
  username: string;
  friendRequests: string[];
  friends: string[];
}

interface Message {
  sender: string;
  receiver: string;
  content: string;
}

interface ChatPageProps {
  setToken: (token: string) => void;
}

function ChatPage({ setToken }: ChatPageProps) {
  const [user, setUser] = useState<User | null>(null);
  const [friendUsername, setFriendUsername] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [friendError, setFriendError] = useState<string>('');
  const [friendRequests, setFriendRequests] = useState<string[]>([]);
  const [friends, setFriends] = useState<string[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', { auth: { token: localStorage.getItem('token') } });
    setSocket(newSocket);
    newSocket.on('message', (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });
    newSocket.on('connect_error', (err: any) => {
      setFriendError('Failed to connect to chat server');
    });
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/users/me', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(res.data);
        setFriendRequests(res.data.friendRequests);
        setFriends(res.data.friends);
      } catch (err: any) {
        setFriendError(err.response?.data?.message || 'Failed to fetch user data');
      }
    };
    fetchUser();
  }, []);

  const searchUsers = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      setFriendError('');
      return;
    }
    try {
      const res = await axios.get(`http://localhost:3000/api/users/search?query=${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSearchResults(res.data.filter((username: string) => username !== user?.username));
      setFriendError('');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error searching users');
    }
  };

  const sendFriendRequest = async () => {
    if (!friendUsername) {
      setFriendError('Enter a username');
      return;
    }
    try {
      await axios.post(
        'http://localhost:3000/api/friends/request',
        { username: friendUsername },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFriendUsername('');
      setSearchResults([]);
      setFriendError('Friend request sent!');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error sending friend request');
    }
  };

  const acceptFriendRequest = async (username: string) => {
    try {
      await axios.post(
        'http://localhost:3000/api/friends/accept',
        { username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFriendRequests((prev) => prev.filter((req) => req !== username));
      setFriends((prev) => [...prev, username]);
      setFriendError('Friend request accepted!');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error accepting friend request');
    }
  };

  const unfriend = async (username: string) => {
    try {
      await axios.post(
        'http://localhost:3000/api/friends/unfriend',
        { username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFriends((prev) => prev.filter((f) => f !== username));
      if (selectedFriend === username) setSelectedFriend(null);
      setFriendError('User unfriended!');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error unfriending user');
    }
  };

  const block = async (username: string) => {
    try {
      await axios.post(
        'http://localhost:3000/api/friends/block',
        { username },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFriends((prev) => prev.filter((f) => f !== username));
      if (selectedFriend === username) setSelectedFriend(null);
      setFriendError('User blocked!');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error blocking user');
    }
  };

  const sendMessage = () => {
    if (message && selectedFriend && socket) {
      const msg: Message = { sender: user!.username, receiver: selectedFriend, content: message };
      socket.emit('message', msg);
      setMessages((prev) => [...prev, msg]);
      setMessage('');
    }
  };

  const selectFriend = async (friend: string) => {
    setSelectedFriend(friend);
    try {
      const res = await axios.get(`http://localhost:3000/api/messages/${friend}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessages(res.data);
      setFriendError('');
    } catch (err: any) {
      setFriendError(err.response?.data?.message || 'Error fetching messages');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-2xl">💬</span>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ChatSphere
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 text-center text-3xl font-['Dancing_Script']">
        ChatSphere
      </div>
      <div className="min-h-screen bg-gray-100 flex">
        <div className="w-full md:w-1/4 bg-white p-6 border-r shadow-md">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatSphere
            </span>
            <span className="text-2xl font-bold text-gray-600">({user.username})</span>
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-600 text-white p-3 rounded-lg mb-6 hover:bg-red-700 transition"
          >
            Logout
          </button>
          <h3 className="text-xl font-semibold mb-3">Send Friend Request</h3>
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search username"
              value={friendUsername}
              onChange={(e) => {
                setFriendUsername(e.target.value);
                searchUsers(e.target.value);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchResults.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-40 overflow-y-auto shadow-lg">
                {searchResults.map((username) => (
                  <li
                    key={username}
                    onClick={() => {
                      setFriendUsername(username);
                      setSearchResults([]);
                    }}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                  >
                    {username}
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={sendFriendRequest}
              className="mt-3 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Send Friend Request
            </button>
            {friendError && <p className="text-red-500 mt-3 text-center">{friendError}</p>}
          </div>
          <h3 className="text-xl font-semibold mb-3">Friend Requests</h3>
          {friendRequests.length == 0 && <p className="text-gray-600">No pending requests</p>}
          {friendRequests.map((req) => (
            <div key={req} className="flex justify-between items-center mb-3">
              <span className="text-gray-800">{req}</span>
              <button
                onClick={() => acceptFriendRequest(req)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Accept
              </button>
            </div>
          ))}
          <h3 className="text-xl font-semibold mb-3">Friends</h3>
          {friends.length == 0 && <p className="text-gray-600">No friends yet</p>}
          {friends.map((friend) => (
            <div key={friend} className="flex justify-between items-center mb-3">
              <span
                onClick={() => selectFriend(friend)}
                className="cursor-pointer text-blue-600 hover:underline"
              >
                {friend}
              </span>
              <div className="space-x-2">
                <button
                  onClick={() => unfriend(friend)}
                  className="bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700 transition"
                >
                  Unfriend
                </button>
                <button
                  onClick={() => block(friend)}
                  className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                >
                  Block
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-3/4 p-6">
          {selectedFriend ? (
            <div>
              <h3 className="text-2xl font-semibold mb-4">Chat with {selectedFriend}</h3>
              <div className="h-[calc(100vh-200px)] overflow-y-auto border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-md">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`mb-3 ${msg.sender === user.username ? 'text-right' : 'text-left'}`}
                  >
                    <span
                      className={`inline-block p-3 rounded-lg ${
                        msg.sender === user.username ? 'bg-blue-100' : 'bg-gray-200'
                      }`}
                    >
                      {msg.content}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                />
                <button
                  onClick={sendMessage}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-600">Select a friend to chat</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ChatPage;