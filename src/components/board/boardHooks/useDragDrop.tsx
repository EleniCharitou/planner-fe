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
    overIndex?: number,
  ) => void | Promise<void>;
  onPersistMove: (
    attractionId: string,
    columnId: string,
    position: number,
  ) => Promise<void> | void;
}

export const useDragAndDrop = ({
  attractions,
  columns,
  moveAttraction,
  moveAttractionToColumn,
  onPersistMove,
}: UseDragAndDropProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
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
    const overCol = columns.find((c) => String(c.id) === overId);

    if (!overAttraction && !overCol) return;

    // If hovering over another card
    if (overAttraction) {
      const activeColId = String(activeAttraction.column_id);
      const overColId = String(overAttraction.column_id);

      if (activeColId !== overColId) {
        const colAttrs = attractions.filter(
          (a) => String(a.column_id) === overColId,
        );
        const overIndex = colAttrs.findIndex((a) => String(a.id) === overId);
        moveAttractionToColumn(activeId, overColId, overIndex);
      }
    }
    // If hovering over an empty column area
    else if (overCol) {
      const activeColId = String(activeAttraction.column_id);
      const overColId = String(overCol.id);

      if (activeColId !== overColId) {
        moveAttractionToColumn(activeId, overColId);
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

    const activeAttraction = attractions.find((a) => String(a.id) === activeId);
    if (!activeAttraction) return;

    const currentColumnId = String(activeAttraction.column_id);

    const overAttr = attractions.find((a) => String(a.id) === overId);
    if (
      overAttr &&
      String(activeAttraction.column_id) === String(overAttr.column_id)
    ) {
      moveAttraction(activeId, overId);
    }

    // --- BACKEND PERSISTENCE ---
    // Get all items in this column
    const attractionsInCol = attractions.filter(
      (a) => String(a.column_id) === currentColumnId,
    );
    // Calculate the NEW intended position
    let finalPosition = -1;

    if (
      overAttr &&
      String(activeAttraction.column_id) === String(overAttr.column_id)
    ) {
      // Same column
      finalPosition = attractionsInCol.findIndex(
        (a) => String(a.id) === overId,
      );
    } else {
      // Different column or dropped in empty space: position is index of active card
      finalPosition = attractionsInCol.findIndex(
        (a) => String(a.id) === activeId,
      );
    }

    // Update Backend
    if (finalPosition !== -1) {
      onPersistMove(activeId, currentColumnId, finalPosition);
    }
  };

  return {
    sensors,
    activeId,
    isDragging,
    activeAttraction: attractions.find((a) => String(a.id) === activeId),
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
