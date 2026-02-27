import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import api from "../utils/api";
import { AppContext } from "../context/AppContext";

const MemoriesPage = () => {
  const { itineraries } = useContext(AppContext);

  const [memories, setMemories] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState("");
  const [type, setType] = useState("photo");
  const [editingId, setEditingId] = useState(null);

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
    const res = await api.get("/memories");
    setMemories(res.data);
  };

  // ✅ ADD / UPDATE MEMORY
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

    } catch (err) {
      console.error(err);
      alert("Operation failed");
    }
  };

  // ✅ DELETE SINGLE MEMORY
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

  // ✅ DELETE ALL MEMORIES OF A TRIP
  const handleDeleteTripMemories = async (tripId) => {
    if (!window.confirm("Delete ALL memories of this trip?")) return;

    const tripMemories = memories.filter(m => m.tripId === tripId);

    try {
      await Promise.all(
        tripMemories.map(m => api.delete(`/memories/${m.id}`))
      );

      setMemories(prev => prev.filter(m => m.tripId !== tripId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete trip memories");
    }
  };

  // ✅ EDIT MEMORY
  const handleEdit = (memory) => {
    setEditingId(memory.id);
    setSelectedTrip(memory.tripId);
    setType(memory.type);

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
    <div className="min-h-screen bg-black">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-6xl mx-auto text-white">

            <h2 className="text-3xl font-bold mb-6">
              Trip Memories Journal
            </h2>

            {/* FORM */}
            <div className="bg-zinc-900 p-6 rounded-xl mb-10 space-y-4">

              <select
                value={selectedTrip}
                onChange={(e) => setSelectedTrip(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded"
              >
                <option value="">Select Trip</option>
                {itineraries.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    {trip.destination} ({trip.dates})
                  </option>
                ))}
              </select>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 bg-zinc-800 rounded"
              >
                <option value="photo">Photo</option>
                <option value="journal">Journal</option>
              </select>

              {type === "photo" && (
                <>
                  <input
                    placeholder="Image URL"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.imageUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                  />
                  <input
                    placeholder="Caption"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.caption}
                    onChange={(e) =>
                      setFormData({ ...formData, caption: e.target.value })
                    }
                  />
                </>
              )}

              {type === "journal" && (
                <>
                  <input
                    type="number"
                    placeholder="Day Number"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.dayNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, dayNumber: e.target.value })
                    }
                  />
                  <input
                    placeholder="Mood"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.mood}
                    onChange={(e) =>
                      setFormData({ ...formData, mood: e.target.value })
                    }
                  />
                  <textarea
                    placeholder="Journal Note"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                  <input
                    placeholder="Highlight"
                    className="w-full p-3 bg-zinc-800 rounded"
                    value={formData.highlight}
                    onChange={(e) =>
                      setFormData({ ...formData, highlight: e.target.value })
                    }
                  />
                </>
              )}

              <button
                onClick={handleSubmit}
                className="bg-red-600 px-6 py-2 rounded"
              >
                {editingId ? "Update Memory" : "Add Memory"}
              </button>
            </div>

            {/* DISPLAY */}
            {groupedTrips.map(trip => (
              <div key={trip.id} className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">
                    {trip.destination} ({trip.dates})
                  </h3>
                  {trip.memories.length > 0 && (
                    <button
                      onClick={() => handleDeleteTripMemories(trip.id)}
                      className="bg-red-700 px-3 py-1 text-sm rounded"
                    >
                      Delete All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {trip.memories
                    .filter(m => m.type === "photo")
                    .map(photo => (
                      <div key={photo.id} className="bg-zinc-900 p-4 rounded relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleEdit(photo)}
                            className="bg-yellow-600 px-2 py-1 text-xs rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(photo.id)}
                            className="bg-red-600 px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>
                        </div>

                        <img
                          src={photo.imageUrl}
                          className="w-full h-40 object-cover rounded"
                        />
                        <p className="mt-2 text-gray-300">
                          {photo.caption}
                        </p>
                      </div>
                  ))}
                </div>

                <div className="space-y-4">
                  {trip.memories
                    .filter(m => m.type === "journal")
                    .map(journal => (
                      <div key={journal.id} className="bg-zinc-900 p-4 rounded relative">
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => handleEdit(journal)}
                            className="bg-yellow-600 px-2 py-1 text-xs rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(journal.id)}
                            className="bg-red-600 px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>
                        </div>

                        <p className="font-semibold">
                          Day {journal.dayNumber} – {journal.mood}
                        </p>
                        <p className="mt-2 text-gray-300">
                          {journal.note}
                        </p>
                        <p className="text-red-500 mt-1">
                          ⭐ {journal.highlight}
                        </p>
                      </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
};

export default MemoriesPage;