import { useState } from "react";
import { TripData } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { MapPin, Calendar, Plus, Trash2 } from "lucide-react";

interface TripSelectorProps {
  trips: TripData[];
  selectedTripId: number | null;
  onTripSelect: (tripId: number) => void;
  onCreateTrip: () => void;
  onTripDelete: (tripId: number) => Promise<void> | void;
}

export const TripSelector: React.FC<TripSelectorProps> = ({
  trips,
  selectedTripId,
  onTripSelect,
  onCreateTrip,
  onTripDelete,
}) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = useState(false);

  const selectedTrip = trips.find((trip) => trip.id === selectedTripId);

  const handleDelete = async () => {
    if (!selectedTrip) return;

    const confirmMessage = `Are you sure you want to delete the trip to "${selectedTrip.destination}"? This action cannot be undone.`;

    if (!globalThis.confirm(confirmMessage)) {
      return;
    }

    setDeleting(true);
    try {
      await onTripDelete(selectedTrip.id);
    } catch (error) {
      console.error("Error in delete handler:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Your Trips:
        </h2>
        <button
          onClick={onCreateTrip}
          className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
        >
          <Plus size={18} />
          New Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">You don't have any trips yet.</p>
          <button
            onClick={onCreateTrip}
            className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        <>
          <select
            key={trips.length} // Reset selection when trips change
            value={selectedTripId || ""}
            onChange={(e) => onTripSelect(Number(e.target.value))}
            className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all ${
              selectedTripId ? "text-black" : "text-gray-700"
            }`}
          >
            <option value="">Select a trip...</option>
            {trips.map((trip) => (
              <option key={trip.id} value={trip.id}>
                {trip.destination} -{" "}
                {new Date(trip.start_date).toLocaleDateString()}
              </option>
            ))}
          </select>

          {selectedTrip && (
            <div className="mt-4 p-4 bg-teal-50 rounded-lg border border-teal-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-teal-500" />

                    <h3 className="font-semibold text-gray-800 text-lg">
                      {selectedTrip.destination}
                    </h3>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="ml-auto px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover: cursor-pointer"
                    >
                      <Trash2 size={14} />
                      {deleting ? "Deleting..." : "Delete Trip"}
                    </button>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>
                        {new Date(selectedTrip.start_date).toLocaleDateString()}{" "}
                        -{new Date(selectedTrip.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    {selectedTrip.duration_days && (
                      <div className="text-teal-600 font-medium">
                        {selectedTrip.duration_days} days
                      </div>
                    )}
                    {user && (
                      <div className="flex gap-x-6 text-s text-gray-500 mt-2">
                        <span>Owner: {user.email}</span>
                        <span>
                          Members:{" "}
                          {selectedTrip.trip_members
                            .map((m) => m.name)
                            .join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
