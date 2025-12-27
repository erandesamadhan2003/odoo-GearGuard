import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useEquipment } from "@/hooks/useEquipment";
import { useDepartment } from "@/hooks/useDepartment";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { SearchBar } from "@/components/common/SearchBar";
import { Select } from "@/components/common/Select";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Plus, Cpu, User, Building2 } from "lucide-react";
import { useNavigate } from "react-router";

const getStatusVariant = (status) => {
  const map = {
    active: "success",
    under_maintenance: "warning",
    scrapped: "danger",
  };
  return map[status] || "default";
};

export const EquipmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    equipment,
    equipmentLoading,
    getAllEquipment,
    getAllCategories,
    categories,
  } = useEquipment();
  const { departments, getAllDepartments } = useDepartment();
  const isAdmin = user?.role === "admin" || user?.role === "manager";

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    getAllEquipment();
    getAllCategories();
    getAllDepartments();
  }, []);

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch =
      item.equipmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !departmentFilter || item.departmentId === parseInt(departmentFilter);
    const matchesCategory = !categoryFilter || item.categoryId === parseInt(categoryFilter);
    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesDepartment && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Equipment</h1>
            <p className="text-slate-600 mt-1">
              Manage and track all equipment
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate("/equipment/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
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
                placeholder="Search equipment..."
              />
              <Select
                value={departmentFilter}
                onChange={setDepartmentFilter}
                placeholder="All Departments"
                options={departments.map((dept) => ({
                  value: dept.departmentId,
                  label: dept.departmentName,
                }))}
              />
              <Select
                value={categoryFilter}
                onChange={setCategoryFilter}
                placeholder="All Categories"
                options={categories.map((cat) => ({
                  value: cat.categoryId,
                  label: cat.categoryName,
                }))}
              />
              <Select
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="All Status"
                options={[
                  { value: "active", label: "Active" },
                  { value: "under_maintenance", label: "Under Maintenance" },
                  { value: "scrapped", label: "Scrapped" },
                ]}
              />
            </div>
          </CardContent>
        </Card>

        {/* Equipment List */}
        {equipmentLoading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredEquipment.length === 0 ? (
          <EmptyState
            icon={Cpu}
            title="No equipment found"
            description={
              searchTerm || departmentFilter || categoryFilter || statusFilter
                ? "Try adjusting your filters"
                : "Get started by adding your first equipment"
            }
            action={
              isAdmin && (
                <Button
                  onClick={() => navigate("/equipment/new")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Add Equipment
                </Button>
              )
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEquipment.map((item) => (
              <Card
                key={item.equipmentId}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/equipment/${item.equipmentId}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">
                        {item.equipmentName}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {item.serialNumber}
                      </p>
                    </div>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status?.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    {item.category && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Cpu className="w-4 h-4" />
                        <span>{item.category.categoryName}</span>
                      </div>
                    )}
                    {item.department && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 className="w-4 h-4" />
                        <span>{item.department.departmentName}</span>
                      </div>
                    )}
                    {item.assignedUser && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <User className="w-4 h-4" />
                        <span>{item.assignedUser.fullName}</span>
                      </div>
                    )}
                  </div>

                  {item.location && (
                    <p className="text-sm text-slate-500 mt-3">
                      📍 {item.location}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

