import { useState } from "react";

interface AttractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (attractionData: any) => void;
  columnTitle: string;
}

const AttractionModal = ({
  isOpen,
  onClose,
  onSubmit,
  columnTitle,
}: AttractionModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    category: "other",
    mapUrl: "",
    ticket: "",
    cost: 0,
    visited: false,
  });

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
      title: "",
      location: "",
      category: "other",
      mapUrl: "",
      ticket: "",
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
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 text-black bg-teal-300/90 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-teal-500 p-6 rounded-t-2xl">
          <h2 className="text-2xl font-bold text-white text-center">
            ✨ Add New Attraction
          </h2>
          <p className="text-teal-100 text-center mt-2">
            Adding to: <span className="font-semibold">{columnTitle}</span>
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                🎯 Attraction Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Eiffel Tower"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                📍 Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              value={formData.mapUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
              value={formData.ticket}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://tickets.example.com/..."
            />
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

          <div className="flex gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:cursor-pointer hover:bg-teal-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl font-semibold shadow-lg
                        hover:from-teal-600 hover:to-teal-800 transition-all duration-300 hover:cursor-pointer"
            >
              ✨ Add Attraction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttractionModal;
