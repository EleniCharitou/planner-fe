import { useEffect, useState } from "react";
import { TripData } from "../types";
import axios from "axios";
import KanbanBoard from "../components/KanbanBoard";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import backendUrl from "../config";

const During = () => {
  const TRIPS_PER_PAGE = 8;

  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(TRIPS_PER_PAGE);
  const [selectedTrip, setSelectedTrip] = useState<TripData | null>(null);

  const visibleTrips = trips.slice(0, visibleCount);
  const hasMoreTrips = trips.length > visibleCount;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const tripsResponse = await axios.get(`${backendUrl}/trip/`);
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
    setSelectedTrip(trip);
  };

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + TRIPS_PER_PAGE, trips.length));
    console.log(visibleCount);
  };
  const handleShowLess = () => {
    setVisibleCount(TRIPS_PER_PAGE);
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
                   rounded-2xl w-[95%] mx-auto p-3 border-1 border-teal-400 "
      >
        <p className="p-3">Trips:</p>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {visibleTrips.map((trip: TripData) => (
            <button
              key={trip.id}
              onClick={() => handleTripDetails(trip)}
              className="group relative text-lg font-semibold bg-amber-50 text-teal-600 rounded-full p-4 mx-3
                         border-1 border-teal-400  min-h-[60px] flex items-center justify-center text-center
                         hover:bg-teal-500 hover:text-white hover:cursor-pointer transition-all duration-300 transform"
            >
              {trip.destination}
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3">
          {hasMoreTrips && (
            <button
              onClick={handleShowMore}
              className="flex items-center justify-end font-medium bg-teal-800 text-sm text-amber-50 rounded-full p-2 
                         hover:cursor-pointer hover:shadow-xl hover:shadow-teal-300"
            >
              Show More
              <IoMdArrowDropdown />
            </button>
          )}
          {visibleCount > TRIPS_PER_PAGE && (
            <button
              className="flex items-center justify-end font-medium text-sm bg-teal-800 text-amber-50 rounded-full p-2 
                         hover:cursor-pointer hover:shadow-xl hover:shadow-teal-300"
              onClick={handleShowLess}
            >
              Show less
              <IoMdArrowDropup />
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board - only show when trip is selected */}
      {selectedTrip && (
        <div className="bg-amber-50/50 rounded-2xl w-[95%] mx-auto p-6 mt-8 border border-teal-400">
          <h2 className="text-2xl font-bold text-teal-700 mb-4">
            Your plan for{" "}
            <span className="italic font-medium">
              {selectedTrip.destination}
            </span>
            <span>✨</span>
          </h2>
          <KanbanBoard tripId={selectedTrip.id} />
        </div>
      )}
    </div>
  );
};

export default During;
