import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icon/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, updatedTask: Task) => void;
  tasks: Task[];
}
const ColumnContainer = ({
  column,
  updateColumn,
  createTask,
  tasks,
  deleteTask,
  updateTask,
}: Props) => {
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        className="bg-teal-800
        opacity-30
        border-2
        border-teal-500
                 w-[300px]
                 h-[500px]
                 max-h-[500px]
                 rounded-md
                 flex
                 flex-col
                 "
      />
    );
  }
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-teal-200
                 w-[300px]
                 h-[500px]
                 max-h-[500px]
                 rounded-md
                 flex
                 flex-col
                 "
    >
      <div
        className="bg-teal-800
                     text-md
                     h-[60px]
                     cursor-grab
                     rounded-md
                     rounded-b-none
                     p-3
                     font-bold
                     flex
                     items-center
                     justify-between"
      >
        <div className="flex gap-2">
          <div
            className="flex
                     justify-center
                     items-center
                     px-2 
                     py-1
                     text-sm
                     rounded-full"
          >
            {tasks.length}
          </div>
          {!editMode && (
            <div onClick={() => setEditMode(true)} className="cursor-pointer">
              {column.title}
            </div>
          )}
          {editMode && (
            <input
              type="text"
              maxLength={20}
              className="w-[200px] border border-teal-500 rounded px-2 py-1 outline-none focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => {
                setEditMode(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
      </div>

      <div
        className="flex flex-grow flex-col gap-4 p-4
                      overflow-x-hidden overflow-y-auto"
      >
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      <button
        className="flex gap-2 items-center rounded-md p-4 text-black
                 hover:bg-teal-900 hover:cursor-pointer"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon />
        Add attraction
      </button>
    </div>
  );
};

export default ColumnContainer;
