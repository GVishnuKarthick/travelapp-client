import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';

const SignupPage = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('SignupPage must be used within AppProvider');
    return <div>Context not available. Check if wrapped in AppProvider.</div>;
  }

  const { setIsLoggedIn } = context;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-96 h-96 bg-red-600 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-red-800 opacity-10 blur-3xl rounded-full"></div>
      </div>
     
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plane className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">TravelPlan</h1>
          <p className="text-gray-400">Start your journey today</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl shadow-2xl p-8 border border-zinc-800">
          <h2 className="text-2xl font-bold text-white mb-6">Create Account</h2>
         
          <form onSubmit={async (e) => {
            e.preventDefault();
            try {
              await api.post('/auth/register', {
                fullName: e.target.fullName.value,
                email: e.target.email.value,
                password: e.target.password.value
              });
              // Auto-login after register (optional)
              const loginResponse = await api.post('/auth/login', {
                email: e.target.email.value,
                password: e.target.password.value
              });
              localStorage.setItem('jwt', loginResponse.data.token);
              setIsLoggedIn(true);
              navigate('/dashboard');
            } catch (error) {
              alert('Signup failed');
            }
          }}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                placeholder="John Doe"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                placeholder="••••••••"
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-start">
                <input type="checkbox" className="w-4 h-4 mt-1 bg-black border-zinc-700 rounded accent-red-600" required />
                <span className="ml-2 text-sm text-gray-400">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-200 shadow-lg shadow-red-600/30"
            >
              Create Account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-red-600 hover:text-red-500 font-semibold"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;