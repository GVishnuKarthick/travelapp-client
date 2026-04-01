import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Camera, MapPin, Plus, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: MapPin, label: 'My Trips' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/memories', icon: Camera, label: 'Memories' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <aside
        className={`fixed lg:sticky top-[73px] lg:translate-x-0 w-72 h-[calc(100vh-73px)] glass border-r border-zinc-800/50 z-40 transition-all duration-500 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="p-6 h-full flex flex-col">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/create')}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 mb-8"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>New Itinerary</span>
          </motion.button>

          <div className="space-y-2 flex-1">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-4 ml-2">Main Menu</p>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3.5 w-full rounded-xl transition-all duration-300 group relative ${isActive
                      ? 'text-white bg-zinc-800/80 shadow-md border border-zinc-700/50'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
                    }`}
                >
                  <item.icon className={`w-5 h-5 transition-all duration-300 ${isActive ? 'text-red-500 scale-110' : 'text-zinc-500 group-hover:text-red-500'}`} />
                  <span className={`font-semibold tracking-wide ${isActive ? 'translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>{item.label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>


        </nav>
      </aside>
    </>
  );
};

export default Sidebar;