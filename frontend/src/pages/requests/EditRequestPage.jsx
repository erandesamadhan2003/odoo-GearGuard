import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { RequestForm } from "@/components/requests/RequestForm";
import { useRequest } from "@/hooks/useRequest";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const EditRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedRequest, loading, getRequestById } = useRequest();

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/requests/${id}`)}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-900">Edit Request</h1>
        </div>
        <RequestForm initialData={selectedRequest} />
      </div>
    </DashboardLayout>
  );
};
