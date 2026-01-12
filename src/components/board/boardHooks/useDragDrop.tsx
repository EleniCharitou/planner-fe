import { useState } from "react";
import {
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { AttractionsDetails, ColumnData } from "../../../types";

interface UseDragAndDropProps {
  attractions: AttractionsDetails[];
  columns: ColumnData[];
  moveAttraction: (activeId: string, overId: string) => void;
  moveAttractionToColumn: (
    activeId: string,
    newColumnId: string,
    overIndex?: number
  ) => void;
  onReorderEnd?: (latestAttractions: AttractionsDetails[]) => void;
}

export const useDragAndDrop = ({
  attractions,
  columns,
  moveAttraction,
  moveAttractionToColumn,
  onReorderEnd,
}: UseDragAndDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const id = String(event.active.id);
    setActiveId(id);
    setIsDragging(true);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeAttraction = attractions.find((a) => String(a.id) === activeId);
    if (!activeAttraction) return;

    const overAttraction = attractions.find((a) => String(a.id) === overId);
    const overColumn = columns.find((c) => String(c.id) === overId);

    // Case 1: Dragging over another attraction
    if (overAttraction) {
      const activeColumnId = String(activeAttraction.column_id);
      const overColumnId = String(overAttraction.column_id);

      // Moving to a different column
      if (activeColumnId !== overColumnId) {
        const columnAttractions = attractions.filter(
          (a) => String(a.column_id) === overColumnId
        );
        const overIndex = columnAttractions.findIndex(
          (a) => String(a.id) === overId
        );

        moveAttractionToColumn(activeId, overColumnId, overIndex);
      }
    }
    // Case 2: Dragging over an empty column or column header
    else if (overColumn) {
      const activeColumnId = String(activeAttraction.column_id);
      const overColumnId = String(overColumn.id);

      if (activeColumnId !== overColumnId) {
        moveAttractionToColumn(activeId, overColumnId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveId(null);

    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const activeAttraction = attractions.find((a) => String(a.id) === activeId);
    const overAttraction = attractions.find((a) => String(a.id) === overId);

    if (!activeAttraction) return;

    if (
      overAttraction &&
      String(activeAttraction.column_id) === String(overAttraction.column_id)
    ) {
      moveAttraction(activeId, overId);
    }

    if (onReorderEnd) {
      setTimeout(() => {
        onReorderEnd(attractions);
      }, 0);
    }
  };

  const activeAttraction = attractions.find((a) => String(a.id) === activeId);

  return {
    sensors,
    activeId,
    isDragging,
    activeAttraction,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
