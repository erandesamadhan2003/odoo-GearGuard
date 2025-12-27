import { useDrag } from "react-dnd";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";

const priorityColors = {
    low: "bg-gray-200 text-gray-700",
    medium: "bg-blue-100 text-blue-700",
    high: "bg-orange-100 text-orange-700",
    urgent: "bg-red-100 text-red-700",
};

export const RequestCard = ({ request }) => {
    const navigate = useNavigate();
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "REQUEST",
        item: { id: request.request_id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const technician = request.assigned_technician;

    return (
        <div onClick={() => navigate(`/requests/${request.request_id}/edit`)}
            ref={drag}
            className={`bg-white p-3 mb-3 rounded-lg shadow  cursor-move transition 
      ${isDragging ? "opacity-50" : ""}`}
        >
            {/* Subject */}
            <h4 className="font-semibold text-sm mb-1">
                {request.subject}
            </h4>

            {/* Equipment */}
            <p className="text-xs text-gray-500 mb-2">
                🛠 {request.equipment_name}
            </p>

            <div className="flex items-center justify-between">
                {/* Technician */}
                <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-500 text-lg" />

                    {technician?.name ? (
                        <span className="text-xs text-gray-700">
                            {technician.name}
                        </span>
                    ) : (
                        <span className="text-xs italic text-gray-400">
                            Unassigned
                        </span>
                    )}
                </div>

                {/* Priority + Overdue */}
                <div className="flex items-center gap-2">
                    <span
                        className={`text-xs px-2 py-1 rounded ${priorityColors[request.priority]}`}
                    >
                        {request.priority}
                    </span>

                    {request.is_overdue && (
                        <span className="text-xs font-semibold text-red-600">
                            Overdue
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};
