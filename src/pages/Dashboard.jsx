import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, MapPin, Plane, Plus, TrendingUp, Users } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500">Context not available.</div>;

  const { itineraries, searchQuery } = context;
  const navigate = useNavigate();

  const filteredItineraries = itineraries.filter(trip =>
    trip.destination?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date();
  const upcomingTrips = itineraries.filter(trip => new Date(trip.startDate) > today);

  const countries = itineraries
    .map(trip => {
      if (!trip.destination) return null;
      const parts = trip.destination.split(',');
      return parts.length > 1 ? parts[1].trim() : parts[0].trim();
    })
    .filter(Boolean);
  const uniqueCountries = new Set(countries);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-red-800/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-10"
            >
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Your Journeys</h2>
              <p className="text-zinc-500 text-lg font-medium">Explore, plan, and relive your adventures around the world.</p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12"
            >
              {[
                { label: 'Total Trips', value: itineraries.length, icon: MapPin, color: 'text-red-500', bg: 'bg-red-500/10' },
                { label: 'Upcoming', value: upcomingTrips.length, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { label: 'Countries', value: uniqueCountries.size, icon: Plane, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  className="glass-card rounded-2xl p-7 flex items-center justify-between"
                >
                  <div>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                  </div>
                  <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center border border-white/5`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Itinerary Grid */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence>
                {filteredItineraries.map((trip) => (
                  <motion.div
                    key={trip.id}
                    variants={itemVariants}
                    layoutId={`trip-${trip.id}`}
                    whileHover={{ scale: 1.02 }}
                    className="glass-card rounded-3xl overflow-hidden group border-white/5"
                  >
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={trip.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070'}
                        alt={trip.destination}
                        className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      
                      {/* Floating Status Badge */}
                      <div className="absolute top-5 left-5 glass backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
                         <span className="text-white font-bold text-xs">
                           {(() => {
                             const start = new Date(trip.startDate);
                             const end = new Date(trip.endDate);
                             const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
                             return `${days} Days`;
                           })()}
                         </span>
                      </div>

                      {/* Hover Overlay Icon */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/20">
                            <Plane className="w-8 h-8 text-white animate-pulse" />
                         </div>
                      </div>
                    </div>

                    <div className="p-7">
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-red-500 transition-colors uppercase tracking-tight line-clamp-1">{trip.destination}</h3>

                      <div className="flex items-center gap-2.5 text-zinc-400 mb-6 font-semibold bg-white/5 py-2 px-4 rounded-xl border border-white/5 w-fit">
                        <Calendar className="w-4 h-4 text-red-500" />
                        <span className="text-xs">
                          {new Date(trip.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{" "}
                          {new Date(trip.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2.5 text-zinc-500 group-hover:text-zinc-300 transition-colors">
                          <Clock className="w-5 h-5 text-red-600" />
                          <span className="text-sm font-bold">{trip.dayPlans?.length || 0} Activities</span>
                        </div>

                        <motion.button
                          whileHover={{ x: 5 }}
                          onClick={() => navigate(`/itinerary/${trip.id}`)}
                          className="text-red-600 hover:text-red-400 font-bold text-sm flex items-center gap-1.5"
                        >
                          EXPLORE <Plane className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add New Card - Premium Style */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(239, 68, 68, 0.05)' }}
                onClick={() => navigate('/create')}
                className="bg-black border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center hover:border-red-600/50 transition-all duration-300 cursor-pointer group min-h-[420px]"
              >
                <div className="w-20 h-20 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:scale-110 transition-all duration-300 group-hover:red-glow">
                  <Plus className="w-10 h-10 text-red-600 group-hover:text-white transition-colors stroke-[3]" />
                </div>
                <h3 className="text-white text-xl font-black uppercase tracking-widest mb-2">Plan New Trip</h3>
                <p className="text-zinc-500 font-bold text-sm">Where are you going next?</p>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;