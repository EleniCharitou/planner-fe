interface CardProps {
  id: string;
  title: string;

  // columnId: string;
  // onMoveCard: (cardId: string, destColumnId: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title }) => {
  return (
    <div className="card align-top bg-violet-200 border-1 border-violet-700 rounded m-2 p-2 w-50">
      <div className="card-actions flex justify-between intems-center">
        <h3>{title} </h3>
        <button
          className="rotate-90"
          // onClick={() => onMoveCard(id, 'col2')}
        >
          |||
        </button>
      </div>
    </div>
  );
};

export default Card;
