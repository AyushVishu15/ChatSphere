import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import AuthPage from './AuthPage';
import ChatPage from './ChatPage';

function App() {
  const [token, setToken] = useState<string>(localStorage.getItem('token') || '');

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage setToken={setToken} />} />
      <Route path="/chat" element={token ? <ChatPage setToken={setToken} /> : <AuthPage setToken={setToken} />} />
    </Routes>
  );
}

export default App;