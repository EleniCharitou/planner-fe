import { MapPin, Edit2, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AttractionsDetails } from "../../types";

interface AttractionCardProps {
  attraction: AttractionsDetails;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attraction.id });

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

  const categoryIcon =
    categories.find((c) => c.value === attraction.category)?.label || "📍";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-orange-500" />
            <span className="font-medium text-gray-800 text-sm">
              {attraction.title}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 pl-6">
            <span>{attraction.location}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span
            className="cursor-pointer"
            title={
              categories.find((c) => c.value === attraction.category)?.label ||
              ""
            }
          >
            {categoryIcon.split(" ")[0]}
          </span>
          {attraction.mapUrl && (
            <a
              href={attraction.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="View on Map"
              className="hover:scale-130"
            >
              🗺️
            </a>
          )}
          {attraction.ticket && (
            <a
              href={attraction.ticket}
              target="_blank"
              rel="noopener noreferrer"
              title="Buy Ticket"
              className="hover:scale-130"
            >
              🎫
            </a>
          )}
          {attraction.cost > 0 && (
            <span className="font-small text-gray-800 text-sm">
              {attraction.cost}€
            </span>
          )}
          {attraction.cost === 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
              Free
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(attraction.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(attraction.id);
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Trash2 className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default AttractionCard;
