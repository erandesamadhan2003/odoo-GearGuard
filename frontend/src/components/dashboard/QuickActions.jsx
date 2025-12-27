import { Button } from "@/components/ui/button";
import { Plus, Wrench } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { canManageEquipment } from "@/utils/roles";

export const QuickActions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex gap-3 flex-wrap">
      <Button
        onClick={() => navigate("/requests/new")}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Create Request
      </Button>
      {canManageEquipment(user) && (
        <Button
          onClick={() => navigate("/equipment/new")}
          variant="outline"
          className="border-slate-300"
        >
          <Wrench className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      )}
    </div>
  );
};

