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
    categories
      .find((c) => c.value === attraction.category)
      ?.label.split(" ")[0] || "📍";

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg p-3 mb-2 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
    >
      {/* Drag Handle Area */}
      <div {...attributes} {...listeners}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 text-left">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
              <span className="font-medium text-gray-800 text-sm truncate">
                {attraction.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600 pl-6">
              <span className="truncate">{attraction.location}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span
              className="text-base"
              title={
                categories.find((c) => c.value === attraction.category)?.label
              }
            >
              {categoryIcon}
            </span>

            {attraction.mapUrl && (
              <a
                href={attraction.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-130 transition-transform text-base"
                title="View on Map"
              >
                🗺️
              </a>
            )}

            {attraction.ticket && (
              <a
                href={attraction.ticket}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="hover:scale-130 transition-transform text-base"
                title="Buy Ticket"
              >
                🎫
              </a>
            )}

            <div className="ml-1">
              {attraction.cost > 0 ? (
                <span className="text-sm font-medium text-gray-700">
                  {attraction.cost}€
                </span>
              ) : (
                <span className="text-[10px] uppercase tracking-wider bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">
                  Free
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(attraction.id);
              }}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-gray-500 hover:text-teal-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(attraction.id);
              }}
              className="p-1 hover:bg-red-50 rounded transition-colors group/del"
            >
              <Trash2 className="w-3.5 h-3.5 text-gray-500 group-hover/del:text-red-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AttractionCard;
