import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { ArrowLeft, Save } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';

const CreateItinerary = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('CreateItinerary must be used within AppProvider');
    return <div>Context not available. Wrap in AppProvider.</div>;
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

  const start = new Date(formData.startDate);
  const end = new Date(formData.endDate);

  const cleanBudget = formData.budget.replace(/[^0-9.]/g, '');

  const newItinerary = {
    destination: formData.destination,
    startDate: formData.startDate,   // ✅ send real date
    endDate: formData.endDate,       // ✅ send real date
    image: formData.image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    activities: 0,
    description: formData.description,
    budget: cleanBudget,
    dayPlans: []
  };

  try {
    await api.post('/itineraries', newItinerary);
    alert('Itinerary created successfully!');
    fetchItineraries();
    navigate('/dashboard');
  } catch (error) {
    alert('Failed to create itinerary');
  }
};

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create New Itinerary</h2>
          <p className="text-gray-400 mb-8">Plan your next amazing adventure</p>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Destination</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  placeholder="e.g., Bali, Indonesia"
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Budget (USD)</label>
                <input
                  type="text"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="$2,500"
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Image URL (Optional)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your trip..."
                  className="w-full px-4 py-3 bg-black border border-zinc-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-600 transition h-32 resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition duration-200 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                Create Itinerary
              </button>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 bg-zinc-800 text-white font-semibold py-3 rounded-lg hover:bg-zinc-700 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateItinerary;