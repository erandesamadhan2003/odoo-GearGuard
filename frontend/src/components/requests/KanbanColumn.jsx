import { useDrop } from "react-dnd";
import { KanbanCard } from "./KanbanCard";

// Column color schemes
const columnColors = {
  new: {
    header: "bg-gradient-to-r from-blue-500 to-blue-600",
    border: "border-blue-200",
    bg: "bg-blue-50",
    hoverBg: "bg-blue-100",
    badge: "bg-blue-100 text-blue-700",
  },
  in_progress: {
    header: "bg-gradient-to-r from-purple-500 to-purple-600",
    border: "border-purple-200",
    bg: "bg-purple-50",
    hoverBg: "bg-purple-100",
    badge: "bg-purple-100 text-purple-700",
  },
  on_hold: {
    header: "bg-gradient-to-r from-orange-500 to-orange-600",
    border: "border-orange-200",
    bg: "bg-orange-50",
    hoverBg: "bg-orange-100",
    badge: "bg-orange-100 text-orange-700",
  },
  completed: {
    header: "bg-gradient-to-r from-green-500 to-green-600",
    border: "border-green-200",
    bg: "bg-green-50",
    hoverBg: "bg-green-100",
    badge: "bg-green-100 text-green-700",
  },
  cancelled: {
    header: "bg-gradient-to-r from-red-500 to-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    hoverBg: "bg-red-100",
    badge: "bg-red-100 text-red-700",
  },
};

export const KanbanColumn = ({ stage, label, items, onDrop }) => {
  const [{ isOver }, drop] = useDrop({
    accept: "CARD",
    drop: (item) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const colors = columnColors[stage] || columnColors.new;

  return (
    <div className="flex flex-col h-full">
      {/* Column Header - Colorful Gradient */}
      <div
        className={`${colors.header} rounded-t-lg border ${colors.border} p-4 flex items-center justify-between shadow-sm`}
      >
        <h3 className="font-semibold text-white">{label}</h3>
        <span
          className={`px-3 py-1 ${colors.badge} rounded-full font-medium text-sm shadow-sm`}
        >
          {items.length}
        </span>
      </div>

      {/* Column Content - Scrollable with colored background */}
      <div
        ref={drop}
        className={`flex-1 ${colors.bg} rounded-b-lg border-x border-b ${
          colors.border
        } p-3 overflow-y-auto min-h-0 transition-colors ${
          isOver ? colors.hoverBg : ""
        }`}
        style={{
          maxHeight: "calc(100vh - 280px)",
        }}
      >
        <div className="space-y-3">
          {items.map((item) => (
            <KanbanCard key={item.requestId || item.id} request={item} />
          ))}
          {items.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Drop items here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
