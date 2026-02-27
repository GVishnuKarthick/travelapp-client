import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Travel enthusiast exploring the world one destination at a time.',
    location: 'New York, USA'
  });
  const [itineraries, setItineraries] = useState([]);
  const [memories, setMemories] = useState([]);

  // Fetch data on mount if logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
      fetchItineraries();
      fetchMemories();
    }
  }, [isLoggedIn]);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profile');
      setUserProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const fetchItineraries = async () => {
    try {
      const response = await api.get('/itineraries');
      setItineraries(response.data);
    } catch (error) {
      console.error('Failed to fetch itineraries', error);
    }
  };

  const fetchMemories = async () => {
    try {
      const response = await api.get('/memories');
      setMemories(response.data);
    } catch (error) {
      console.error('Failed to fetch memories', error);
    }
  };

  const deleteItinerary = async (id) => {
    try {
      await api.delete(`/itineraries/${id}`);
      fetchItineraries(); // Refresh list
    } catch (error) {
      console.error('Failed to delete itinerary', error);
    }
  };

  const likeMemory = async (id) => {
    const memory = memories.find(m => m.id === id);
    if (memory) {
      const updated = { ...memory, liked: !memory.liked };
      try {
        await api.put(`/memories/${id}`, updated);
        fetchMemories(); // Refresh
      } catch (error) {
        console.error('Failed to update memory', error);
      }
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn, setIsLoggedIn,
        isSidebarOpen, setIsSidebarOpen,
        searchQuery, setSearchQuery,
        userProfile, setUserProfile,
        itineraries, setItineraries,
        memories, setMemories,
        deleteItinerary,
        likeMemory,
        fetchItineraries,
        fetchMemories
      }}
    >
      {children}
    </AppContext.Provider>
  );
};