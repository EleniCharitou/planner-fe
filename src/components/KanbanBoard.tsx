import { useMemo, useState, useEffect } from "react";
import PlusIcon from "../icon/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import AttractionModal from "./AttractionModal";
import backendUrl from "../config";

interface PendingChange {
  type: "move" | "create" | "update" | "delete";
  taskId: Id;
  data: any;
}

interface KanbanBoardProps {
  tripId: number;
}

const KanbanBoard = ({ tripId }: KanbanBoardProps) => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [showAttractionModal, setShowAttractionModal] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<Id | null>(null);
  const [selectedColumnTitle, setSelectedColumnTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  useEffect(() => {
    const loadBoardData = async () => {
      if (!tripId) {
        setIsLoading(false);
        return;
      }

      try {
        const columnsResponse = await fetch(
          `${backendUrl}/column/?trip_id=${tripId}`
        );
        if (columnsResponse.ok) {
          const columnsData = await columnsResponse.json();
          setColumns(columnsData);

          const attractionsResponse = await fetch(
            `${backendUrl}/grouped_attractions/?trip_id=${tripId}`
          );
          if (attractionsResponse.ok) {
            const attractionsData = await attractionsResponse.json();

            const allTasks: Task[] = [];
            attractionsData.forEach((columnData: any) => {
              columnData.cards.forEach((attraction: any) => {
                allTasks.push({
                  id: attraction.id,
                  columnId: attraction.column_id,
                  content: `${attraction.title} - ${attraction.location} (${attraction.category}) - ${attraction.cost}€`,
                  attractionData: attraction,
                });
              });
            });
            setTasks(allTasks);
          }
        }
      } catch (error) {
        console.error("Error loading board data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBoardData();
  }, [tripId]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // Save all pending changes to database
  const saveChanges = async () => {
    if (pendingChanges.length === 0) return;

    setIsSaving(true);

    try {
      // Process all pending changes
      for (const change of pendingChanges) {
        switch (change.type) {
          case "move":
            await fetch(`${backendUrl}/attraction/${change.taskId}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                column_id: change.data.newColumnId,
              }),
            });
            break;

          case "create":
            // Already handled in real-time, but could batch here
            break;

          case "update":
            await fetch(`${backendUrl}/attraction/${change.taskId}/`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(change.data),
            });
            break;

          case "delete":
            await fetch(`${backendUrl}/attraction/${change.taskId}/`, {
              method: "DELETE",
            });
            break;
        }
      }

      // Clear pending changes
      setPendingChanges([]);
      setHasUnsavedChanges(false);

      // Show success message
      alert("✅ All changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Error saving changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const createNewColumn = async () => {
    if (!tripId) return;

    try {
      const response = await fetch(`${backendUrl}/column/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trip_id: tripId,
          title: `New Day`,
          position: columns.length,
        }),
      });

      if (response.ok) {
        const newColumn = await response.json();
        setColumns([...columns, newColumn]);
      }
    } catch (error) {
      console.error("Error creating column:", error);
    }
  };

  const deleteColumn = async (id: Id) => {
    // Prevent deletion of backlog and day of the trip
    const column = columns.find((col) => col.id === id);
    if (
      column &&
      (column.title.includes("Day ") || column.title.includes("Attractions"))
    ) {
      alert("Cannot delete trip day or backlog columns");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/column/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        const filteredColumns = columns.filter((col) => col.id !== id);
        setColumns(filteredColumns);

        const newTasks = tasks.filter((t) => t.columnId !== id);
        setTasks(newTasks);
      }
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const updateColumn = async (id: Id, title: string) => {
    // Prevent editing of backlog and day of the trip
    const column = columns.find((col) => col.id === id);
    if (
      column &&
      (column.title.includes("Day ") || column.title.includes("Attractions"))
    ) {
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/column/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const newColumns = columns.map((col) => {
          if (col.id !== id) return col;
          return { ...col, title };
        });
        setColumns(newColumns);
      }
    } catch (error) {
      console.error("Error updating column:", error);
    }
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;
    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    const task = tasks.find((t) => t.id === activeTaskId);
    let newColumnId = null;

    //drop task over another task
    if (isActiveATask && isOverATask) {
      const overTask = tasks.find((t) => t.id === overTaskId);
      newColumnId = overTask?.columnId;

      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
        const overIndex = tasks.findIndex((t) => t.id === overTaskId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    //drop task over a column
    if (isActiveATask && isOverAColumn) {
      newColumnId = overTaskId;
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);

        tasks[activeIndex].columnId = overTaskId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }

    // Track pending move change
    if (task && newColumnId) {
      setPendingChanges((prev) => [
        ...prev.filter(
          (change) => change.taskId !== activeTaskId || change.type !== "move"
        ),
        {
          type: "move",
          taskId: activeTaskId,
          data: { newColumnId },
        },
      ]);
      setHasUnsavedChanges(true);
    }
  };

  const createTask = (columnId: Id) => {
    const column = columns.find((col) => col.id === columnId);
    setSelectedColumnId(columnId);
    setSelectedColumnTitle(column?.title || "");
    setShowAttractionModal(true);
  };

  const handleAttractionSubmit = async (attractionData: any) => {
    if (!selectedColumnId) return;

    const tripInfo = JSON.parse(localStorage.getItem("tripInfo") || "{}");

    try {
      const response = await fetch(`${backendUrl}/attraction/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          column_id: selectedColumnId,
          date: tripInfo.start_date || new Date().toISOString(),
          ...attractionData,
        }),
      });

      if (response.ok) {
        const newAttraction = await response.json();
        const newTask: Task = {
          id: newAttraction.id,
          columnId: selectedColumnId,
          content: `${attractionData.title} - ${attractionData.location} (${attractionData.category}) - ${attractionData.cost}€`,
          attractionData: newAttraction,
        };
        setTasks([...tasks, newTask]);
      }
    } catch (error) {
      console.error("Error creating attraction:", error);
    }
  };

  const deleteTask = async (id: Id) => {
    const task = tasks.find((t) => t.id === id);
    if (task && task.attractionData) {
      setPendingChanges((prev) => [
        ...prev.filter((change) => change.taskId !== id),
        {
          type: "delete",
          taskId: id,
          data: {},
        },
      ]);
      setHasUnsavedChanges(true);

      const newTasks = tasks.filter((task) => task.id !== id);
      setTasks(newTasks);
    }
  };

  const updateTask = (id: Id, content: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task && task.attractionData) {
      const title = content.split(" - ")[0] || content;

      setPendingChanges((prev) => [
        ...prev.filter(
          (change) => change.taskId !== id || change.type !== "update"
        ),
        {
          type: "update",
          taskId: id,
          data: { title },
        },
      ]);
      setHasUnsavedChanges(true);

      const newTasks = tasks.map((task) => {
        if (task.id !== id) return task;
        return { ...task, content };
      });
      setTasks(newTasks);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-teal-700 font-medium">
            Loading your trip board...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {hasUnsavedChanges && (
        <div className="sticky top-0 z-10 bg-gray-300 text-black p-4 mb-4 rounded-b-lg shadow-lg">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="font-semibold">You have unsaved changes</p>
                <p className="text-sm opacity-90">
                  {pendingChanges.length} pending change
                  {pendingChanges.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setPendingChanges([]);
                  setHasUnsavedChanges(false);
                  window.location.reload(); // Reload to revert changes
                }}
                className="px-4 py-2 bg-white hover:bg-teal-100 rounded-lg transition-colors font-medium hover:cursor-pointer"
              >
                🔄 Discard
              </button>
              <button
                onClick={saveChanges}
                disabled={isSaving}
                className="px-6 py-2 bg-white  hover:bg-teal-100 rounded-lg transition-colors font-semibold disabled:opacity-50 flex items-center gap-2 hover:cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                    Saving...
                  </>
                ) : (
                  <>💾 Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="m-auto flex min-h-[600px] w-full items-start overflow-scroll overflow-y-hidden px-8 py-6">
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-6">
            <div className="flex gap-6">
              <SortableContext items={columnsId}>
                {columns.map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                  />
                ))}
              </SortableContext>
            </div>
            <button
              className="h-[60px] min-w-fit cursor-pointer hover:shadow-teal-500/25 flex items-center justify-center
                        px-2 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl 
                        hover:from-teal-600 hover:to-teal-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg 
                        font-semibold border border-teal-400 hover:border-teal-500 hover:cursor-pointer"
              onClick={() => {
                createNewColumn();
              }}
            >
              <PlusIcon />
              <span>Add Column</span>
              <span>✨</span>
            </button>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      <AttractionModal
        isOpen={showAttractionModal}
        onClose={() => setShowAttractionModal(false)}
        onSubmit={handleAttractionSubmit}
        columnTitle={selectedColumnTitle}
      />
    </div>
  );
};

export default KanbanBoard;
