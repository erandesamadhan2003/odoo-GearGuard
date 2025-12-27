import { useDrop } from "react-dnd";
import { RequestCard } from "./RequestCard";
import { Badge } from "@/components/common/Badge";
import { cn } from "@/lib/utils";

const stageColors = {
  new: "bg-blue-50 border-blue-200",
  in_progress: "bg-yellow-50 border-yellow-200",
  on_hold: "bg-orange-50 border-orange-200",
  completed: "bg-green-50 border-green-200",
  cancelled: "bg-red-50 border-red-200",
};

export const KanbanColumn = ({ stage, label, items = [], onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "REQUEST",
    drop: (item) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={cn(
        "rounded-lg p-4 min-h-[500px] border-2 transition-all",
        stageColors[stage] || "bg-slate-50 border-slate-200",
        isOver && "border-blue-400 shadow-lg"
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-900 capitalize">
          {label || stage.replace("_", " ")}
        </h3>
        <Badge variant={
          stage === "new" ? "info" : 
          stage === "in_progress" ? "warning" : 
          stage === "completed" ? "success" : 
          stage === "cancelled" ? "danger" : 
          "default"
        }>
          {items.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400">
            No requests
          </div>
        ) : (
          items.map((req) => (
            <RequestCard key={req.requestId || req.id} request={req} />
          ))
        )}
      </div>
    </div>
  );
};
