import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, LogOut, Menu, Plane, Search, User, X } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Header = () => {
  const { isSidebarOpen, setIsSidebarOpen, searchQuery, setSearchQuery, setIsLoggedIn } =
    useContext(AppContext);
  const navigate = useNavigate();

  return (
    <header className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Menu button for mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden text-white hover:text-red-600 transition"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/dashboard')}
            >
              <Plane className="w-8 h-8 text-red-600" />
              <h1 className="text-2xl font-bold text-white">TravelPlan</h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition w-64"
              />
            </div>

            <button
              onClick={() => navigate('/calendar')}
              className="relative p-2 text-gray-400 hover:text-white transition"
            >
              <Calendar className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-zinc-700">
              <div
                onClick={() => navigate('/profile')}
                className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition"
              >
                <User className="w-6 h-6 text-white" />
              </div>

              <button
                onClick={() => {
                  localStorage.removeItem('jwt');
                  setIsLoggedIn(false);
                  navigate('/login');
                }}
                className="text-gray-400 hover:text-red-600 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;