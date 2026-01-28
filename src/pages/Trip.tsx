import { useState } from "react";
import TripModal from "../components/trip-planning/TripModal";
import { TripData } from "../types";
import api from "../api";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Trip = () => {
  const [showModal, setShowModal] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const navigate = useNavigate();

  const calculateTripDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDifference = end.getTime() - start.getTime();
    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return dayDifference + 1;
  };

  const createColumnsInDatabase = async (
    tripId: number,
    startDate: string,
    numberOfDays: number,
  ) => {
    try {
      const columns = [];

      const backlogResponse = await api.post("/column/", {
        trip_id: tripId,
        title: "🎯 Attractions to Visit",
        position: 0,
      });
      columns.push(backlogResponse.data);

      const start = new Date(startDate);

      for (let i = 0; i < numberOfDays; i++) {
        const currentDate = new Date(start);
        currentDate.setDate(start.getDate() + i);

        const formattedDate = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        const dayResponse = await api.post("/column/", {
          trip_id: tripId,
          title: `Day ${i + 1} - ${formattedDate}`,
          position: i + 1,
        });

        columns.push(dayResponse.data);
      }

      return columns;
    } catch (error) {
      console.error("Error creating columns:", error);
      throw error;
    }
  };

  const handleTripCreated = async (newTrip: TripData) => {
    setIsCreatingTrip(true);
    try {
      const numberOfDays = calculateTripDays(
        newTrip.start_date,
        newTrip.end_date,
      );
      const columns = await createColumnsInDatabase(
        newTrip.id,
        newTrip.start_date,
        numberOfDays,
      );

      localStorage.setItem("currentTripId", newTrip.id.toString());
      localStorage.setItem("tripInfo", JSON.stringify(newTrip));
      localStorage.setItem("tripColumns", JSON.stringify(columns));

      toast.success(`Trip to ${newTrip.destination} created successfully!`);
      navigate(`/during`);
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Trip created but failed to set up columns. Please try again.");
      setIsCreatingTrip(false);
    } finally {
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-amber-100 via-teal-300 to-teal-600">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-amber-100 bg-clip-text text-transparent mb-4">
            ✈️ Trip Planner
          </h1>
          <p className="text-teal-700 text-xl">Organize your perfect journey</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          disabled={isCreatingTrip}
          className="group relative text-2xl font-semibold bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl p-8 shadow-2xl
                     hover:from-teal-600 hover:to-teal-700 hover:scale-110 transition-all duration-300 hover:shadow-amber-200/50
                     hover:shadow-2xl hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative flex items-center gap-3">
            <span>✨</span>
            {isCreatingTrip
              ? "Setting up your trip..."
              : "Start planning your trip"}
            <span>✨</span>
          </span>
        </button>

        {isCreatingTrip && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-teal-700">Creating your trip board...</p>
          </div>
        )}
      </div>

      {/* Trip Modal */}
      <TripModal
        isOpen={showModal}
        onSuccess={handleTripCreated}
        onClose={() => setShowModal(false)}
      />
    </>
  );
};

export default Trip;
