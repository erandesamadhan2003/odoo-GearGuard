import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useTeams } from "@/hooks/useTeams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ArrowLeft, Users, Mail, User } from "lucide-react";

export const TeamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedTeam, teamMembers, loading, getTeamById } = useTeams();

  useEffect(() => {
    if (id) {
      getTeamById(id);
    }
  }, [id]);

  if (loading || !selectedTeam) {
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
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/teams")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                {selectedTeam.teamName}
              </h1>
              {selectedTeam.description && (
                <p className="text-slate-600 mt-1">
                  {selectedTeam.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Members ({teamMembers?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers && teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.userId}
                    className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                        {member.fullName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900 truncate">
                          {member.fullName}
                        </p>
                        <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {member.email}
                        </p>
                        <Badge className="mt-1 capitalize">{member.role}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p>No members in this team</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

