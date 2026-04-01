import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Journal, Trash2, Edit3, Plus, Image as ImageIcon, Heart, MapPin, Calendar, Clock } from "lucide-react";

const MemoriesPage = () => {
  const { itineraries } = useContext(AppContext);

  const [memories, setMemories] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [type, setType] = useState("photo");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [formData, setFormData] = useState({
    imageUrl: "",
    caption: "",
    note: "",
    mood: "",
    highlight: "",
    dayNumber: ""
  });

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await api.get("/memories");
      setMemories(res.data);
    } catch (err) {
      console.error("Failed to fetch memories", err);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTrip) return alert("Select a trip");

    const payload = {
      tripId: Number(selectedTrip),
      type,
      imageUrl: formData.imageUrl || null,
      caption: formData.caption || null,
      note: formData.note || null,
      mood: formData.mood || null,
      highlight: formData.highlight || null,
      dayNumber: formData.dayNumber ? Number(formData.dayNumber) : null
    };

    try {
      if (editingId) {
        await api.put(`/memories/${editingId}`, {
          id: editingId,
          ...payload
        });

        setMemories(prev =>
          prev.map(m =>
            m.id === editingId ? { ...m, ...payload } : m
          )
        );

        setEditingId(null);
      } else {
        const res = await api.post("/memories", payload);
        setMemories(prev => [res.data, ...prev]);
      }

      setFormData({
        imageUrl: "",
        caption: "",
        note: "",
        mood: "",
        highlight: "",
        dayNumber: ""
      });
      setIsFormOpen(false);

    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this memory?")) return;

    try {
      await api.delete(`/memories/${id}`);
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (memory) => {
    setEditingId(memory.id);
    setSelectedTrip(memory.tripId);
    setType(memory.type);
    setIsFormOpen(true);

    setFormData({
      imageUrl: memory.imageUrl || "",
      caption: memory.caption || "",
      note: memory.note || "",
      mood: memory.mood || "",
      highlight: memory.highlight || "",
      dayNumber: memory.dayNumber || ""
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const groupedTrips = itineraries.map(trip => ({
    ...trip,
    memories: memories.filter(m => m.tripId === trip.id)
  }));

  return (
    <div className="min-h-screen bg-black selection:bg-red-500/30">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-10 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-40 left-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-6xl mx-auto relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-10"
            >
              <div>
                <h2 className="text-4xl font-black text-white mb-2 tracking-tight uppercase">Memories Journal</h2>
                <p className="text-zinc-500 font-bold text-sm tracking-widest uppercase">Capturing your world, one moment at a time.</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFormOpen(!isFormOpen)}
                className="bg-red-600 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-red-600/20 hover:bg-red-700 transition flex items-center gap-2 text-sm uppercase tracking-widest"
              >
                <Plus className="w-5 h-5" />
                {isFormOpen ? "CLOSE" : "ADD MEMORY"}
              </motion.button>
            </motion.div>

            <AnimatePresence>
              {isFormOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="glass-card rounded-3xl p-8 mb-12 border-red-600/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Select Adventure</label>
                          <select
                            value={selectedTrip}
                            onChange={(e) => setSelectedTrip(e.target.value)}
                            className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition appearance-none cursor-pointer"
                          >
                            <option value="">Where did you go?</option>
                            {itineraries.map(trip => (
                              <option key={trip.id} value={trip.id}>{trip.destination}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Memory Type</label>
                          <div className="flex gap-4 p-1.5 bg-black rounded-2xl border border-zinc-800">
                             {['photo', 'journal'].map((t) => (
                               <button 
                                 key={t}
                                 onClick={() => setType(t)}
                                 className={`flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${type === t ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
                               >
                                 {t}
                               </button>
                             ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {type === "photo" ? (
                          <>
                            <div>
                              <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Image URL</label>
                              <input
                                placeholder="Paste the link to your photo..."
                                className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition"
                                value={formData.imageUrl}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                              />
                            </div>
                            <div>
                               <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Caption</label>
                               <input
                                 placeholder="What's happening in this shot?"
                                 className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition"
                                 value={formData.caption}
                                 onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                               />
                            </div>
                          </>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                               <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Day #</label>
                               <input
                                 type="number"
                                 placeholder="1"
                                 className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition"
                                 value={formData.dayNumber}
                                 onChange={(e) => setFormData({ ...formData, dayNumber: e.target.value })}
                               />
                            </div>
                            <div>
                               <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Mood</label>
                               <input
                                 placeholder="Excited, Relaxed..."
                                 className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition"
                                 value={formData.mood}
                                 onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                               />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {type === "journal" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                           <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">The Highlight</label>
                           <input
                             placeholder="The absolute best moment..."
                             className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition"
                             value={formData.highlight}
                             onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                           />
                        </div>
                        <div>
                           <label className="block text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-2 ml-2">Notes</label>
                           <textarea
                             placeholder="Write down the details..."
                             className="w-full px-5 py-4 bg-black border border-zinc-800 rounded-2xl text-white font-bold focus:outline-none focus:border-red-600 transition h-14 resize-none"
                             value={formData.note}
                             onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                           />
                        </div>
                      </div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleSubmit}
                      className="w-full bg-white text-black font-black py-4 rounded-2xl hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm"
                    >
                      {editingId ? "UPDATE MEMORY" : "SAVE TO JOURNAL"}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GALLERIES */}
            <div className="space-y-16">
              {groupedTrips.map(trip => (
                <motion.div 
                  key={trip.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-end justify-between mb-8 border-b border-zinc-800/50 pb-4">
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-tighter uppercase line-clamp-1">{trip.destination}</h3>
                      <div className="flex items-center gap-3 mt-1">
                         <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">{trip.memories.length} MOMENTS</span>
                         <div className="w-1 h-1 rounded-full bg-zinc-800" />
                         <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{new Date(trip.startDate).getFullYear()}</span>
                      </div>
                    </div>
                  </div>

                  {trip.memories.length === 0 ? (
                    <div className="py-12 text-center glass-card rounded-3xl border-dashed">
                       <Camera className="w-10 h-10 text-zinc-800 mx-auto mb-3" />
                       <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No memories recorded for this trip yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trip.memories.map((memo, idx) => (
                        <motion.div 
                          key={memo.id}
                          whileHover={{ y: -8 }}
                          className="glass-card rounded-[2rem] overflow-hidden group border-white/5 h-full flex flex-col"
                        >
                          {memo.type === "photo" ? (
                            <div className="relative h-64 overflow-hidden">
                              <img src={memo.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute bottom-5 left-5 right-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                 <p className="text-white font-bold text-sm leading-tight italic">"{memo.caption}"</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-8 h-64 bg-zinc-900/50 flex flex-col justify-center relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full blur-2xl" />
                              <div className="flex items-center gap-2 mb-4">
                                <Clock className="w-4 h-4 text-red-500" />
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter">Day {memo.dayNumber} Journal</span>
                              </div>
                              <p className="text-white text-lg font-medium leading-relaxed italic mb-4 line-clamp-3">"{memo.note}"</p>
                              <div className="mt-auto">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/10 rounded-full text-red-500 text-[10px] font-black uppercase">
                                  <Heart className="w-3 h-3 fill-red-500" /> {memo.mood}
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="p-5 mt-auto flex items-center justify-between border-t border-white/5 bg-white/2">
                            <div className="flex items-center gap-2">
                               <button 
                                 onClick={() => handleEdit(memo)}
                                 className="w-9 h-9 glass rounded-xl flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                               >
                                 <Edit3 className="w-4 h-4" />
                               </button>
                               <button 
                                 onClick={() => handleDelete(memo.id)}
                                 className="w-9 h-9 glass rounded-xl flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                            </div>
                            
                            {memo.type === "photo" && (
                              <div className="flex items-center gap-1.5 py-1 px-3 glass rounded-full">
                                <ImageIcon className="w-3 h-3 text-red-500" />
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">Photo</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemoriesPage;