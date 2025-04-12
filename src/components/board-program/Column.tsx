import { AttractionsDetails } from "../../types";
import Card from "./Card";
import "../../style/Board.css";

interface columnProps {
  id: string;
  title: string;
  cards: AttractionsDetails[];
  //   onAddCard: (card: AttractionsDetails) => void;
  //   onMoveCard: (cardId: string, destColumnId: string) => void;
}

const Column: React.FC<columnProps> = ({ id, title, cards }) => {
  return (
    <div className="column inline-block align-top bg-violet-100 rounded w-60 p-4 m-2">
      <div className="flex justify-between intems-center">
        <h2 className="text-lg font-bold">{title}</h2>
        <button className="text-right text-lg font-bold text-violet-800">
          +
        </button>
      </div>
      <div className="column-cards">
        {cards.map((card) => (
          <Card
            key={card.id}
            {...card}
            //   onMoveCard
          />
        ))}
      </div>
    </div>
  );
};

export default Column;
