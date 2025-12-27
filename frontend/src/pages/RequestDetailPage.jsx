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
  Wrench,
  Tags,
  Users,
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
      on_hold: "default",
      completed: "success",
      cancelled: "danger",
      repaired: "success",
      scrapped: "danger",
    };
    return map[stage] || "default";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Enhanced Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6 flex-1">
              <Button
                variant="ghost"
                onClick={() => navigate("/requests")}
                className="p-3 hover:bg-white/10 text-white rounded-xl"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant={getPriorityVariant(selectedRequest.priority)}
                    className="text-sm px-4 py-1.5 font-semibold"
                  >
                    {selectedRequest.priority?.toUpperCase()}
                  </Badge>
                  <Badge
                    variant={getStageVariant(selectedRequest.stage)}
                    className="text-sm px-4 py-1.5 capitalize font-semibold"
                  >
                    {selectedRequest.stage?.replace("_", " ")}
                  </Badge>
                  {selectedRequest.requestType && (
                    <Badge className="text-sm px-4 py-1.5 capitalize font-semibold bg-white/20 text-white">
                      {selectedRequest.requestType}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl font-bold mb-2">
                  {selectedRequest.subject}
                </h1>
                <p className="text-blue-100 text-lg">
                  Request ID: #{selectedRequest.requestId}
                </p>
              </div>
            </div>
            {canEditRequest(user, selectedRequest) && (
              <Button
                variant="outline"
                onClick={() => navigate(`/requests/${id}/edit`)}
                className="ml-4 bg-white text-blue-600 hover:bg-blue-50 border-0 px-6 py-3 h-auto"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Request
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Enhanced */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader className="border-b border-slate-100 bg-slate-50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 p-8">
                <p className="text-slate-700 whitespace-pre-wrap leading-relaxed text-lg">
                  {selectedRequest.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {selectedRequest.notes && (
              <Card className="shadow-md border-0 bg-yellow-50">
                <CardHeader className="border-b border-yellow-100">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <StickyNote className="w-5 h-5 text-yellow-700" />
                    </div>
                    <span className="text-yellow-900">Notes</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 p-8">
                  <p className="text-yellow-900 whitespace-pre-wrap leading-relaxed text-lg">
                    {selectedRequest.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-md border-0 sticky top-6">
              <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50">
                <CardTitle className="text-xl">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 p-6 space-y-6">
                {selectedRequest.equipment && (
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Wrench className="w-5 h-5 text-blue-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Equipment
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedRequest.equipment.equipmentName}
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-mono">
                      SN: {selectedRequest.equipment.serialNumber}
                    </p>
                  </div>
                )}

                {selectedRequest.category && (
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Tags className="w-5 h-5 text-purple-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Category
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedRequest.category.categoryName}
                    </p>
                  </div>
                )}

                {selectedRequest.maintenanceTeam && (
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-green-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Maintenance Team
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 text-lg">
                      {selectedRequest.maintenanceTeam.teamName}
                    </p>
                  </div>
                )}

                {selectedRequest.scheduledDate && (
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Scheduled Date
                      </p>
                    </div>
                    <p className="font-bold text-slate-900 text-lg">
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
                  <div className="pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-indigo-600" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Assigned To
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-700 font-bold">
                          {selectedRequest.assignedTo.fullName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {selectedRequest.assignedTo.fullName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {selectedRequest.assignedTo.email}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.createdBy && (
                  <div className="pb-6 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Created By
                    </p>
                    <p className="font-bold text-slate-900">
                      {selectedRequest.createdBy.fullName}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-slate-600" />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Created
                    </p>
                  </div>
                  <p className="font-bold text-slate-900">
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
