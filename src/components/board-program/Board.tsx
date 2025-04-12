import React, { useEffect, useState } from "react";
import Column from "./Column";
import { ColumnData } from "../../types.ts";
import axios from "axios";

interface BoardProps {
  title: string;
}

const Board: React.FC<BoardProps> = ({ title }) => {
  const [attractions, setAttractions] = useState<ColumnData[]>([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/grouped_attractions/")
      .then((res) => {
        const data = res.data;
        setAttractions(data);
        console.log("data: ", data);
      })
      .catch((err) => console.error(err.message));
  }, []);

  console.log("attr:", attractions);

  return (
    <div className="Board w-full overflow-x-auto whitespace-nowrap p-20 items-center bg-amber-100 ">
      <h1> {title} </h1>
      <div>
        {attractions.map((attraction) => (
          <Column
            key={attraction.id}
            {...attraction}
            id={attraction.id}
            title={attraction.title}
            cards={attraction.cards}
            // onAdd
            // onMove
          />
        ))}
      </div>
    </div>
  );
};

export default Board;
