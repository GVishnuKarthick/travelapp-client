import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2,
  Plus,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Info
} from 'lucide-react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

const ItineraryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { itineraries, setItineraries } = useContext(AppContext);

  const [selectedItinerary, setSelectedItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState("");
  const [activitiesInput, setActivitiesInput] = useState("");

  const fetchItinerary = async () => {
    try {
      const res = await api.get(`/itineraries/${id}`);
      setSelectedItinerary(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch itinerary", error);
      navigate("/dashboard");
    }
  };

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Delete this adventure? This cannot be undone.')) {
      try {
        await api.delete(`/itineraries/${id}`);
        setItineraries(itineraries.filter(t => t.id !== id));
        navigate('/dashboard');
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const handleSavePlan = async () => {
    const activitiesArray = activitiesInput.split("\n").map(a => a.trim()).filter(a => a !== "");
    try {
      if (editingId) {
        await api.put(`/itineraries/${id}/dayplans/${editingId}`, {
          day: selectedItinerary.dayPlans.find(d => d.id === editingId).day,
          title,
          activities: activitiesArray
        });
      } else {
        await api.post(`/itineraries/${id}/dayplans`, {
          day: selectedItinerary.dayPlans?.length + 1 || 1,
          title,
          activities: activitiesArray
        });
      }
      setIsAdding(false);
      setEditingId(null);
      setTitle("");
      setActivitiesInput("");
      fetchItinerary();
    } catch (err) {
      console.error("Failed to save plan", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">Loading Adventure...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            
            {/* Nav & Action Bar */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-8"
            >
              <button
                onClick={() => navigate('/dashboard')}
                className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Trips
              </button>
              
              <div className="flex gap-3">
                 <button 
                   onClick={() => navigate(`/edit-itinerary/${id}`)}
                   className="p-3 glass rounded-xl text-zinc-400 hover:text-white transition-all"
                 >
                   <Edit className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={handleDelete}
                   className="p-3 glass rounded-xl text-zinc-400 hover:text-red-500 transition-all"
                 >
                   <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-[450px] rounded-[3rem] overflow-hidden mb-12 shadow-2xl glass border-white/5"
            >
              <img
                src={selectedItinerary.image || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070'}
                alt={selectedItinerary.destination}
                className="w-full h-full object-cover scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-12">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-block px-4 py-1.5 bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full mb-4 shadow-[0_0_20px_rgba(220,38,38,0.5)]"
                >
                  Active Journey
                </motion.span>
                <h1 className="text-7xl font-black text-white mb-6 uppercase tracking-tighter leading-none">
                  {selectedItinerary.destination}
                </h1>

                <div className="flex flex-wrap items-center gap-8 text-white/80">
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-sm">
                      {new Date(selectedItinerary.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} -{" "}
                      {new Date(selectedItinerary.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                    <Clock className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-sm">
                      {Math.ceil((new Date(selectedItinerary.endDate) - new Date(selectedItinerary.startDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                    </span>
                  </div>

                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-white/10">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className="font-bold text-sm">{selectedItinerary.dayPlans?.length || 0} Total Plans</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* LEFT: Details & Plans */}
              <div className="lg:col-span-2 space-y-10">
                
                {/* About Card */}
                <motion.div 
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  viewport={{ once: true }}
                  className="glass-card rounded-[2.5rem] p-10 relative overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600/5 rounded-full blur-3xl" />
                  <div className="flex items-center gap-3 mb-6">
                    <Info className="w-6 h-6 text-red-500" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">The Vision</h2>
                  </div>
                  <p className="text-zinc-400 text-lg leading-relaxed italic font-medium">
                    "{selectedItinerary.description || 'No description provided for this adventure. Let the road guide you!'}"
                  </p>
                </motion.div>

                {/* Daily Itinerary */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-8 px-4">
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                       <TrendingUp className="w-6 h-6 text-red-500" />
                       Experience Timeline
                    </h2>
                    {!isAdding && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setIsAdding(true); setEditingId(null); setTitle(""); setActivitiesInput(""); }}
                        className="p-3 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-600/20"
                      >
                        <Plus className="w-6 h-6" />
                      </motion.button>
                    )}
                  </div>

                  <AnimatePresence mode="popLayout">
                    {/* Add Plan Form Overlay */}
                    {isAdding && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-card rounded-[2rem] p-8 mb-10 border-red-500/30"
                      >
                        <h3 className="text-white font-black uppercase text-sm mb-6 tracking-widest pl-2">
                           {editingId ? 'Refine Daily Plan' : 'Add New Chapter'}
                        </h3>
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Destination or Theme of the Day"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black border border-zinc-800 text-white px-6 py-4 rounded-2xl font-bold focus:border-red-600 transition outline-none"
                          />
                          <textarea
                            placeholder="Planned activities (one per line)..."
                            value={activitiesInput}
                            onChange={(e) => setActivitiesInput(e.target.value)}
                            rows={4}
                            className="w-full bg-black border border-zinc-800 text-white px-6 py-4 rounded-2xl font-bold focus:border-red-600 transition outline-none h-32 resize-none"
                          />
                          <div className="flex gap-4 pt-2">
                            <button onClick={handleSavePlan} className="flex-1 bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition uppercase tracking-widest text-xs">Save Plan</button>
                            <button onClick={() => setIsAdding(false)} className="px-8 bg-zinc-900 text-white font-black py-4 rounded-2xl border border-zinc-800 hover:bg-zinc-800 transition uppercase tracking-widest text-xs">Cancel</button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Timeline Interaction */}
                    {selectedItinerary.dayPlans?.map((plan, index) => (
                      <motion.div 
                        key={plan.id}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        className="relative pl-12 pb-10 last:pb-0"
                      >
                        {/* Vertical Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-1 bg-zinc-800/50 rounded-full" />
                        
                        {/* Node */}
                        <div className="absolute left-0 top-0 w-9 h-9 bg-black border-4 border-red-600 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(220,38,38,0.5)] z-10" />

                        <div className="glass-card rounded-3xl p-8 group hover:border-white/10">
                          <div className="flex justify-between items-start mb-6">
                             <div>
                               <span className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1 block">Chapter {plan.day}</span>
                               <h3 className="text-2xl font-black text-white uppercase tracking-tight">{plan.title}</h3>
                             </div>
                             <button
                               onClick={() => { setEditingId(plan.id); setTitle(plan.title); setActivitiesInput(plan.activities.join("\n")); setIsAdding(true); }}
                               className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-white"
                             >
                               <Edit className="w-4 h-4" />
                             </button>
                          </div>

                          <div className="space-y-4">
                             {plan.activities.map((act, i) => (
                               <div key={i} className="flex items-center gap-4 bg-white/2 px-5 py-4 rounded-2xl border border-white/[0.03] group/item hover:bg-white/5 transition-all">
                                 <div className="w-2 h-2 rounded-full bg-red-600 group-hover/item:scale-125 transition-transform" />
                                 <span className="text-zinc-300 font-bold tracking-wide">{act}</span>
                                 <ChevronRight className="ml-auto w-4 h-4 text-zinc-700 group-hover/item:text-red-500 transition-colors" />
                               </div>
                             ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: Meta Info */}
              <div className="space-y-8">
                 <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card rounded-[2.5rem] p-10 bg-gradient-to-br from-zinc-900/40 to-red-900/10 border-red-600/10"
                 >
                    <div className="flex items-center gap-3 mb-6">
                       <CreditCard className="w-6 h-6 text-red-500" />
                       <h3 className="text-xl font-black text-white uppercase tracking-tight">Investment</h3>
                    </div>
                    <p className="text-5xl font-black text-white mb-2 tracking-tighter">{selectedItinerary.budget || '$0'}</p>
                    <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">Total Estimated Budget</p>
                    
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                       <div className="text-center">
                          <p className="text-white font-black text-lg">H1</p>
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter">Tier</p>
                       </div>
                       <div className="w-px h-8 bg-zinc-800" />
                       <div className="text-center">
                          <p className="text-white font-black text-lg">VIP</p>
                          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter">Status</p>
                       </div>
                    </div>
                 </motion.div>

                 <div className="glass-card rounded-[2.5rem] p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl" />
                    <h4 className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">Adventure Map</h4>
                    <div className="aspect-square bg-zinc-950 rounded-3xl border border-white/5 flex flex-col items-center justify-center p-8 text-center">
                       <MapPin className="w-12 h-12 text-zinc-800 mb-4 animate-bounce" />
                       <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest leading-loose">Visual mapping coming in next update</p>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItineraryDetails;