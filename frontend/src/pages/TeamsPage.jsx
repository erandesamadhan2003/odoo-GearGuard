import { useEffect } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useTeams } from "@/hooks/useTeams";
import { Card, CardContent } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

export const TeamsPage = () => {
  const navigate = useNavigate();
  const { teams, loading, getAllTeams } = useTeams();

  useEffect(() => {
    getAllTeams();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
            <p className="text-slate-600 mt-1">Manage maintenance teams</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Team
          </Button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <LoadingSpinner size="lg" />
          </div>
        ) : teams.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No teams found"
            description="Create your first maintenance team"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Card
                key={team.teamId}
                className="cursor-pointer hover:shadow-lg transition-all"
                onClick={() => navigate(`/teams/${team.teamId}`)}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {team.teamName}
                  </h3>
                  {team.description && (
                    <p className="text-sm text-slate-600">{team.description}</p>
                  )}
                  {team.members && (
                    <p className="text-sm text-slate-500 mt-3">
                      {team.members.length} {team.members.length === 1 ? "member" : "members"}
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

