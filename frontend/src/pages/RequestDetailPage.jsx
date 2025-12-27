import { useEffect } from "react";
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
  StickyNote,
} from "lucide-react";
import moment from "moment";

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedRequest, loading, getRequestById } = useRequest();

  useEffect(() => {
    if (id) {
      getRequestById(id);
    }
  }, [id]);


  const canEditRequest = (user, request) => {
    if (!user || !request) return false;

    // Allow if user is the creator
    if (request.createdBy?.id === user.id) return true;

    // Allow if user is assigned to the request
    if (request.assignedTo?.id === user.id) return true;

    // Allow if user is admin (adjust based on your user role structure)
    if (user.role === 'admin' || user.isAdmin) return true;

    return false;
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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <Button
                variant="ghost"
                onClick={() => navigate("/requests")}
                className="p-2 hover:bg-slate-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-3">
                  {selectedRequest.subject}
                </h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge
                    variant={getPriorityVariant(selectedRequest.priority)}
                    className="text-sm px-3 py-1"
                  >
                    {selectedRequest.priority?.toUpperCase()}
                  </Badge>
                  <Badge
                    variant={getStageVariant(selectedRequest.stage)}
                    className="text-sm px-3 py-1 capitalize"
                  >
                    {selectedRequest.stage?.replace("_", " ")}
                  </Badge>
                  {selectedRequest.requestType && (
                    <Badge className="text-sm px-3 py-1 capitalize">
                      {selectedRequest.requestType}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            {canEditRequest(user, selectedRequest) && (
              <Button
                variant="outline"
                onClick={() => navigate(`/requests/${id}/edit`)}
                className="ml-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="border-b border-slate-200">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedRequest.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {selectedRequest.notes && (
              <Card className="shadow-sm">
                <CardHeader className="border-b border-slate-200">
                  <CardTitle className="flex items-center gap-2">
                    <StickyNote className="w-5 h-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                    {selectedRequest.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm sticky top-6">
              <CardHeader className="border-b border-slate-200">
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-5">
                {selectedRequest.equipment && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Equipment
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.equipment.equipmentName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedRequest.equipment.serialNumber}
                    </p>
                  </div>
                )}

                {selectedRequest.category && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Category
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.category.categoryName}
                    </p>
                  </div>
                )}

                {selectedRequest.maintenanceTeam && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Team
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.maintenanceTeam.teamName}
                    </p>
                  </div>
                )}

                {selectedRequest.scheduledDate && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Scheduled Date
                    </p>
                    <p className="font-semibold text-slate-900">
                      {moment(selectedRequest.scheduledDate).format(
                        "MMM D, YYYY"
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {moment(selectedRequest.scheduledDate).format("h:mm A")}
                    </p>
                  </div>
                )}

                {selectedRequest.assignedTo && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.assignedTo.fullName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedRequest.assignedTo.email}
                    </p>
                  </div>
                )}

                {selectedRequest.createdBy && (
                  <div className="pb-4 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                      Created By
                    </p>
                    <p className="font-semibold text-slate-900">
                      {selectedRequest.createdBy.fullName}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created
                  </p>
                  <p className="font-semibold text-slate-900">
                    {moment(selectedRequest.createdAt).format("MMM D, YYYY")}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {moment(selectedRequest.createdAt).format("h:mm A")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};