import { useEffect } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useDepartment } from "@/hooks/useDepartment";
import { Card, CardContent } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Building2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const DepartmentsPage = () => {
  const { departments, loading, getAllDepartments } = useDepartment();

  useEffect(() => {
    getAllDepartments();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Departments</h1>
            <p className="text-slate-600 mt-1">Manage departments</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Department
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : departments.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No departments found"
            description="Create your first department"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => (
              <Card key={dept.departmentId}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {dept.departmentName}
                  </h3>
                  {dept.description && (
                    <p className="text-sm text-slate-600">{dept.description}</p>
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

