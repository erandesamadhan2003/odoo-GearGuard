import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useRequest } from "@/hooks/useRequest";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArrowLeft, Edit, User, Calendar, Clock, FileText } from "lucide-react";
import moment from "moment";

export const RequestDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedRequest,
    loading,
    getRequestById,
  } = useRequest();

  useEffect(() => {
    if (id) {
      getRequestById(id);
    }
  }, [id]);

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
    const map = { low: "default", medium: "info", high: "warning", urgent: "danger" };
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
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/requests")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {selectedRequest.subject}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={getPriorityVariant(selectedRequest.priority)}>
                  {selectedRequest.priority}
                </Badge>
                <Badge variant={getStageVariant(selectedRequest.stage)}>
                  {selectedRequest.stage}
                </Badge>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(`/requests/${id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {selectedRequest.description || "No description provided"}
                </p>
              </CardContent>
            </Card>

            {selectedRequest.notes && (
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {selectedRequest.notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedRequest.equipment && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Equipment</p>
                    <p className="font-medium">{selectedRequest.equipment.equipmentName}</p>
                    <p className="text-sm text-slate-500">{selectedRequest.equipment.serialNumber}</p>
                  </div>
                )}

                {selectedRequest.category && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Category</p>
                    <p className="font-medium">{selectedRequest.category.categoryName}</p>
                  </div>
                )}

                {selectedRequest.maintenanceTeam && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Team</p>
                    <p className="font-medium">{selectedRequest.maintenanceTeam.teamName}</p>
                  </div>
                )}

                {selectedRequest.scheduledDate && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Scheduled Date
                    </p>
                    <p className="font-medium">
                      {moment(selectedRequest.scheduledDate).format("MMM D, YYYY")}
                    </p>
                  </div>
                )}

                {selectedRequest.assignedTo && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Assigned To
                    </p>
                    <p className="font-medium">{selectedRequest.assignedTo.fullName}</p>
                    <p className="text-sm text-slate-500">{selectedRequest.assignedTo.email}</p>
                  </div>
                )}

                {selectedRequest.createdBy && (
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Created By</p>
                    <p className="font-medium">{selectedRequest.createdBy.fullName}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Created
                  </p>
                  <p className="font-medium">
                    {moment(selectedRequest.createdAt).format("MMM D, YYYY")}
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

