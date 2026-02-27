import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, ArrowLeft } from "lucide-react";
import api from "../utils/api";

const EditItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  destination: "",
  description: "",
  budget: "",
  startDate: "",
  endDate: "",
  image: ""
});

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItinerary();
  }, [id]);

  const fetchItinerary = async () => {
    try {
      const res = await api.get(`/itineraries/${id}`);
      setFormData(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching itinerary", error);
      alert("Failed to load itinerary");
      navigate("/dashboard");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/itineraries/${id}`, formData);
      alert("Itinerary updated successfully!");
      navigate(`/itinerary/${id}`); // 🔥 Return to details page
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update itinerary");
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading itinerary...</div>;
  }

  return (
    <div className="min-h-screen bg-black flex justify-center items-center p-6">
      <div className="bg-zinc-900 w-full max-w-xl p-6 rounded-2xl shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Edit Itinerary
          </h2>

          <button
            onClick={() => navigate(`/itinerary/${id}`)}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">

          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="Destination"
            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          />

   
          <input
  type="date"
  name="startDate"
  value={formData.startDate?.split("T")[0] || ""}
  onChange={handleChange}
  className="w-full p-3 bg-zinc-800 text-white rounded-lg"
/>

<input
  type="date"
  name="endDate"
  value={formData.endDate?.split("T")[0] || ""}
  onChange={handleChange}
  className="w-full p-3 bg-zinc-800 text-white rounded-lg"
/>

          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Trip Description"
            rows="4"
            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          />

          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            placeholder="Number of Days"
            className="w-full p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700 focus:outline-none"
          />
          

        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="mt-6 w-full flex justify-center items-center gap-2 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition"
        >
          <Save className="w-5 h-5" />
          Save Changes
        </button>

      </div>
    </div>
  );
};

export default EditItinerary;