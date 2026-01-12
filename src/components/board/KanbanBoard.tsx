import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { AttractionsDetails, ColumnData } from "../../types";
import KanbanColumn from "./KanbanColumn";
import { MapPin } from "lucide-react";

interface KanbanBoardProps {
  columns: ColumnData[];
  attractions: AttractionsDetails[];
  getAttractionsByColumn: (columnId: string) => AttractionsDetails[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddAttraction: (columnId: string) => void;
  dragHandlers: {
    sensors: any;
    handleDragStart: (event: DragStartEvent) => void;
    handleDragOver: (event: DragOverEvent) => void;
    handleDragEnd: (event: DragEndEvent) => void;
    activeAttraction: AttractionsDetails | undefined;
    isDragging: boolean;
  };
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  columns,
  getAttractionsByColumn,
  onEdit,
  onDelete,
  onAddAttraction,
  dragHandlers,
}) => {
  const {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    activeAttraction,
    isDragging,
  } = dragHandlers;

  return (
    <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-6 shadow-lg">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              attractions={getAttractionsByColumn(column.id)}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddAttraction={onAddAttraction}
            />
          ))}
        </div>

        <DragOverlay>
          {activeAttraction && isDragging ? (
            <div className="bg-white rounded-lg p-3 shadow-2xl border-2 border-teal-500 w-64 rotate-3 opacity-90">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-gray-800 text-sm">
                      {activeAttraction.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 text-red-500" />
                    <span>{activeAttraction.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-orange-500 font-medium">
                  {activeAttraction.category}
                </span>
                <span className="font-semibold text-gray-800">
                  {activeAttraction.cost}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
