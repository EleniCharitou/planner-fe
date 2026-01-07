import { useState } from "react";
import { AttractionsDetails } from "../types";
import { useBlockBodyScroll } from "../utilities/useLockBodyScroll";
import { MapPin } from "lucide-react";

interface AttractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: AttractionsDetails | null;
  onSubmit: (attractionData: AttractionsDetails) => void;
  columnTitle: string;
}

const AttractionModal = ({
  isOpen,
  onClose,
  attraction,
  onSubmit,
}: AttractionModalProps) => {
  const [formData, setFormData] = useState<AttractionsDetails>(
    attraction ?? {
      id: "",
      column_id: "",
      title: "",
      location: "",
      category: "other",
      mapUrl: "",
      ticket: "",
      date: "",
      cost: 0,
      visited: false,
    }
  );

  useBlockBodyScroll(isOpen);

  const categories = [
    { value: "museum", label: "🏛️ Museum" },
    { value: "landmark", label: "🗽 Landmark" },
    { value: "park", label: "🌳 Park" },
    { value: "palace", label: "🏰 Palace" },
    { value: "restaurant", label: "🍽️ Restaurant" },
    { value: "gallery", label: "🎨 Gallery" },
    { value: "church", label: "⛪ Church" },
    { value: "other", label: "📍 Other" },
  ];

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location) {
      alert("Please fill in the attraction name and location");
      return;
    }
    onSubmit(formData);
    setFormData({
      id: "",
      column_id: "",
      title: "",
      location: "",
      category: "other",
      mapUrl: "",
      ticket: "",
      date: "",
      cost: 0,
      visited: false,
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "category"
          ? (value as AttractionsDetails["category"])
          : type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-teal-300/70 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-teal-500 p-6 rounded-t-2xl flex-shrink-0">
          <h2 className="text-2xl font-bold text-white text-center">
            ✨ Attraction
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 text-black space-y-6 overflow-y-auto flex-1 max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Attraction Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus-visible:border-transparent"
                placeholder="e.g., Eiffel Tower"
              />
            </div>

            <div>
              <label className="inline-flex items-center text-sm font-semibold text-gray-700 mb-2 gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" /> Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location ?? ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Paris, France"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🏷️ Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                💰 Estimated Cost (€)
              </label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                min={0}
                step={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🗺️ Map URL (Optional)
            </label>
            <input
              type="url"
              name="mapUrl"
              value={formData.mapUrl ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1  focus:ring-teal-500 focus:border-transparent"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              🎫 Ticket URL (Optional)
            </label>
            <input
              type="url"
              name="ticket"
              value={formData.ticket ?? ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://tickets.example.com/..."
            />
          </div>
        </div>

        {/* Visited Checkbox-to be shown in next steps program|during the trip*/}
        {/* <div className="flex items-center">
            <input
              type="checkbox"
              name="visited"
              checked={formData.visited}
              onChange={handleChange}
              className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              Visited
            </label>
          </div> */}

        <div className="p-4 border-t flex flex-wrap gap-4 justify-center flex-shrink-0 bg-amber-50">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 min-w-[120px] max-w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-teal-200 hover:cursor-pointer transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 min-w-[120px] max-w-full px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:from-teal-600 hover:to-teal-800 hover:cursor-pointer transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionModal;
