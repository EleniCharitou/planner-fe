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
    data: any,
  ): Promise<void> => {
    switch (action) {
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
            : attr,
        ),
      );
    } catch (err) {
      console.error("Update failed", err);
      throw err;
    }
  };

  const deleteAttraction = async (id: string) => {
    if (!globalThis.confirm("Are you sure you want to delete this attraction?"))
      return;
    try {
      await saveAttraction("delete", { id });
      setAttractions((prev) =>
        prev.filter((attr) => String(attr.id) !== String(id)),
      );
    } catch (err) {
      console.error("Delete failed", err);
      throw err;
    }
  };

  const moveAttractionToColumn = (
    attractionId: string,
    newColumnId: string,
    overIndex?: number,
  ) => {
    setAttractions((prev) => {
      const activeIndex = prev.findIndex(
        (a) => String(a.id) === String(attractionId),
      );
      if (activeIndex === -1) return prev;

      const currentAttr = prev[activeIndex];
      const isSameColumn =
        String(currentAttr.column_id) === String(newColumnId);

      // If it's already in that column and we don't have a specific overIndex, do nothing
      if (isSameColumn && overIndex === undefined) {
        return prev;
      }

      const newItems = [...prev];
      const [movedItem] = newItems.splice(activeIndex, 1);
      const updatedItem = { ...movedItem, column_id: newColumnId };

      const targetColItems = newItems.filter(
        (a) => String(a.column_id) === String(newColumnId),
      );

      let finalInsertIndex: number;

      if (overIndex !== undefined) {
        finalInsertIndex = newItems.indexOf(targetColItems[overIndex]);
      } else {
        const lastItem = targetColItems.at(-1);
        finalInsertIndex = lastItem
          ? newItems.indexOf(lastItem) + 1
          : newItems.length;
      }

      // Safety check. If indexOf returned -1, default to end of array
      const verifiedIndex =
        finalInsertIndex === -1 ? newItems.length : finalInsertIndex;

      newItems.splice(verifiedIndex, 0, updatedItem);
      return newItems;
    });
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
        (a) => String(a.column_id) === activeColumnId,
      );

      const activeIndex = columnAttractions.findIndex(
        (a) => String(a.id) === String(activeId),
      );
      const overIndex = columnAttractions.findIndex(
        (a) => String(a.id) === String(overId),
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
        (a) => String(a.column_id) !== activeColumnId,
      );

      return [...otherAttractions, ...normalizedColumn];
    });
  };

  const persistAttractionMove = async (
    attractionId: string,
    columnId: string,
    position: number,
  ) => {
    try {
      await saveAttraction("move", {
        id: attractionId,
        column_id: columnId,
        position: position,
      });
    } catch (err) {
      console.error("Failed to sync move to server:", err);
    }
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
    persistAttractionMove,
    getAttractionsByColumn,
  };
};
