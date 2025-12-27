import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Clock, User } from "lucide-react";
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

const getStageVariant = (stage) => {
  const map = {
    new: "info",
    in_progress: "warning",
    repaired: "success",
    scrapped: "danger",
  };
  return map[stage] || "default";
};

export const RecentRequests = ({ requests = [] }) => {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <p className="text-sm text-slate-600 text-center py-8">
            No recent requests
          </p>
        ) : (
          <div className="space-y-4">
            {requests.slice(0, 5).map((request) => (
              <div
                key={request.requestId}
                onClick={() => navigate(`/requests/${request.requestId}`)}
                className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-slate-900">{request.subject}</h4>
                  <div className="flex gap-2">
                    <Badge variant={getPriorityVariant(request.priority)}>
                      {request.priority}
                    </Badge>
                    <Badge variant={getStageVariant(request.stage)}>
                      {request.stage}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  {request.equipment && (
                    <span>{request.equipment.equipmentName}</span>
                  )}
                  {request.scheduledDate && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {moment(request.scheduledDate).format("MMM D, YYYY")}
                    </div>
                  )}
                  {request.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {request.assignedTo.fullName}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

