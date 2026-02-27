import React, { useState, useContext } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Edit, MapPin, Save, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import api from '../utils/api';

const ProfilePage = () => {
  const context = useContext(AppContext);
  if (!context) {
    console.error('ProfilePage must be used within AppProvider');
    return <div>Context not available.</div>;
  }

  const { userProfile, setUserProfile } = context;
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);

  const handleSaveProfile = async () => {
    try {
      await api.put('/profile', editedProfile);
      setUserProfile(editedProfile);
      //sfetchProfile();
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile', error);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">My Profile</h2>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-8 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8">
                <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{userProfile.name}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm mb-1">{userProfile.email}</p>
                    <div className="flex items-center gap-1 sm:gap-2 text-gray-400 text-xs sm:text-sm">
                      <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>{userProfile.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
                >
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black border border-zinc-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black border border-zinc-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Location</label>
                    <input
                      type="text"
                      value={editedProfile.location}
                      onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black border border-zinc-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-red-600 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Bio</label>
                    <textarea
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-black border border-zinc-700 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:border-red-600 transition h-20 sm:h-24 resize-none"
                    ></textarea>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-red-600 text-white font-semibold py-2 sm:py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                  >
                    <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div>
                  <h4 className="text-gray-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Bio</h4>
                  <p className="text-white text-sm sm:text-base">{userProfile.bio}</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;