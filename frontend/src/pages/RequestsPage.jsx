import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useRequest } from "@/hooks/useRequest";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { SearchBar } from "@/components/common/SearchBar";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Wrench, Clock, User } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import moment from "moment";
import { isAdminOrManager, isTechnician, isOperator } from "@/utils/roles";

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
    on_hold: "default",
    completed: "success",
    cancelled: "danger",
    repaired: "success",
    scrapped: "danger",
  };
  return map[stage] || "default";
};

export const RequestsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const {
    requests,
    assignedRequests,
    myRequests,
    loading,
    getAllRequests,
    getAssignedRequests,
    getMyRequests,
  } = useRequest();

  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState(
    searchParams.get("stage") || ""
  );
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    if (isAdminOrManager(user)) {
      getAllRequests();
    } else if (isTechnician(user)) {
      getAssignedRequests();
    } else if (isOperator(user)) {
      getMyRequests();
    }
  }, [user]);

  // Get requests based on role
  const getRoleBasedRequests = () => {
    if (isAdminOrManager(user)) return requests;
    if (isTechnician(user)) return assignedRequests;
    if (isOperator(user)) return myRequests;
    return [];
  };

  const roleRequests = getRoleBasedRequests();

  const filteredRequests = roleRequests.filter((request) => {
    const matchesSearch =
      request.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = !stageFilter || request.stage === stageFilter;
    const matchesPriority =
      !priorityFilter || request.priority === priorityFilter;
    const matchesType = !typeFilter || request.requestType === typeFilter;

    return matchesSearch && matchesStage && matchesPriority && matchesType;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {isAdminOrManager(user)
                ? "Maintenance Requests"
                : isTechnician(user)
                ? "Assigned Requests"
                : "My Requests"}
            </h1>
            <p className="text-slate-600 mt-1">
              {isAdminOrManager(user)
                ? "Track and manage all maintenance requests"
                : isTechnician(user)
                ? "View and update requests assigned to you"
                : "Track your maintenance requests"}
            </p>
          </div>
          {/* Only Admin, Manager, and Operator can create requests per matrix (Technician cannot) */}
          {(isAdminOrManager(user) || isOperator(user)) && (
            <Button
              onClick={() => navigate("/requests/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Request
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search requests..."
              />
              <Select
                value={stageFilter}
                onChange={setStageFilter}
                placeholder="All Stages"
                options={[
                  { value: "new", label: "New" },
                  { value: "in_progress", label: "In Progress" },
                  { value: "on_hold", label: "On Hold" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                  { value: "repaired", label: "Repaired" },
                  { value: "scrapped", label: "Scrapped" },
                ]}
              />
              <Select
                value={priorityFilter}
                onChange={setPriorityFilter}
                placeholder="All Priorities"
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                placeholder="All Types"
                options={[
                  { value: "corrective", label: "Corrective" },
                  { value: "preventive", label: "Preventive" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredRequests.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title="No requests found"
            description={
              searchTerm || stageFilter || priorityFilter || typeFilter
                ? "Try adjusting your filters"
                : "Get started by creating your first maintenance request"
            }
            action={
              <Button
                onClick={() => navigate("/requests/new")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Create Request
              </Button>
            }
          />
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                key={request.requestId}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/requests/${request.requestId}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">
                        {request.subject}
                      </h3>
                      {request.description && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {request.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge variant={getPriorityVariant(request.priority)}>
                        {request.priority}
                      </Badge>
                      <Badge variant={getStageVariant(request.stage)}>
                        {request.stage}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm text-slate-600">
                    {request.equipment && (
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4" />
                        <span>{request.equipment.equipmentName}</span>
                      </div>
                    )}
                    {request.scheduledDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {moment(request.scheduledDate).format("MMM D, YYYY")}
                        </span>
                      </div>
                    )}
                    {request.assignedTo && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.assignedTo.fullName}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};
