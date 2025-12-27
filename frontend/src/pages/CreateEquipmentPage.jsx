import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useEquipment } from "@/hooks/useEquipment";
import { useDepartment } from "@/hooks/useDepartment";
import { useTeams } from "@/hooks/useTeams";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/common/Select";
import { ArrowLeft, Save } from "lucide-react";

export const CreateEquipmentPage = () => {
  const navigate = useNavigate();
  const { createEquipment, getAllCategories, categories } = useEquipment();
  const { getAllDepartments, departments } = useDepartment();
  const { getAllTeams, teams } = useTeams();

  const [formData, setFormData] = useState({
    equipmentName: "",
    serialNumber: "",
    categoryId: "",
    departmentId: "",
    maintenanceTeamId: "",
    assignedToUserId: "",
    location: "",
    status: "active",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getAllCategories();
    getAllDepartments();
    getAllTeams();
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.equipmentName) newErrors.equipmentName = "Required";
    if (!formData.serialNumber) newErrors.serialNumber = "Required";
    if (!formData.categoryId) newErrors.categoryId = "Required";
    if (!formData.maintenanceTeamId) newErrors.maintenanceTeamId = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        departmentId: formData.departmentId ? parseInt(formData.departmentId) : null,
        maintenanceTeamId: parseInt(formData.maintenanceTeamId),
        assignedToUserId: formData.assignedToUserId ? parseInt(formData.assignedToUserId) : null,
      };
      await createEquipment(payload);
      navigate("/equipment");
    } catch (error) {
      console.error("Create failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/equipment")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Add Equipment</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Equipment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Equipment Name *
                  </label>
                  <Input
                    value={formData.equipmentName}
                    onChange={(e) => handleChange("equipmentName", e.target.value)}
                    placeholder="e.g., CNC Machine 01"
                    className={errors.equipmentName ? "border-red-500" : ""}
                  />
                  {errors.equipmentName && (
                    <p className="text-sm text-red-600 mt-1">{errors.equipmentName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Serial Number *
                  </label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => handleChange("serialNumber", e.target.value)}
                    placeholder="e.g., SN-001"
                    className={errors.serialNumber ? "border-red-500" : ""}
                  />
                  {errors.serialNumber && (
                    <p className="text-sm text-red-600 mt-1">{errors.serialNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category *
                  </label>
                  <Select
                    value={formData.categoryId}
                    onChange={(value) => handleChange("categoryId", value)}
                    placeholder="Select category"
                    options={categories.map((cat) => ({
                      value: cat.categoryId,
                      label: cat.categoryName,
                    }))}
                    className={errors.categoryId ? "border-red-500" : ""}
                  />
                  {errors.categoryId && (
                    <p className="text-sm text-red-600 mt-1">{errors.categoryId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Maintenance Team *
                  </label>
                  <Select
                    value={formData.maintenanceTeamId}
                    onChange={(value) => handleChange("maintenanceTeamId", value)}
                    placeholder="Select team"
                    options={teams.map((team) => ({
                      value: team.teamId,
                      label: team.teamName,
                    }))}
                    className={errors.maintenanceTeamId ? "border-red-500" : ""}
                  />
                  {errors.maintenanceTeamId && (
                    <p className="text-sm text-red-600 mt-1">{errors.maintenanceTeamId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Department
                  </label>
                  <Select
                    value={formData.departmentId}
                    onChange={(value) => handleChange("departmentId", value)}
                    placeholder="Select department"
                    options={departments.map((dept) => ({
                      value: dept.departmentId,
                      label: dept.departmentName,
                    }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Status
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(value) => handleChange("status", value)}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "under_maintenance", label: "Under Maintenance" },
                      { value: "scrapped", label: "Scrapped" },
                    ]}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Location
                  </label>
                  <Input
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    placeholder="e.g., Building A, Floor 2, Room 201"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/equipment")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Creating..." : "Create Equipment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  );
};

