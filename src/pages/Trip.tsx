import { useState } from "react";
import TripModal from "../components/trip-planning/TripModal";
import { TripData } from "../types";

const Trip = () => {
  const [showModal, setShowModal] = useState(false);
  const [tripInfo, setTripInfo] = useState<TripData>();

  const handleFormSubmit = async (tripInfo: TripData) => {
    try {
      const response = await fetch("http://localhost:8000/api/trip/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          destination: tripInfo.destination,
          trip_members: tripInfo.trip_members,
          start_date: tripInfo.start_date,
          start_time: tripInfo.start_time,
          end_date: tripInfo.end_date,
          end_time: tripInfo.end_time,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error("Failed to create trip");
      }

      const newTrip = await response.json();
      setTripInfo(newTrip);
    } catch (error) {
      console.error("Error creating trip:", error);
    } finally {
      setShowModal(false);
    }
  };

  if (showModal) {
    return (
      <TripModal
        onSubmit={handleFormSubmit}
        onClose={() => setShowModal(false)}
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-100 via-teal-300 to-teal-600">
      <button
        onClick={() => setShowModal(true)}
        className="text-2xl font-semibold bg-teal-500 rounded-lg p-6
                         hover:scale-150 ease-in-out duration-300 hover:cursor-pointer
                          hover:shadow-amber-100/80 hover:shadow-lg hover:inset-shadow-sm hover:inset-shadow-teal-800/50"
      >
        Start planning your trip
      </button>
    </div>
  );
};

export default Trip;
