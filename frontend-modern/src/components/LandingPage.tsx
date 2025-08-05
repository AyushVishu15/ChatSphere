import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  number: string;
  label: string;
}

function LandingPage() {
  const [activeFeature, setActiveFeature] = useState<number>(0);
  const navigate = useNavigate();

  const features: Feature[] = [
    {
      icon: '💬',
      title: 'Instant Messaging',
      description: 'Send messages instantly with real-time delivery.',
    },
    {
      icon: '👥',
      title: 'Friend Management',
      description: 'Search for users, send friend requests, and manage connections seamlessly.',
    },
    {
      icon: '🔒',
      title: 'Secure Chatting',
      description: 'Your conversations are protected with secure authentication.',
    },
    {
      icon: '🌐',
      title: 'Cross-Platform',
      description: 'Access ChatSphere from any device with a consistent experience.',
    },
  ];

  const stats: Stat[] = [
    { number: '10K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '50+', label: 'Countries' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatSphere
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <span className="inline-block mb-6 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          ⭐ Trusted by thousands worldwide
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
          Connect, Chat,
          <br />
          Collaborate
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Experience seamless communication with ChatSphere, a powerful and intuitive chat platform. Connect with friends
          and build communities effortlessly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition"
          >
            Start Chatting Now
            <span className="ml-2">→</span>
          </button>
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-300 text-gray-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </button>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="p-0 bg-gray-200 h-full flex items-center justify-center">
              <img src="/Image/A.jpeg" alt="ChatSphere Preview" className="h-full w-full object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose ChatSphere?</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Packed with features that make communication effortless and enjoyable
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                activeFeature === index ? 'border-blue-500 border-2' : ''
              }`}
              onMouseEnter={() => setActiveFeature(index)}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white mb-4 text-2xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Everything you need for modern communication</h2>
              <div className="space-y-4">
                {[
                  'Lightning-fast message delivery',
                  'Cross-platform synchronization',
                  'User-friendly friend management',
                  'Real-time notifications',
                  'Customizable interface',
                  'Secure authentication',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✔</span>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white-200 rounded-2xl shadow-xl h-40 flex items-center justify-center">
                <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent font-['Dancing_Script']">Chat, Vibe, Unite</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to transform your communication?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who have discovered the power of ChatSphere
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition"
            >
              Create Free Account
              <span className="ml-2">→</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-gray-300 text-gray-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition"
            >
              Sign In to Existing Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <span className="text-xl font-bold">ChatSphere</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">© 2025 ChatSphere. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span className="text-gray-400">🌐 Global</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
