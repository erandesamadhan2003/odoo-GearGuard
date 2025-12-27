import { useDrag } from "react-dnd";
import { Badge } from "@/components/common/Badge";
import { Wrench, User, Clock } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router";

const getPriorityVariant = (priority) => {
  const map = {
    low: "default",
    medium: "info",
    high: "warning",
    urgent: "danger",
  };
  return map[priority] || "default";
};

// Card accent colors based on priority
const priorityAccents = {
  low: "border-l-blue-500",
  medium: "border-l-yellow-500",
  high: "border-l-orange-500",
  urgent: "border-l-red-500",
};

export const KanbanCard = ({ request }) => {
  const navigate = useNavigate();

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { id: request.requestId || request.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityAccent =
    priorityAccents[request.priority] || priorityAccents.medium;

  return (
    <div
      ref={drag}
      onClick={() => navigate(`/requests/${request.requestId || request.id}`)}
      className={`bg-white rounded-lg border-l-4 ${priorityAccent} border-t border-r border-b border-slate-200 p-4 cursor-move hover:shadow-lg transition-all ${
        isDragging ? "opacity-50 scale-95" : "hover:scale-[1.02]"
      }`}
      style={{ minHeight: "140px" }}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-slate-900 text-sm line-clamp-2 flex-1">
          {request.subject}
        </h4>
        <Badge
          variant={getPriorityVariant(request.priority)}
          className="ml-2 text-xs shrink-0"
        >
          {request.priority}
        </Badge>
      </div>

      {/* Description */}
      {request.description && (
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
          {request.description}
        </p>
      )}

      {/* Footer Info */}
      <div className="space-y-2">
        {request.equipment && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Wrench className="w-3 h-3 text-blue-500" />
            <span className="truncate">{request.equipment.equipmentName}</span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          {request.assignedTo && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <User className="w-3 h-3 text-purple-500" />
              <span className="truncate max-w-30">
                {request.assignedTo.fullName}
              </span>
            </div>
          )}

          {request.scheduledDate && (
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3 h-3 text-orange-500" />
              <span>{moment(request.scheduledDate).format("MMM D")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
