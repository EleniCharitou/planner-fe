import { useState } from "react";
import { Task } from "../types";
import { Id } from "react-toastify";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdEdit } from "react-icons/md";
import { IoTrashSharp } from "react-icons/io5";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
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
        className="bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
                   items-center flex text-left rounded-xl 
                   hover:ring-1 hover:ring-inset hover:ring-teal-500 
                   cursor-grab relative"
      >
        <textarea
          className="h-[90%] w-full resize-none border-none 
                             rounded bg-transparent text-white focus:outline-none"
          value={task.content}
          autoFocus
          placeholder="Task content here"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="task bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
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
      <div className="p-1 w-[90%]">
        <p className="task my-auto h-[90%] w-full overflow-auto overflow-x-hidden whitespace-pre-wrap">
          {task.content}
        </p>
      </div>
      <div className="flex flex-col items-center space-y-2 absolute right-2 top-1/2 transform -translate-y-1/2">
        <button
          className="hover:text-teal-500 hover:cursor-pointer"
          onClick={() => setEditMode(true)}
        >
          <MdEdit />
        </button>
        <button
          className="hover:text-teal-500 hover:cursor-pointer"
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
