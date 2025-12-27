import { useDrop } from "react-dnd";
import { RequestCard } from "./RequestCard";

export const KanbanColumn = ({ stage, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "REQUEST",
    drop: (item) => onDrop(item.id, stage),
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`rounded-xl p-3 min-h-[450px] shadow
        ${isOver ? "bg-blue-100" : "bg-white"}`}
    >
      <h3 className="font-semibold mb-3 capitalize">
        {stage.replace("_", " ")}
      </h3>

      {items.map(req => (
        <RequestCard key={req.request_id} request={req} />
      ))}
    </div>
  );
};
