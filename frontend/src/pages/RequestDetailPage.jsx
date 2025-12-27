import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useRequest } from "@/hooks/useRequest";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import {
  ArrowLeft,
  Edit,
  User,
  Calendar,
  Clock,
  FileText,
  Wrench,
  Tags,
  Users,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Settings,
} from "lucide-react";
import moment from "moment";
import { isTechnician, canUpdateStage } from "@/utils/roles";

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedRequest, loading, getRequestById, updateRequestStage } =
    useRequest();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      getRequestById(id);
    }
  }, [id]);

  const canEditRequest = (user, request) => {
    if (!user || !request) return false;
    if (
      request.createdBy?.userId === user.userId ||
      request.createdBy?.id === user.id
    )
      return true;
    if (
      request.assignedTo?.userId === user.userId ||
      request.assignedTo?.id === user.id
    )
      return true;
    if (user.role === "admin" || user.role === "manager") return true;
    return false;
  };

  const isAssignedToMe = (user, request) => {
    if (!user || !request || !request.assignedTo) return false;
    return (
      request.assignedTo.userId === user.userId ||
      request.assignedTo.id === user.id
    );
  };

  const handleStageUpdate = async (newStage) => {
    try {
      setUpdating(true);
      await updateRequestStage(id, newStage);
      await getRequestById(id); // Refresh data
    } catch (error) {
      console.error("Failed to update stage:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !selectedRequest) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-blue-100 text-blue-700 border-blue-200",
      medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
      high: "bg-orange-100 text-orange-700 border-orange-200",
      urgent: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[priority] || colors.medium;
  };

  const getStageColor = (stage) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      in_progress: "bg-purple-100 text-purple-700 border-purple-200",
      on_hold: "bg-gray-100 text-gray-700 border-gray-200",
      completed: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      repaired: "bg-emerald-100 text-emerald-700 border-emerald-200",
      scrapped: "bg-slate-100 text-slate-700 border-slate-200",
    };
    return colors[stage] || colors.new;
  };

  const stageOptions = [
    { value: "new", label: "New", icon: AlertCircle },
    { value: "in_progress", label: "In Progress", icon: TrendingUp },
    { value: "on_hold", label: "On Hold", icon: Clock },
    { value: "completed", label: "Completed", icon: CheckCircle },
    { value: "repaired", label: "Repaired", icon: Wrench },
    { value: "cancelled", label: "Cancelled", icon: AlertCircle },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/requests")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </Button>

        {/* Assignment Badge for Technicians */}
        {isTechnician(user) && isAssignedToMe(user, selectedRequest) && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white flex items-center gap-3 shadow-lg">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-lg">Assigned to You</p>
              <p className="text-blue-100 text-sm">
                You can update the status of this request
              </p>
            </div>
          </div>
        )}

        {/* Header Card */}
        <Card className="border-0 shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-8 border-b">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getPriorityColor(
                      selectedRequest.priority
                    )}`}
                  >
                    {selectedRequest.priority?.toUpperCase()}
                  </span>
                  <span
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${getStageColor(
                      selectedRequest.stage
                    )}`}
                  >
                    {selectedRequest.stage?.replace("_", " ").toUpperCase()}
                  </span>
                  {selectedRequest.requestType && (
                    <span className="px-4 py-1.5 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedRequest.requestType.toUpperCase()}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {selectedRequest.subject}
                </h1>
                <p className="text-slate-600">
                  Request #{selectedRequest.requestId}
                </p>
              </div>

              {canEditRequest(user, selectedRequest) && (
                <Button
                  onClick={() => navigate(`/requests/${id}/edit`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Request
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 p-6 bg-white">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {selectedRequest.priority}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Priority
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {moment(selectedRequest.createdAt).fromNow()}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Created
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {selectedRequest.scheduledDate
                  ? moment(selectedRequest.scheduledDate).format("MMM D")
                  : "N/A"}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Scheduled
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">
                {selectedRequest.durationHours || "N/A"}
              </div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">
                Hours
              </div>
            </div>
          </div>
        </Card>

        {/* Status Update Section - Only for Technicians assigned to this request */}
        {canUpdateStage(user) && isAssignedToMe(user, selectedRequest) && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                Update Request Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {stageOptions.map((stage) => {
                  const StageIcon = stage.icon;
                  const isCurrentStage = selectedRequest.stage === stage.value;
                  return (
                    <button
                      key={stage.value}
                      onClick={() =>
                        !isCurrentStage && handleStageUpdate(stage.value)
                      }
                      disabled={isCurrentStage || updating}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isCurrentStage
                          ? "border-blue-600 bg-blue-50"
                          : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                      } ${
                        updating
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <StageIcon
                        className={`w-6 h-6 mx-auto mb-2 ${
                          isCurrentStage ? "text-blue-600" : "text-slate-400"
                        }`}
                      />
                      <p
                        className={`text-sm font-medium ${
                          isCurrentStage ? "text-blue-600" : "text-slate-700"
                        }`}
                      >
                        {stage.label}
                      </p>
                      {isCurrentStage && (
                        <p className="text-xs text-blue-600 mt-1">Current</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">
          {/* Description */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-slate-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                {selectedRequest.description || "No description provided"}
              </p>
            </CardContent>
          </Card>

          {/* Notes */}
          {selectedRequest.notes && (
            <Card className="border-0 shadow-lg bg-amber-50 border-amber-200">
              <CardHeader className="border-b border-amber-200 bg-amber-100">
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <AlertCircle className="w-5 h-5" />
                  Important Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <p className="text-amber-900 text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedRequest.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Request Details Table - Professional Grid Layout */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-linear-to-br from-slate-50 to-blue-50">
              <CardTitle className="text-xl">Request Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {/* Equipment Row */}
                {selectedRequest.equipment && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-slate-700">
                        Equipment
                      </span>
                    </div>
                    <div className="col-span-2 p-6 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-900 text-lg">
                          {selectedRequest.equipment.equipmentName}
                        </p>
                        <p className="text-sm text-slate-500 font-mono mt-1">
                          SN: {selectedRequest.equipment.serialNumber}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Category Row */}
                {selectedRequest.category && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <Tags className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-slate-700">
                        Category
                      </span>
                    </div>
                    <div className="col-span-2 p-6 flex items-center">
                      <p className="font-semibold text-slate-900 text-lg">
                        {selectedRequest.category.categoryName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Team Row */}
                {selectedRequest.maintenanceTeam && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-slate-700">
                        Maintenance Team
                      </span>
                    </div>
                    <div className="col-span-2 p-6 flex items-center">
                      <p className="font-semibold text-slate-900 text-lg">
                        {selectedRequest.maintenanceTeam.teamName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Scheduled Date Row */}
                {selectedRequest.scheduledDate && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <span className="font-semibold text-slate-700">
                        Scheduled Date
                      </span>
                    </div>
                    <div className="col-span-2 p-6">
                      <p className="font-semibold text-slate-900 text-lg">
                        {moment(selectedRequest.scheduledDate).format(
                          "MMMM D, YYYY"
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {moment(selectedRequest.scheduledDate).format("h:mm A")}
                      </p>
                    </div>
                  </div>
                )}

                {/* Assigned To Row */}
                {selectedRequest.assignedTo && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <span className="font-semibold text-slate-700">
                        Assigned To
                      </span>
                    </div>
                    <div className="col-span-2 p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                          {selectedRequest.assignedTo.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-lg">
                            {selectedRequest.assignedTo.fullName}
                          </p>
                          <p className="text-sm text-slate-500">
                            {selectedRequest.assignedTo.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Created By Row */}
                {selectedRequest.createdBy && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <User className="w-5 h-5 text-slate-600" />
                      <span className="font-semibold text-slate-700">
                        Created By
                      </span>
                    </div>
                    <div className="col-span-2 p-6 flex items-center">
                      <p className="font-semibold text-slate-900 text-lg">
                        {selectedRequest.createdBy.fullName}
                      </p>
                    </div>
                  </div>
                )}

                {/* Created Date Row */}
                <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                  <div className="p-6 bg-slate-50 flex items-center gap-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <span className="font-semibold text-slate-700">
                      Created On
                    </span>
                  </div>
                  <div className="col-span-2 p-6">
                    <p className="font-semibold text-slate-900 text-lg">
                      {moment(selectedRequest.createdAt).format("MMMM D, YYYY")}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {moment(selectedRequest.createdAt).format("h:mm A")} •{" "}
                      {moment(selectedRequest.createdAt).fromNow()}
                    </p>
                  </div>
                </div>

                {/* Completed Date Row */}
                {selectedRequest.completedDate && (
                  <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
                    <div className="p-6 bg-slate-50 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-slate-700">
                        Completed On
                      </span>
                    </div>
                    <div className="col-span-2 p-6">
                      <p className="font-semibold text-slate-900 text-lg">
                        {moment(selectedRequest.completedDate).format(
                          "MMMM D, YYYY"
                        )}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        {moment(selectedRequest.completedDate).format("h:mm A")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};
