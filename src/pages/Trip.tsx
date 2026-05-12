import { useState } from "react";
import TripModal from "../components/trip-planning/TripModal";
import { TripData } from "../types";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const Trip = () => {
  const [showModal, setShowModal] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const navigate = useNavigate();

  const handleTripCreated = async (newTrip: TripData) => {
    setIsCreatingTrip(true);
    try {
      localStorage.setItem("currentTripId", newTrip.id.toString());
      localStorage.setItem("tripInfo", JSON.stringify(newTrip));

      toast.success(`Trip to ${newTrip.destination} created successfully!`);
      navigate(`/during`);
    } catch (error) {
      console.error("Error creating trip:", error);
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
                     hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
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
