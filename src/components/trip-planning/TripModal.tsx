import { Plus, X } from "lucide-react";
import { useState } from "react";
import { TripData } from "../../types";

type TripModalProps = {
  onSubmit: (tripData: TripData) => void;
  onClose: () => void;
};

type Member = {
  name: string;
  email?: string;
};

const TripModal: React.FC<TripModalProps> = ({ onSubmit, onClose }) => {
  const [tripData, setTripData] = useState<TripData>({
    destination: "",
    trip_members: [{ name: "", email: "" }],
    start_date: "",
    start_time: "09:00",
    end_date: "",
    end_time: "18:00",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    destination?: string;
    start_date?: string;
    end_date?: string;
    trip_members?: { name?: string; email?: string }[];
  }>({});

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

  const handleSubmit = () => {
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

    // Only add to errors if needed
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

    const hasError = Object.keys(errors).length > 0;

    if (hasError) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({}); // clear previous errors

    const tripInfo: TripData = {
      destination: tripData.destination,
      trip_members: tripData.trip_members,
      start_date: tripData.start_date,
      start_time: tripData.start_time,
      end_date: tripData.end_date,
      end_time: tripData.end_time,
    };

    onSubmit(tripInfo);
  };

  return (
    <div className="flex items-center justify-center z-50 p-8 bg-gradient-to-br from-amber-100 via-teal-500 to-teal-600 h-screen">
      <div className="bg-amber-50 rounded-lg shadow-xl text-black p-6 w-full max-w-fit max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Plan Your Trip
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
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
              <p className="text-red-500 text-sm">{fieldErrors.destination}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Members
            </label>
            {tripData.trip_members.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <div>
                  <input
                    type="text"
                    value={member.name}
                    onChange={(e) =>
                      updateMember(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Name"
                  />
                  {fieldErrors.trip_members?.[index]?.name && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.trip_members[index].name}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    value={member.email}
                    onChange={(e) =>
                      updateMember(index, "email", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Email"
                  />
                  {fieldErrors.trip_members?.[index]?.email && (
                    <p className="text-red-500 text-sm">
                      {fieldErrors.trip_members[index].email}
                    </p>
                  )}
                </div>
                {tripData.trip_members.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addMember}
              className="text-teal-500 hover:text-teal-700 text-sm flex items-center gap-1"
            >
              <Plus size={16} />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
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
                <p className="text-red-500 text-sm">{fieldErrors.start_date}</p>
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
                End Date
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
                <p className="text-red-500 text-sm">{fieldErrors.end_date}</p>
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-teal-200 transition-colors hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors hover:cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripModal;
