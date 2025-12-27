import { useState, useEffect } from "react";
import { useRequest } from "@/hooks/useRequest";
import { useEquipment } from "@/hooks/useEquipment";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/common/Select";
import { Card, CardContent } from "@/components/common/Card";
import { Save } from "lucide-react";

export const RequestForm = ({ equipmentId, initialData, onSuccess }) => {
  const navigate = useNavigate();
  const { createRequest, updateRequest, loading } = useRequest();
  const { equipment, getAllEquipment } = useEquipment();

  const [formData, setFormData] = useState(
    initialData || {
      subject: "",
      description: "",
      equipmentId: equipmentId || "",
      categoryId: "",
      maintenanceTeamId: "",
      assignedToUserId: "",
      priority: "medium",
      requestType: "corrective",
      scheduledDate: "",
    }
  );
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllEquipment();
  }, []);

  useEffect(() => {
    if (equipmentId && equipment.length > 0) {
      const selectedEquipment = equipment.find((eq) => eq.equipmentId === parseInt(equipmentId));
      if (selectedEquipment) {
        handleEquipmentChange(selectedEquipment.equipmentId);
      }
    }
  }, [equipmentId, equipment]);

  const handleEquipmentChange = (id) => {
    const eq = equipment.find((e) => e.equipmentId === parseInt(id));
    if (eq) {
      setFormData((prev) => ({
        ...prev,
        equipmentId: id,
        categoryId: eq.categoryId || "",
        maintenanceTeamId: eq.maintenanceTeamId || "",
        assignedToUserId: eq.assignedToUserId || "",
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.subject) newErrors.subject = "Required";
    if (!formData.equipmentId) newErrors.equipmentId = "Required";
    if (!formData.priority) newErrors.priority = "Required";
    if (!formData.requestType) newErrors.requestType = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const payload = {
        ...formData,
        equipmentId: parseInt(formData.equipmentId),
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        maintenanceTeamId: formData.maintenanceTeamId ? parseInt(formData.maintenanceTeamId) : null,
        assignedToUserId: formData.assignedToUserId ? parseInt(formData.assignedToUserId) : null,
        scheduledDate: formData.scheduledDate || null,
      };

      if (initialData) {
        await updateRequest(initialData.requestId, payload);
      } else {
        await createRequest(payload);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/requests");
      }
    } catch (error) {
      console.error("Submit failed:", error);
    }
  };

  const filteredEquipment = equipment.filter((eq) =>
    eq.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedEquipment = equipment.find(
    (eq) => eq.equipmentId === parseInt(formData.equipmentId)
  );

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Subject *
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              placeholder="Enter issue title"
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-600 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe the issue in detail"
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Equipment Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Equipment *
            </label>
            {!equipmentId && (
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search equipment..."
                className="mb-2"
              />
            )}
            <Select
              value={formData.equipmentId}
              onChange={(value) => {
                handleEquipmentChange(value);
                handleChange("equipmentId", value);
              }}
              placeholder="Select equipment"
              options={filteredEquipment.map((eq) => ({
                value: eq.equipmentId,
                label: `${eq.equipmentName} (${eq.serialNumber})`,
              }))}
              className={errors.equipmentId ? "border-red-500" : ""}
            />
            {errors.equipmentId && (
              <p className="text-sm text-red-600 mt-1">{errors.equipmentId}</p>
            )}
            {selectedEquipment && (
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <p className="text-blue-900">
                  <strong>Category:</strong> {selectedEquipment.category?.categoryName}
                </p>
                <p className="text-blue-900">
                  <strong>Team:</strong> {selectedEquipment.maintenanceTeam?.teamName}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Priority *
              </label>
              <Select
                value={formData.priority}
                onChange={(value) => handleChange("priority", value)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
                className={errors.priority ? "border-red-500" : ""}
              />
              {errors.priority && (
                <p className="text-sm text-red-600 mt-1">{errors.priority}</p>
              )}
            </div>

            {/* Request Type */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Type *
              </label>
              <Select
                value={formData.requestType}
                onChange={(value) => handleChange("requestType", value)}
                options={[
                  { value: "corrective", label: "Corrective" },
                  { value: "preventive", label: "Preventive" },
                ]}
                className={errors.requestType ? "border-red-500" : ""}
              />
              {errors.requestType && (
                <p className="text-sm text-red-600 mt-1">{errors.requestType}</p>
              )}
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scheduled Date
              </label>
              <Input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => handleChange("scheduledDate", e.target.value)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/requests")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading
                ? "Saving..."
                : initialData
                ? "Update Request"
                : "Create Request"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
