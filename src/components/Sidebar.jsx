import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Camera, MapPin, Plus, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed lg:static lg:translate-x-0 w-64 h-[calc(100vh-73px)] bg-zinc-900 border-r border-zinc-800 z-40 transition-transform duration-300
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-4">
          <button
            onClick={() => navigate('/create')}
            className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center gap-2 mb-6 shadow-lg shadow-red-600/30"
          >
            <Plus className="w-5 h-5" />
            New Itinerary
          </button>

          <div className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition ${
                location.pathname === '/dashboard'
                  ? 'text-white bg-zinc-800'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <MapPin className="w-5 h-5 text-red-600" />
              <span>My Trips</span>
            </button>

            <button
              onClick={() => navigate('/calendar')}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition ${
                location.pathname === '/calendar'
                  ? 'text-white bg-zinc-800'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Calendar</span>
            </button>

            <button
              onClick={() => navigate('/memories')}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition ${
                location.pathname === '/memories'
                  ? 'text-white bg-zinc-800'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Camera className="w-5 h-5" />
              <span>Memories</span>
            </button>

            <button
              onClick={() => navigate('/profile')}
              className={`flex items-center gap-3 px-4 py-3 w-full rounded-lg transition ${
                location.pathname === '/profile'
                  ? 'text-white bg-zinc-800'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
          </div>

        {/*  <div className="mt-8 p-4 bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-600/30 rounded-lg">
            <h3 className="text-white font-semibold mb-2">Go Premium</h3>
            <p className="text-gray-400 text-sm mb-3">
              Unlock unlimited itineraries and exclusive features
            </p>
            <button
              onClick={() => alert('Premium feature coming soon!')}
              className="w-full bg-red-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-red-700 transition"
            >
              Upgrade Now
            </button>
          </div> */}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;