export const handleDeleteItinerary = (id, setItineraries, setCurrentPage) => {
  setItineraries((prev) => prev.filter(item => item.id !== id));
  setCurrentPage('dashboard');
};

export const toggleLikeMemory = (id, setMemories) => {
  setMemories((prev) => prev.map(mem =>
    mem.id === id ? {...mem, liked: !mem.liked} : mem
  ));
};