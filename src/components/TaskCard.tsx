import { useState } from "react";
import DeleteIcon from "../icon/DeleteIcon";
import { Task } from "../types";
import { Id } from "react-toastify";

interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
}

const TaskCard = ({ task, deleteTask }: Props) => {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  return (
    <div
      className="bg-zinc-900 p-2.5 h-[100px] min-h-[100px]
                   items-center flex text-left rounded-xl 
                   hover:ring-1 hover:ring-inset hover:ring-rose-500 
                   cursor-grab relative"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}
    >
      {task.content}
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
