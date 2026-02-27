import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Calendar, Clock, MapPin, Plane, Plus } from 'lucide-react';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const context = useContext(AppContext);
  if (!context) return <div>Context not available.</div>;

  const { itineraries, searchQuery } = context;
  const navigate = useNavigate();

  const filteredItineraries = itineraries.filter(trip =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const today = new Date();
  const upcomingTrips = itineraries.filter(trip => new Date(trip.startDate) > today);

  const countries = itineraries
    .map(trip => {
      if (!trip.destination) return null;
      const parts = trip.destination.split(',');
      return parts.length > 1 ? parts[1].trim() : null;
    })
    .filter(Boolean);
  const uniqueCountries = new Set(countries);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">My Itineraries</h2>
              <p className="text-gray-400">Plan and manage your travel adventures</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Total Trips</p>
                    <p className="text-3xl font-bold text-white">{itineraries.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Upcoming</p>
                    <p className="text-3xl font-bold text-white">{upcomingTrips.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Countries</p>
                    <p className="text-3xl font-bold text-white">{uniqueCountries.size}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                    <Plane className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItineraries.map((trip) => (
                <div
                  key={trip.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-600 transition-all duration-300 group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {(() => {
  const start = new Date(trip.startDate);
  const end = new Date(trip.endDate);
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  return days;
})()} Days
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{trip.destination}</h3>

                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      <p className="text-gray-400 text-sm">
                        {new Date(trip.startDate).toLocaleDateString()} -{" "}
                        {new Date(trip.endDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{trip.dayPlans?.length || 0} Activities</span>
                      </div>

                      <button
                        onClick={() => navigate(`/itinerary/${trip.id}`)}
                        className="text-red-600 hover:text-red-500 font-semibold text-sm"
                      >
                        View Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add New Card */}
              <div
                onClick={() => navigate('/create')}
                className="bg-zinc-900 border-2 border-dashed border-zinc-700 rounded-xl flex items-center justify-center hover:border-red-600 transition-all duration-300 cursor-pointer group min-h-[384px]"
              >
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600/30 transition">
                    <Plus className="w-8 h-8 text-red-600" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Create New Itinerary</h3>
                  <p className="text-gray-400 text-sm">Start planning your next adventure</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;