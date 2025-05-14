import DeleteIcon from "../icon/DeleteIcon";
import { Column, Id } from "../types";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}
const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

  return (
    <div
      className="bg-gray-800
                 w-[350px]
                 h-[500px]
                 max-h-[500px]
                 rounded-md
                 flex
                 flex-col
                 text-white
                 "
    >
      <div
        className="bg-gray-800
                     text-md
                     h-[60px]
                     cursor-grab
                     rounded-md
                     rounded-b-none
                     p-3
                     font-bold
                     border-zinc-900 
                     border-4
                     flex
                     items-center
                     justify-between"
      >
        <div className="flex gap-2">
          <div
            className="flex
                     justify-center
                     items-center
                     bg-gray-800
                     px-2 
                     py-1
                     text-sm
                     rounded-full"
          >
            0
          </div>
          {column.title}
        </div>
        <button onClick={() => deleteColumn(column.id)}>
          <DeleteIcon />
        </button>
      </div>

      <div className="flex flex-grow">Content</div>
      <div>Footer</div>
    </div>
  );
};

export default ColumnContainer;
