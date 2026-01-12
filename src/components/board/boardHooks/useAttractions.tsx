import { useState } from "react";
import { AttractionsDetails, Id } from "../../../types";
import api from "../../../api";

export type AttractionAction =
  | "create"
  | "update"
  | "delete"
  | "reorder"
  | "move";

export const useAttractions = (initialAttractions: AttractionsDetails[]) => {
  const [attractions, setAttractions] =
    useState<AttractionsDetails[]>(initialAttractions);
  const [showAttractionModal, setShowAttractionModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<Id | null>(null);

  const saveAttraction = async (
    action: AttractionAction,
    data: any
  ): Promise<void> => {
    switch (action) {
      case "reorder":
        await api.patch("/attraction/reorder/", data);
        break;

      case "move":
        if (data.id) {
          await api.patch(`/attraction/${data.id}/move/`, {
            column_id: data.column_id,
            position: data.position,
          });
        }
        break;

      case "update":
        if (data.id) await api.patch(`/attraction/${data.id}/`, data);
        break;

      case "delete":
        if (data.id) await api.delete(`/attraction/${data.id}/`);
        break;

      case "create":
        await api.post("/attraction/", data);
        break;

      default:
        console.error("Unknown action type:", action);
    }
  };

  const addAttraction = (columnId: string) => {
    setShowAttractionModal(true);
    setSelectedColumnId(columnId);
  };

  const updateAttraction = async (updatedAttraction: AttractionsDetails) => {
    try {
      await saveAttraction("update", updatedAttraction);
      setAttractions((prev) =>
        prev.map((attr) =>
          String(attr.id) === String(updatedAttraction.id)
            ? updatedAttraction
            : attr
        )
      );
    } catch (err) {
      console.error("Update failed", err);
      throw err;
    }
  };

  const deleteAttraction = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this attraction?"))
      return;
    try {
      await saveAttraction("delete", { id });
      setAttractions((prev) =>
        prev.filter((attr) => String(attr.id) !== String(id))
      );
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  const moveAttractionToColumn = async (
    attractionId: string,
    newColumnId: string,
    overIndex?: number
  ) => {
    const attraction = attractions.find(
      (a) => String(a.id) === String(attractionId)
    );
    if (!attraction) return;

    setAttractions((prev) => {
      const updatedAttraction = { ...attraction, column_id: newColumnId };

      // Remove from current position
      const withoutMoved = prev.filter(
        (a) => String(a.id) !== String(attractionId)
      );

      // Get attractions in target column
      const columnAttractions = withoutMoved.filter(
        (a) => String(a.column_id) === String(newColumnId)
      );

      // Insert at position or end
      const insertIndex =
        overIndex !== undefined && overIndex >= 0
          ? Math.min(overIndex, columnAttractions.length)
          : columnAttractions.length;

      columnAttractions.splice(insertIndex, 0, updatedAttraction);

      // Combine with other columns
      const otherAttractions = withoutMoved.filter(
        (a) => String(a.column_id) !== String(newColumnId)
      );

      return [...otherAttractions, ...columnAttractions];
    });

    try {
      const updatedData = { ...attraction, column_id: newColumnId };
      await saveAttraction("update", updatedData);
    } catch (err) {
      console.error("Move to column failed", err);
    }
  };

  const moveAttraction = (activeId: string, overId: string) => {
    setAttractions((prev) => {
      const activeItem = prev.find((a) => String(a.id) === String(activeId));
      const overItem = prev.find((a) => String(a.id) === String(overId));

      if (!activeItem || !overItem) return prev;

      const activeColumnId = String(activeItem.column_id);
      const overColumnId = String(overItem.column_id);

      // Only reorder within same column
      if (activeColumnId !== overColumnId) return prev;

      const columnAttractions = prev.filter(
        (a) => String(a.column_id) === activeColumnId
      );

      const activeIndex = columnAttractions.findIndex(
        (a) => String(a.id) === String(activeId)
      );
      const overIndex = columnAttractions.findIndex(
        (a) => String(a.id) === String(overId)
      );

      if (activeIndex === -1 || overIndex === -1) return prev;

      // Perform reorder
      const reorderedColumn = [...columnAttractions];
      const [movedItem] = reorderedColumn.splice(activeIndex, 1);
      reorderedColumn.splice(overIndex, 0, movedItem);

      const normalizedColumn = reorderedColumn.map((item, index) => ({
        ...item,
        position: index,
      }));

      const otherAttractions = prev.filter(
        (a) => String(a.column_id) !== activeColumnId
      );

      return [...otherAttractions, ...normalizedColumn];
    });
  };

  const getAttractionsByColumn = (columnId: string) => {
    return attractions.filter((a) => String(a.column_id) === String(columnId));
  };

  return {
    attractions,
    setAttractions,
    showAttractionModal,
    setShowAttractionModal,
    selectedColumnId,
    saveAttraction,
    addAttraction,
    updateAttraction,
    deleteAttraction,
    moveAttraction,
    moveAttractionToColumn,
    getAttractionsByColumn,
  };
};
