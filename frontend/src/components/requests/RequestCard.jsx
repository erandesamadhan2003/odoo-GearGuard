import { useDrag } from "react-dnd";
import { User, AlertCircle } from "lucide-react";
import { Badge } from "@/components/common/Badge";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

const priorityColors = {
  low: "default",
  medium: "info",
  high: "warning",
  urgent: "danger",
};

export const RequestCard = ({ request }) => {
  const navigate = useNavigate();
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "REQUEST",
    item: { id: request.requestId || request.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      onClick={() => navigate(`/requests/${request.requestId || request.id}`)}
      className={cn(
        "bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-move transition-all hover:shadow-md",
        isDragging && "opacity-50",
        request.isOverdue && "border-l-4 border-l-red-500"
      )}
    >
      {/* Subject */}
      <h4 className="font-semibold text-sm text-slate-900 mb-2 line-clamp-2">
        {request.subject}
      </h4>

      {/* Equipment */}
      {request.equipment && (
        <p className="text-xs text-slate-600 mb-3">
          {request.equipment.equipmentName}
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <Badge variant={priorityColors[request.priority] || "default"} className="text-xs">
          {request.priority}
        </Badge>
        {request.isOverdue && (
          <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
            <AlertCircle className="w-3 h-3" />
            OVERDUE
          </div>
        )}
      </div>

      {/* Assigned Technician */}
      {request.assignedTo && (
        <div className="flex items-center gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
          <User className="w-3 h-3" />
          <span className="truncate">{request.assignedTo.fullName}</span>
        </div>
      )}
    </div>
  );
};
