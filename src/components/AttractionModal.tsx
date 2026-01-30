import { useState, useEffect } from "react";
import { AttractionsDetails } from "../types";
import { useBlockBodyScroll } from "../utilities/useLockBodyScroll";
import { MapPin } from "lucide-react";

interface AttractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  attraction: AttractionsDetails | null;
  onSubmit: (attractionData: Partial<AttractionsDetails>) => Promise<void>;
}

const AttractionModal = ({
  isOpen,
  onClose,
  attraction,
  onSubmit,
}: AttractionModalProps) => {
  const [formData, setFormData] = useState<Partial<AttractionsDetails>>({
    id: "",
    column_id: "",
    title: "",
    location: "",
    category: "other",
    mapUrl: "",
    ticket: "",
    cost: 0,
    visited: false,
  });

  useBlockBodyScroll(isOpen);

  useEffect(() => {
    if (attraction) {
      setFormData({
        id: attraction.id,
        column_id: attraction.column_id,
        title: attraction.title,
        location: attraction.location,
        category: attraction.category,
        mapUrl: attraction.mapUrl || "",
        ticket: attraction.ticket || "",
        cost: attraction.cost || 0,
        visited: attraction.visited || false,
      });
    } else {
      setFormData({
        id: "",
        column_id: "",
        title: "",
        location: "",
        category: "other",
        mapUrl: "",
        ticket: "",
        cost: 0,
        visited: false,
      });
    }
  }, [attraction]);

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

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location) {
      alert("Please fill in the attraction name and location");
      return;
    }

    const submitData: Partial<AttractionsDetails> = {
      title: formData.title.trim(),
      location: formData.location.trim(),
      category: formData.category || "other",
      mapUrl: formData.mapUrl?.trim() || "",
      ticket: formData.ticket?.trim() || "",
      cost: formData.cost ? Number(Number(formData.cost).toFixed(2)) : 0,
      visited: Boolean(formData.visited),
    };

    if (attraction) {
      submitData.id = formData.id;
      submitData.column_id = formData.column_id;
    }

    try {
      await onSubmit(submitData);

      setFormData({
        id: "",
        column_id: "",
        title: "",
        location: "",
        category: "other",
        mapUrl: "",
        ticket: "",
        cost: 0,
        visited: false,
      });
      onClose();
    } catch (error) {
      console.error("Error submitting attraction:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    let finalValue: string | number | boolean = value;

    if (name === "category") {
      finalValue = value as AttractionsDetails["category"];
    } else if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      finalValue = Number.parseFloat(value) || 0;
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-teal-300/70 flex items-center justify-center z-50 p-4">
      <div className="bg-amber-50 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-teal-500 p-6 rounded-t-2xl flex-shrink-0">
          <h2 className="text-2xl font-bold text-white text-center">
            {attraction ? "✏️ Edit Attraction" : "✨ New Attraction"}
          </h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 text-black space-y-6 overflow-y-auto flex-1 max-h-[calc(90vh-120px)]">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="attraction-name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🎯 Attraction Name *
              </label>
              <input
                id="attraction-name"
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus-visible:border-transparent"
                placeholder="e.g., Eiffel Tower"
                required
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="inline-flex items-center text-sm font-semibold text-gray-700 mb-2 gap-1.5"
              >
                <MapPin className="w-4 h-4 text-orange-500" /> Location *
              </label>
              <input
                id="location"
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                placeholder="e.g., Paris, France"
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                🏷️ Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || "other"}
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
              <label
                htmlFor="cost"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                💰 Estimated Cost (€)
              </label>
              <input
                id="cost"
                type="number"
                name="cost"
                value={
                  typeof formData.cost === "string"
                    ? Number.parseFloat(formData.cost) || 0
                    : formData.cost || 0
                }
                onChange={handleChange}
                min={0}
                step={0.01}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="mapUrl"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              🗺️ Map URL (Optional)
            </label>
            <input
              id="mapUrl"
              type="url"
              name="mapUrl"
              value={formData.mapUrl || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div>
            <label
              htmlFor="ticket"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              🎫 Ticket URL (Optional)
            </label>
            <input
              id="ticket"
              type="url"
              name="ticket"
              value={formData.ticket || ""}
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
            {attraction ? "Update Attraction" : "Create Attraction"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionModal;
