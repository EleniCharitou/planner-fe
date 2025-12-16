import { useState, useEffect } from "react";
import PlusIcon from "../icon/PlusIcon";
import { AttractionsDetails, Column, Id, Task } from "../types";
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
import { arrayMove } from "@dnd-kit/sortable";
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
              columnData.cards.forEach((attraction: any, index: number) => {
                allTasks.push({
                  id: attraction.id,
                  columnId: attraction.column_id,
                  content: `${attraction.title} - ${attraction.location} (${attraction.category}) - ${attraction.cost}€`,
                  position:
                    attraction.position !== undefined
                      ? attraction.position
                      : index,
                  attractionData: attraction,
                });
              });
            });
            // Sort tasks by column and position to maintain order
            allTasks.sort((a, b) => {
              if (a.columnId !== b.columnId) {
                return String(a.columnId).localeCompare(String(b.columnId));
              }
              return (a.position || 0) - (b.position || 0);
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

  // Save all pending changes to database
  const saveChanges = async () => {
    if (pendingChanges.length === 0) return;

    setIsSaving(true);

    try {
      const errors: string[] = [];

      // Process all pending changes
      for (const change of pendingChanges) {
        try {
          switch (change.type) {
            case "move":
              const moveResponse = await fetch(
                `${backendUrl}/attraction/${change.taskId}/`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    column_id: change.data.newColumnId,
                    position: change.data.newPosition,
                  }),
                }
              );
              if (!moveResponse.ok) {
                const errorData = await moveResponse.json().catch(() => ({}));
                errors.push(
                  `Failed to move task: ${
                    errorData.detail || moveResponse.statusText
                  }`
                );
              }
              break;

            case "create":
              // Already handled in real-time, but could batch here
              break;

            case "update":
              const updateResponse = await fetch(
                `${backendUrl}/attraction/${change.taskId}/`,
                {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(change.data),
                }
              );
              if (!updateResponse.ok) {
                const errorData = await updateResponse.json().catch(() => ({}));
                errors.push(
                  `Failed to update task: ${
                    errorData.detail || updateResponse.statusText
                  }`
                );
              }
              break;

            case "delete":
              const deleteResponse = await fetch(
                `${backendUrl}/attraction/${change.taskId}/`,
                {
                  method: "DELETE",
                }
              );
              if (!deleteResponse.ok) {
                const errorData = await deleteResponse.json().catch(() => ({}));
                errors.push(
                  `Failed to delete task: ${
                    errorData.detail || deleteResponse.statusText
                  }`
                );
              }
              break;
          }
        } catch (error) {
          errors.push(
            `Error processing ${change.type} for task ${change.taskId}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      }

      // If there were errors, show them but don't clear pending changes
      if (errors.length > 0) {
        console.error("Errors saving changes:", errors);
        alert(
          `❌ Some changes failed to save:\n${errors.join(
            "\n"
          )}\n\nPlease try again.`
        );
        return;
      }

      // Clear pending changes only if all succeeded
      setPendingChanges([]);
      setHasUnsavedChanges(false);

      // Show success message
      alert("✅ All changes saved successfully!");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert(
        `❌ Error saving changes: ${
          error instanceof Error ? error.message : "Unknown error"
        }\n\nPlease try again.`
      );
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
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    // Handle task moves
    if (active.data.current?.type !== "Task") return;

    const activeTaskId = active.id;
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";

    let newColumnId: Id | null = null;

    if (isOverATask) {
      const overTask = tasks.find((t) => t.id === over.id);
      newColumnId = overTask?.columnId || null;
    } else if (isOverAColumn) {
      newColumnId = over.id;
    }

    if (newColumnId !== null) {
      const activeTask = tasks.find((t) => t.id === activeTaskId);
      if (!activeTask) return;

      // Update task positions in state
      setTasks((currentTasks) => {
        const activeIndex = currentTasks.findIndex(
          (t) => t.id === activeTaskId
        );
        let updatedTasks = [...currentTasks];

        if (isOverATask) {
          // Dropping on another task
          const overIndex = currentTasks.findIndex((t) => t.id === over.id);

          // Move the task to the new position
          updatedTasks = arrayMove(updatedTasks, activeIndex, overIndex);

          // Update the column ID
          const movedTaskIndex = updatedTasks.findIndex(
            (t) => t.id === activeTaskId
          );
          updatedTasks[movedTaskIndex] = {
            ...updatedTasks[movedTaskIndex],
            columnId: newColumnId!,
          };
        } else if (isOverAColumn) {
          // Dropping on a column - move to end of that column
          updatedTasks[activeIndex] = {
            ...updatedTasks[activeIndex],
            columnId: newColumnId!,
          };
        }

        // Recalculate positions for all tasks in the target column
        const tasksInTargetColumn = updatedTasks
          .filter((t) => t.columnId === newColumnId)
          .map((t, idx) => ({ ...t, position: idx }));

        // Update all tasks in the target column with new positions
        tasksInTargetColumn.forEach((taskWithPosition) => {
          const taskIndex = updatedTasks.findIndex(
            (t) => t.id === taskWithPosition.id
          );
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = taskWithPosition;
          }
        });

        // If moving between columns, also recalculate positions in the source column
        if (activeTask.columnId !== newColumnId) {
          const tasksInSourceColumn = updatedTasks
            .filter((t) => t.columnId === activeTask.columnId)
            .map((t, idx) => ({ ...t, position: idx }));

          tasksInSourceColumn.forEach((taskWithPosition) => {
            const taskIndex = updatedTasks.findIndex(
              (t) => t.id === taskWithPosition.id
            );
            if (taskIndex !== -1) {
              updatedTasks[taskIndex] = taskWithPosition;
            }
          });
        }

        // Calculate the final position for the moved task
        const finalPosition = tasksInTargetColumn.findIndex(
          (t) => t.id === activeTaskId
        );
        const actualPosition =
          finalPosition === -1 ? tasksInTargetColumn.length : finalPosition;

        // Track pending move change with position
        setPendingChanges((prev) => [
          ...prev.filter(
            (change) => change.taskId !== activeTaskId || change.type !== "move"
          ),
          {
            type: "move",
            taskId: activeTaskId,
            data: {
              newColumnId,
              newPosition: actualPosition,
            },
          },
        ]);
        setHasUnsavedChanges(true);

        return updatedTasks;
      });
    }
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

    if (isActiveATask && isOverATask) {
      const overTask = tasks.find((t) => t.id === overTaskId);
      const newColumnId = overTask?.columnId;

      if (newColumnId) {
        setTasks((tasks) => {
          const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);
          const overIndex = tasks.findIndex((t) => t.id === overTaskId);

          if (tasks[activeIndex].columnId !== newColumnId) {
            tasks[activeIndex].columnId = newColumnId;
          }

          return arrayMove(tasks, activeIndex, overIndex);
        });
      }
    }

    const isOverAColumn = over.data.current?.type === "Column";

    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeTaskId);

        if (tasks[activeIndex].columnId !== overTaskId) {
          tasks[activeIndex].columnId = overTaskId;
        }

        return arrayMove(tasks, activeIndex, activeIndex);
      });
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
        // Calculate position for the new task (add at the end of the column)
        const tasksInColumn = tasks.filter(
          (t) => t.columnId === selectedColumnId
        );
        const newTask: Task = {
          id: newAttraction.id,
          columnId: selectedColumnId,
          content: `${attractionData.title} - ${attractionData.location} (${attractionData.category}) - ${attractionData.cost}€`,
          position: tasksInColumn.length,
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

  const updateTask = (id: Id, updatedTask: Task) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !updatedTask.attractionData) return;

    const updateData: Partial<AttractionsDetails> = {
      title: updatedTask.attractionData.title,
      location: updatedTask.attractionData.location,
      category: updatedTask.attractionData.category,
      cost: updatedTask.attractionData.cost,
      mapUrl: updatedTask.attractionData.mapUrl || null,
      ticket: updatedTask.attractionData.ticket || undefined,
    };

    // Update the content field to match the format
    const updatedContent = `${updatedTask.attractionData.title} - ${updatedTask.attractionData.location} (${updatedTask.attractionData.category}) - ${updatedTask.attractionData.cost}€`;

    // Update pendingChanges list
    setPendingChanges((prev) => [
      ...prev.filter(
        (change) => change.taskId !== id || change.type !== "update"
      ),
      {
        type: "update",
        taskId: id,
        data: updateData,
      },
    ]);

    setHasUnsavedChanges(true);

    // Replace the task in the list
    const newTasks = tasks.map((t) =>
      t.id === id ? { ...updatedTask, content: updatedContent } : t
    );
    setTasks(newTasks);
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
        <div className="sticky top-0 z-10 bg-gray-300 text-black p-4 mb-4 rounded-lg shadow-lg">
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
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks
                    .filter((task) => task.columnId === col.id)
                    .sort((a, b) => (a.position || 0) - (b.position || 0))}
                />
              ))}
            </div>
          </div>

          {createPortal(
            <DragOverlay>
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
