import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const PublicItinerary = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);

  useEffect(() => {
    fetchItinerary();
  }, []);

  const fetchItinerary = async () => {
    try {
      const res = await api.get(`/itineraries/${id}`);
      setItinerary(res.data);
    } catch (error) {
      console.error("Error fetching itinerary", error);
    }
  };

  if (!itinerary) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">{itinerary.destination}</h1>
      <p>{itinerary.dates}</p>
      <p>{itinerary.description}</p>
      <p>Budget: ${itinerary.budget}</p>
    </div>
  );
};

export default PublicItinerary;