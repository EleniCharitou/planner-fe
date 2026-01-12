import React from "react";
import { AttractionsDetails, ColumnData } from "../../types";
import { Plus } from "lucide-react";
import { useDroppable } from "@dnd-kit/core";
import AttractionCard from "./AttractionCard";

interface KanbanColumnProps {
  column: ColumnData;
  attractions: AttractionsDetails[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddAttraction: (columnId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  attractions,
  onEdit,
  onDelete,
  onAddAttraction,
}) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  return (
    <div className="flex-shrink-0 w-64">
      <div className="bg-teal-800 text-white px-4 py-2 rounded-t-lg flex items-center justify-between">
        <span className="font-medium text-sm">{column.title}</span>
        <span className="bg-teal-700 px-2 py-0.5 rounded text-xs">
          {attractions.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className="bg-teal-100 rounded-b-lg p-3 min-h-[400px] flex flex-col"
      >
        {attractions.map((attraction) => (
          <AttractionCard
            key={attraction.id}
            attraction={attraction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        <button
          onClick={() => onAddAttraction(column.id)}
          className="mt-auto flex items-center gap-2 text-teal-700 hover:text-teal-800 text-sm py-2 px-3 hover:bg-teal-200 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add attraction</span>
        </button>
      </div>
    </div>
  );
};
export default KanbanColumn;
