import { useState } from "react";
import PlusIcon from "../icon/PlusIcon";
import { Column, Id } from "../types";
import ColumnContainer from "./ColumnContainer";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 100001);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  };

  console.log(columns);
  return (
    <div
      className="m-auto 
                 flex 
                 min-h-screen 
                 w-full 
                 items-center 
                 overflow-x-auto 
                 overflow-y-hidden
                 px-[40px]"
    >
      <div className="m-auto flex gap-4">
        <div className="flex gap-2">
          {columns.map((col) => (
            <ColumnContainer
              key={col.id}
              column={col}
              deleteColumn={deleteColumn}
            />
          ))}
        </div>
        <button
          className="h-[50px] 
                     w-[350px] 
                     min-w-[350px] 
                     cursor-pointer 
                     text-white
                     rounded-lg 
                     bg-gray-800
                     border-2 
                     border-zinc-900  
                     p-2 
                     ring-rose-500 
                     hover:ring-2
                     flex
                     gap-2"
          onClick={() => {
            createNewColumn();
          }}
        >
          <PlusIcon />
          Add Column
        </button>
      </div>
    </div>
  );
};
export default KanbanBoard;
