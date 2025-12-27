import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useEquipment } from "@/hooks/useEquipment";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArrowLeft, Edit, Trash2, Wrench, Calendar, Building2, User, Cpu } from "lucide-react";
import { Modal } from "@/components/common/Modal";
import { useState } from "react";

export const EquipmentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedEquipment,
    equipmentRequests,
    equipmentLoading,
    getEquipmentById,
    getEquipmentRequests,
    deleteEquipment,
  } = useEquipment();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (id) {
      getEquipmentById(id);
      getEquipmentRequests(id);
    }
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteEquipment(id);
      navigate("/equipment");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (equipmentLoading || !selectedEquipment) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }

  const openRequests = equipmentRequests.filter(
    (r) => r.stage !== "repaired" && r.stage !== "scrapped"
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/equipment")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {selectedEquipment.equipmentName}
              </h1>
              <p className="text-slate-600 mt-1">
                Serial: {selectedEquipment.serialNumber}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/equipment/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Status</p>
                    <Badge
                      variant={
                        selectedEquipment.status === "active"
                          ? "success"
                          : selectedEquipment.status === "under_maintenance"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {selectedEquipment.status?.replace("_", " ")}
                    </Badge>
                  </div>
                  {selectedEquipment.category && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Category
                      </p>
                      <p className="font-medium">{selectedEquipment.category.categoryName}</p>
                    </div>
                  )}
                  {selectedEquipment.department && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        Department
                      </p>
                      <p className="font-medium">
                        {selectedEquipment.department.departmentName}
                      </p>
                    </div>
                  )}
                  {selectedEquipment.assignedUser && (
                    <div>
                      <p className="text-sm text-slate-600 mb-1 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned To
                      </p>
                      <p className="font-medium">
                        {selectedEquipment.assignedUser.fullName}
                      </p>
                    </div>
                  )}
                  {selectedEquipment.location && (
                    <div className="col-span-2">
                      <p className="text-sm text-slate-600 mb-1">Location</p>
                      <p className="font-medium">{selectedEquipment.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Maintenance Requests */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Maintenance Requests</CardTitle>
                  <Button
                    onClick={() => navigate(`/requests/new?equipmentId=${id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Wrench className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {equipmentRequests.length === 0 ? (
                  <p className="text-sm text-slate-600 text-center py-8">
                    No maintenance requests
                  </p>
                ) : (
                  <div className="space-y-3">
                    {equipmentRequests.map((request) => (
                      <div
                        key={request.requestId}
                        onClick={() => navigate(`/requests/${request.requestId}`)}
                        className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-slate-900">
                              {request.subject}
                            </h4>
                            <p className="text-sm text-slate-600 mt-1">
                              {request.stage} • {request.priority}
                            </p>
                          </div>
                          <Badge
                            variant={
                              request.stage === "repaired"
                                ? "success"
                                : request.stage === "scrapped"
                                ? "danger"
                                : request.stage === "in_progress"
                                ? "warning"
                                : "info"
                            }
                          >
                            {request.stage}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => navigate(`/requests/new?equipmentId=${id}`)}
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Create Request
                </Button>
                {openRequests.length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">
                      {openRequests.length} Open {openRequests.length === 1 ? "Request" : "Requests"}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Equipment"
        >
          <p className="mb-6 text-slate-600">
            Are you sure you want to delete this equipment? This action cannot
            be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

