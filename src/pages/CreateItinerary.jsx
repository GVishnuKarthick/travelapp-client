import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { ArrowLeft, Save, Map, Calendar, DollarSign, Image as ImageIcon, AlignLeft, Sparkles } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';
import { motion } from 'framer-motion';

const CreateItinerary = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('CreateItinerary must be used within AppProvider');
    return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-bold uppercase tracking-widest">Context not available.</div>;
  }

  const { fetchItineraries } = context;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanBudget = formData.budget.replace(/[^0-9.]/g, '');

    const newItinerary = {
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      image: formData.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
      activities: [],
      description: formData.description,
      budget: `$${cleanBudget}`,
      dayPlans: []
    };

    try {
      await api.post('/itineraries', newItinerary);
      fetchItineraries();
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to create itinerary', error);
    }
  };

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />

          <div className="max-w-4xl mx-auto relative z-10">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => navigate('/dashboard')}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white mb-10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </motion.button>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-[2.5rem] p-10 border-white/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <Sparkles className="w-24 h-24 text-red-600" />
              </div>

              <div className="mb-10">
                <h2 className="text-4xl font-black text-white mb-2 uppercase tracking-tight">Plan New Adventure</h2>
                <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase italic">Every great journey starts with a single step.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                      <Map className="w-3 h-3 text-red-500" />
                      Destination
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="e.g., Tokyo, Japan"
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                       <Calendar className="w-3 h-3 text-red-500" />
                       Departure
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all appearance-none"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                       <Calendar className="w-3 h-3 text-red-500" />
                       Return
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all appearance-none"
                      style={{ colorScheme: 'dark' }}
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                       <DollarSign className="w-3 h-3 text-red-500" />
                       Budget (USD)
                    </label>
                    <input
                      type="text"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="e.g., 2500"
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                       <ImageIcon className="w-3 h-3 text-red-500" />
                       Hero Image URL
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-3 ml-2">
                       <AlignLeft className="w-3 h-3 text-red-500" />
                       Travel Bio / Notes
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Briefly describe the theme of your trip..."
                      className="w-full px-6 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition-all h-32 resize-none placeholder:text-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-6 mt-10">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    <Save className="w-5 h-5" />
                    Initialize Journey
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => navigate('/dashboard')}
                    className="px-10 bg-zinc-900 text-white font-black py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition-all uppercase tracking-widest text-sm"
                  >
                    Cancel
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateItinerary;