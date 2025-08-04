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
    members: [{ name: "" }],
    startDate: "",
    startTime: "09:00",
    endDate: "",
    endTime: "18:00",
  });

  const addMember = () => {
    setTripData({
      ...tripData,
      members: [...tripData.members, { name: "" }],
    });
  };

  const removeMember = (index: number) => {
    setTripData({
      ...tripData,
      members: tripData.members.filter((_, i) => i !== index),
    });
  };

  const updateMember = (index: number, field: keyof Member, value: string) => {
    const newMembers = [...tripData.members];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value,
    };
    setTripData({ ...tripData, members: newMembers });
  };

  const handleSubmit = () => {
    const tripInfo: TripData = {
      destination: tripData.destination,
      members: tripData.members,
      startDate: tripData.startDate,
      startTime: tripData.startTime,
      endDate: tripData.endDate,
      endTime: tripData.endTime,
    };

    onSubmit(tripInfo);
  };

  return (
    <div className="flex items-center justify-center z-50 p-8">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trip Members
            </label>
            {tripData.members.map((member, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  required
                  value={member.name}
                  onChange={(e) => updateMember(index, "name", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Name"
                />
                {tripData.members.length > 1 && (
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
                value={tripData.startDate}
                onChange={(e) =>
                  setTripData({ ...tripData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={tripData.startTime}
                onChange={(e) =>
                  setTripData({ ...tripData, startTime: e.target.value })
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
                value={tripData.endDate}
                onChange={(e) =>
                  setTripData({ ...tripData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={tripData.endTime}
                onChange={(e) =>
                  setTripData({ ...tripData, endTime: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
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
