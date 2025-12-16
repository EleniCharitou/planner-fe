import { useState } from "react";
import { AttractionsDetails, Task } from "../types";
import { Id } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, updatedTask: Task) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };

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
    categories.find((c) => c.value === task.attractionData.category)?.label ||
    "📍";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
                   items-center flex text-left rounded-xl 
                   border-2 border-teal-500 opacity-30
                   cursor-grab relative"
      />
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-zinc-900 p-3 rounded-xl space-y-3 cursor-default"
      >
        {/* Title */}
        <input
          type="text"
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.title}
          placeholder="Title"
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                title: e.target.value,
              },
            })
          }
        />

        {/* Location */}
        <input
          type="text"
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.location}
          placeholder="Location"
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                location: e.target.value,
              },
            })
          }
        />

        {/* Category */}
        <select
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.category}
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                category: e.target.value as AttractionsDetails["category"],
              },
            })
          }
        >
          {categories.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Cost */}
        <input
          type="number"
          step="0.1"
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.cost}
          placeholder="Cost"
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                cost: Number(e.target.value),
              },
            })
          }
        />

        {/* Map URL */}
        <input
          type="text"
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.mapUrl || ""}
          placeholder="Map URL"
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                mapUrl: e.target.value,
              },
            })
          }
        />

        {/* Ticket URL */}
        <input
          type="text"
          className="w-full p-1 rounded bg-zinc-800 text-white border border-zinc-700"
          value={task.attractionData.ticket || ""}
          placeholder="Ticket URL"
          onChange={(e) =>
            updateTask(task.id, {
              ...task,
              attractionData: {
                ...task.attractionData,
                ticket: e.target.value,
              },
            })
          }
        />

        {/* Save Button */}
        <div className="flex justify-end space-x-2">
          <button
            className="px-3 py-1 bg-teal-500 rounded hover:bg-teal-600"
            onClick={toggleEditMode}
          >
            Save
          </button>
          <button
            className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task bg-teal-100 p-2.5 h-[100px] min-h-[100px] text-black font-medium 
                   items-center flex text-left rounded-xl 
                   hover:ring-1 hover:ring-inset hover:ring-teal-500 
                   cursor-grab relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      <div>
        {/* Row 1: Title-Location */}
        <div className="grid grid-cols-1 gap-4">
          {/* Left column: Title */}
          <div className="flex items-center gap-4">
            <span
              className="fit-content truncate"
              title={task.attractionData.title}
            >
              ✨ {task.attractionData.title}
            </span>
            <span className="fit-content truncate" title="Title">
              📌{task.attractionData.location}
            </span>
          </div>

          {/* Row 2: Category + Cost + Map + Ticket*/}
          <div className="flex items-center gap-4">
            <span className="fit-content" title="Cost">
              💰 {task.attractionData.cost}
            </span>
            <span
              className="cursor-pointer"
              title={
                categories.find((c) => c.value === task.attractionData.category)
                  ?.label || ""
              }
            >
              {categoryIcon.split(" ")[0]}
            </span>
            {task.attractionData.mapUrl && (
              <a
                href={task.attractionData.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Map"
                className="hover:scale-130"
              >
                🗺️
              </a>
            )}
            {task.attractionData.ticket && (
              <a
                href={task.attractionData.ticket}
                target="_blank"
                rel="noopener noreferrer"
                title="Buy Ticket"
                className="hover:scale-130"
              >
                🎫
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center absolute right-0 -bottom-3 transform -translate-y-1/2">
        <button
          className="hover:text-teal-500 hover:cursor-pointer w-8 h-8"
          onClick={() => setEditMode(true)}
        >
          <MdEdit />
        </button>
        <button
          className="hover:text-teal-500 hover:cursor-pointer w-8 h-8"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <IoTrashSharp />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
