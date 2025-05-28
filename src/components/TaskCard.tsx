import { useState } from "react";
import DeleteIcon from "../icon/DeleteIcon";
import { Task } from "../types";
import { Id } from "react-toastify";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setMouseIsOver(false);
  };

  if (editMode) {
    return (
      <div
        className="bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
                   items-center flex text-left rounded-xl 
                   hover:ring-1 hover:ring-inset hover:ring-rose-500 
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
      className="task bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
                   items-center flex text-left rounded-xl 
                   hover:ring-1 hover:ring-inset hover:ring-rose-500 
                   cursor-grab relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
      onClick={toggleEditMode}
    >
      <p className="task my-auto h-[90%] w-full overflow-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>
      {mouseIsOver && (
        <button
          className="stroke-white absolute right-4 top-1/2
                    -translate-y-1/2  p-2 rounded
                    opacity-60 hover:opacity-100"
          onClick={() => {
            deleteTask(task.id);
          }}
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
