import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/common/Card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const OverdueAlert = ({ count = 0 }) => {
  const navigate = useNavigate();

  if (count === 0) return null;

  return (
    <Card className="bg-red-50 border-red-200 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-900">
                {count} Overdue {count === 1 ? "Request" : "Requests"}
              </p>
              <p className="text-sm text-red-700">
                These requests need immediate attention
              </p>
            </div>
          </div>
          <Button
            onClick={() => navigate("/requests?filter=overdue")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

