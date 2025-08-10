import { useEffect, useState } from "react";
import { TripData } from "../types";
import axios from "axios";

const During = () => {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const tripsResponse = await axios.get("http://127.0.0.1:8000/api/trip/");
      console.log("trip: ", tripsResponse.data);
      setTrips(tripsResponse.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  const handleTripDetails = (trip: TripData) => {
    console.log("Trip: ", trip.destination);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 font-medium">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-300 to-teal-600 p-6">
      <div
        className="justify-center items-center text-teal-700 font-bold text-3xl bg-amber-50
                   rounded-2xl w-[95%] h-fit mx-auto p-4 border-1 border-teal-400 "
      >
        <p className="p-3">Trips:</p>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {trips.map((trip: TripData) => (
            <button
              key={trip.id}
              onClick={() => handleTripDetails(trip)}
              className="group relative text-xl font-semibold bg-amber-50 text-teal-600 rounded-full p-4 mx-3
                         border-1 border-teal-400  min-h-[60px] flex items-center justify-center text-center
                         hover:bg-teal-500 hover:text-white hover:cursor-pointer transition-all duration-300 transform"
            >
              {trip.destination}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default During;
