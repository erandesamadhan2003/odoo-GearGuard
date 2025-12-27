import { useEffect } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useEquipment } from "@/hooks/useEquipment";
import { Card, CardContent } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Tags, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CategoriesPage = () => {
  const { categories, loading, getAllCategories } = useEquipment();

  useEffect(() => {
    getAllCategories();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Categories</h1>
            <p className="text-slate-600 mt-1">Manage equipment categories</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tags}
            title="No categories found"
            description="Create your first equipment category"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card key={category.categoryId}>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {category.categoryName}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-slate-600">{category.description}</p>
                  )}
                  {category.equipmentCount !== undefined && (
                    <p className="text-sm text-slate-500 mt-3">
                      {category.equipmentCount} {category.equipmentCount === 1 ? "item" : "items"}
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

