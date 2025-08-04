import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthPageProps {
  setToken: (token: string) => void;
}

function AuthPage({ setToken }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mounted, setMounted] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const url = isLogin ? 'http://localhost:3000/api/auth/login' : 'http://localhost:3000/api/auth/register';
      const res = await axios.post(url, { username, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setError('');
      navigate('/chat');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError('');
    // Placeholder: Social login not supported by backend
    setTimeout(() => {
      setError(`${provider} login is not supported in this version.`);
      setIsLoading(false);
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <span className="mr-2">🔙</span> Back to Home
          </button>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatSphere
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className="bg-white shadow-xl border-0 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-1">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
          <p className="text-gray-500 text-center text-sm mb-4">
            {isLogin ? 'Enter your credentials to access your account' : 'Create a new account to start chatting'}
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full h-11 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-11 p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? '👁️‍🗨️' : '👁️'}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="h-11 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
            >
              <span className="mr-2">📧</span> Google
            </button>
            <button
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="h-11 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition flex items-center justify-center"
            >
              <span className="mr-2">🐙</span> GitHub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;