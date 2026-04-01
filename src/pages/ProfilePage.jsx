import React, { useState, useContext, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Edit, MapPin, Save, User, Mail, Shield, Camera, Settings, Calendar } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';

const ProfilePage = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('ProfilePage must be used within AppProvider');
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-bold">Context not available.</div>;
  }

  const { userProfile, setUserProfile } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      setUserProfile(res.data);
      setEditedProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      await api.put('/profile', editedProfile);
      setUserProfile(editedProfile);
      setIsEditing(false);
      // Optional: Add a toast notification here instead of an alert
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Decorative Background Blur */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Profile</h2>
                <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Member since 2024</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 ${
                  isEditing 
                  ? 'bg-zinc-800 text-white border border-zinc-700' 
                  : 'bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700'
                }`}
              >
                {isEditing ? 'CANCEL' : (
                  <>
                    <Edit className="w-4 h-4" />
                    EDIT PROFILE
                  </>
                )}
              </motion.button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Avatar & Basic Info */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1 space-y-6"
              >
                <div className="glass-card rounded-3xl p-8 text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative mb-6 mx-auto w-32 h-32">
                    <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-800 rounded-3xl rotate-3 flex items-center justify-center shadow-2xl relative z-10">
                      <User className="w-14 h-14 text-white -rotate-3" />
                    </div>
                    <div className="absolute inset-0 bg-red-600/20 rounded-3xl blur-xl animate-pulse" />
                    
                    <button className="absolute bottom-0 right-0 w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 transition-all z-20 shadow-xl">
                      <Camera className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{userProfile.name}</h3>
                  <p className="text-zinc-500 font-bold text-sm mb-6 uppercase tracking-widest">{userProfile.location || 'Explorer'}</p>
                  
                  <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-800/50">
                    <div className="text-center">
                      <p className="text-white font-black text-lg">12</p>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter">Trips</p>
                    </div>
                    <div className="w-px h-8 bg-zinc-800/50" />
                    <div className="text-center">
                      <p className="text-white font-black text-lg">45</p>
                      <p className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter">Memories</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-3xl p-6 space-y-4">
                  <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-widest pl-2">Account Details</h4>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <Mail className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold text-zinc-300 truncate">{userProfile.email}</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-zinc-300">Verified Explorer</span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: Bio & Forms */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="glass-card rounded-3xl p-8 h-full">
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.div 
                        key="edit-form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Full Name</label>
                            <input
                              type="text"
                              value={editedProfile.name}
                              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                              className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                              placeholder="John Wick"
                            />
                          </div>
                          <div>
                            <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Location</label>
                            <input
                              type="text"
                              value={editedProfile.location}
                              onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                              className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                              placeholder="New York, USA"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Travel Bio</label>
                          <textarea
                            value={editedProfile.bio}
                            onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                            className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all h-40 resize-none placeholder:text-zinc-700"
                            placeholder="Tell the world about your wanderlust..."
                          />
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSaveProfile}
                          className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                          <Save className="w-5 h-5" />
                          SAVE PROFILE
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="view-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                      >
                        <div>
                          <h4 className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-red-500" />
                            ABOUT ME
                          </h4>
                          <p className="text-zinc-200 text-lg font-medium leading-relaxed italic">
                            "{userProfile.bio || 'This explorer hasn\'t written a bio yet. Adventure awaits!'}"
                          </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-10">
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <Settings className="w-5 h-5 text-zinc-500 mb-2" />
                              <p className="text-white font-bold text-xs uppercase">Settings</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <Camera className="w-5 h-5 text-zinc-500 mb-2" />
                              <p className="text-white font-bold text-xs uppercase">Galleries</p>
                           </div>
                           <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                              <Calendar className="w-5 h-5 text-zinc-500 mb-2" />
                              <p className="text-white font-bold text-xs uppercase">Planner</p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;