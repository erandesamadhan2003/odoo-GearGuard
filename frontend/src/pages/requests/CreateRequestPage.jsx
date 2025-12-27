import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { RequestForm } from "@/components/requests/RequestForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { isAdminOrManager, isOperator } from "@/utils/roles";
import { Navigate } from "react-router";

export const CreateRequestPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const equipmentId = searchParams.get("equipmentId");

  // Only Admin, Manager, and Operator can create requests per matrix (Technician cannot)
  if (!isAdminOrManager(user) && !isOperator(user)) {
    return <Navigate to="/requests" replace />;
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/requests")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">
            Create Maintenance Request
          </h1>
        </div>
        <RequestForm equipmentId={equipmentId} />
      </div>
    </DashboardLayout>
  );
};