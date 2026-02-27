import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/Header';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Edit,
  Trash2
} from 'lucide-react';
import api from '../utils/api';
import { AppContext } from '../context/AppContext';

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

  useEffect(() => {
    fetchItinerary();
    // eslint-disable-next-line
  }, [id]);

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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      try {
        await api.delete(`/itineraries/${id}`);
        // Remove from AppContext
        setItineraries(itineraries.filter(t => t.id !== selectedItinerary.id));
        navigate('/dashboard');
      } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete itinerary");
      }
    }
  };

  const handleSavePlan = async () => {
    const activitiesArray = activitiesInput
      .split("\n")
      .filter(a => a.trim() !== "");

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

  if (loading) return <div className="text-white p-6">Loading itinerary...</div>;
  if (!selectedItinerary) return null;

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-6xl mx-auto p-6 lg:p-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        {/* Hero Section */}
        <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
          <img
            src={selectedItinerary.image}
            alt={selectedItinerary.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              {selectedItinerary.destination}
            </h1>

            <div className="flex items-center gap-6 text-white">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {new Date(selectedItinerary.startDate).toLocaleDateString()} -{" "}
                  {new Date(selectedItinerary.endDate).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
               {(() => {
  const start = new Date(selectedItinerary.startDate);
  const end = new Date(selectedItinerary.endDate);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) ;
  return days;
})()} Days
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{selectedItinerary.dayPlans?.length || 0} Activities</span>
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Description */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">About This Trip</h2>
              <p className="text-gray-300">{selectedItinerary.description}</p>
            </div>

            {/* Daily Plans */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Daily Itinerary</h2>

              {selectedItinerary.dayPlans?.length > 0 && (
                <div className="space-y-4 mb-6">
                  {selectedItinerary.dayPlans.map((dayPlan) => (
                    <div key={dayPlan.id} className="border border-zinc-800 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-lg font-semibold text-white">
                          Day {dayPlan.day}: {dayPlan.title}
                        </h3>

                        <button
                          onClick={() => {
                            setEditingId(dayPlan.id);
                            setTitle(dayPlan.title);
                            setActivitiesInput(dayPlan.activities.join("\n"));
                            setIsAdding(true);
                          }}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Edit
                        </button>
                      </div>

                      <ul className="space-y-2">
                        {dayPlan.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-300">
                            <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {!isAdding && (
                <button
                  onClick={() => {
                    setIsAdding(true);
                    setEditingId(null);
                    setTitle("");
                    setActivitiesInput("");
                  }}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  + Add Plan
                </button>
              )}

              {isAdding && (
                <div className="mt-6 border border-zinc-700 rounded-lg p-4 space-y-4">
                  <input
                    type="text"
                    placeholder="Day Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-black border border-zinc-700 text-white p-2 rounded"
                  />
                  <textarea
                    placeholder="Enter activities (one per line)"
                    value={activitiesInput}
                    onChange={(e) => setActivitiesInput(e.target.value)}
                    rows={4}
                    className="w-full bg-black border border-zinc-700 text-white p-2 rounded"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleSavePlan}
                      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsAdding(false);
                        setEditingId(null);
                      }}
                      className="bg-zinc-800 text-white px-4 py-2 rounded hover:bg-zinc-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Budget</h3>
              <p className="text-3xl font-bold text-red-600">{selectedItinerary.budget}</p>
              <p className="text-gray-400 text-sm mt-2">Estimated total cost</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-3">
              <button
                onClick={() => navigate(`/edit-itinerary/${id}`)}
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
              >
                <Edit className="w-5 h-5" /> Edit Itinerary
              </button>

              <button
                onClick={handleDelete}
                className="w-full bg-zinc-800 text-red-600 font-semibold py-3 rounded-lg hover:bg-red-600 hover:text-white transition flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" /> Delete
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ItineraryDetails;