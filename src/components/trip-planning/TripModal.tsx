import { Plus, X } from "lucide-react";
import { useState } from "react";
import { TripData } from "../../types";
import { createTrip } from "../../services/tripApi";
import { useBlockBodyScroll } from "../../utilities/useLockBodyScroll";

type TripModalProps = {
  isOpen: boolean;
  onSuccess: (trip: TripData) => void;
  onClose: () => void;
};

type Member = {
  name: string;
  email?: string;
};

const initTripData: TripData = {
  id: 0,
  destination: "",
  trip_members: [{ name: "", email: "" }],
  start_date: "",
  start_time: "09:00",
  end_date: "",
  end_time: "18:00",
};

const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
}) => {
  const [tripData, setTripData] = useState<TripData>(initTripData);
  const [fieldErrors, setFieldErrors] = useState<{
    destination?: string;
    start_date?: string;
    end_date?: string;
    trip_members?: { name?: string; email?: string }[];
  }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  useBlockBodyScroll(isOpen);

  const addMember = () => {
    setTripData({
      ...tripData,
      trip_members: [...tripData.trip_members, { name: "", email: "" }],
    });
  };

  const removeMember = (index: number) => {
    setTripData({
      ...tripData,
      trip_members: tripData.trip_members.filter((_, i) => i !== index),
    });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...tripData.trip_members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value,
    };
    setTripData({ ...tripData, trip_members: newMembers });
  };

  const isEmailValid = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    const errors: typeof fieldErrors = {};
    const memberErrors: { name?: string; email?: string }[] = [];

    let hasMemberError = false;

    tripData.trip_members.forEach((member) => {
      const memberError: { name?: string; email?: string } = {};

      if (!member.name.trim()) {
        memberError.name = "Name is required";
        hasMemberError = true;
      }

      if (member.email && !isEmailValid(member.email)) {
        memberError.email = "Invalid email format";
        hasMemberError = true;
      }

      memberErrors.push(memberError);
    });

    // Validate fields
    if (!tripData.destination.trim()) {
      errors.destination = "Destination is required";
    }
    if (!tripData.start_date) {
      errors.start_date = "Start date is required";
    }
    if (!tripData.end_date) {
      errors.end_date = "End date is required";
    }
    if (hasMemberError) {
      errors.trip_members = memberErrors;
    }

    // Check date logic
    if (tripData.start_date && tripData.end_date) {
      if (new Date(tripData.start_date) >= new Date(tripData.end_date)) {
        errors.end_date = "End date must be after start date";
      }
    }

    const hasError = Object.keys(errors).length > 0;

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setApiError("");
    setLoading(true);

    try {
      const formattedData: Omit<TripData, "id"> = {
        destination: tripData.destination,
        start_date: `${tripData.start_date}T${tripData.start_time}:00Z`,
        start_time: tripData.start_time,
        end_date: `${tripData.end_date}T${tripData.end_time}:00Z`,
        end_time: tripData.end_time,
        trip_members: tripData.trip_members,
      };

      const newTrip = await createTrip(formattedData);
      onSuccess(newTrip);

      setTripData(initTripData);

      onClose();
    } catch (error: any) {
      console.error("Error creating trip:", error);
      setApiError(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create trip. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-gradient-to-br from-amber-100 via-teal-500">
      <div className="bg-amber-50 rounded-lg shadow-xl text-black p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Plan Your Trip
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {apiError}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination *
            </label>
            <input
              type="text"
              required
              value={tripData.destination}
              onChange={(e) =>
                setTripData({ ...tripData, destination: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Where are you going?"
            />
            {fieldErrors.destination && (
              <p className="text-red-500 text-sm mt-1">
                {fieldErrors.destination}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Members *
            </label>
            {tripData.trip_members.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Name"
                  />
                  {fieldErrors.trip_members?.[index]?.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.trip_members[index].name}
                    </p>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      updateMember(index, "email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Email"
                  />
                  {fieldErrors.trip_members?.[index]?.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {fieldErrors.trip_members[index].email}
                    </p>
                  )}
                </div>
                {tripData.trip_members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="text-teal-500 hover:text-teal-700 text-sm flex items-center gap-1 transition-colors"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={tripData.start_date}
                onChange={(e) =>
                  setTripData({ ...tripData, start_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {fieldErrors.start_date && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.start_date}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={tripData.start_time}
                onChange={(e) =>
                  setTripData({ ...tripData, start_time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={tripData.end_date}
                onChange={(e) =>
                  setTripData({ ...tripData, end_date: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {fieldErrors.end_date && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldErrors.end_date}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={tripData.end_time}
                onChange={(e) =>
                  setTripData({ ...tripData, end_time: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
            <p className="text-sm text-teal-800">
              💡 You will be automatically set as the owner of this trip.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-teal-200 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Trip"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
