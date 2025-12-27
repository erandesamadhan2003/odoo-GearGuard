import { useEffect, useState } from "react";
import { DashboardLayout } from "@/layouts/dashboard/DashboardLayout";
import { useTeams } from "@/hooks/useTeams";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/common/Card";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { EmptyState } from "@/components/common/EmptyState";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/common/Modal";
import { useNavigate } from "react-router";
import { canManageTeams } from "@/utils/roles";
import { Navigate } from "react-router";

export const TeamsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { teams, loading, getAllTeams, createTeam } = useTeams();

  // Only Admin/Manager can access Teams page
  if (!canManageTeams(user)) {
    return <Navigate to="/dashboard" replace />;
  }
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ teamName: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAllTeams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTeam(formData);
      setShowModal(false);
      setFormData({ teamName: "", description: "" });
      getAllTeams();
    } catch (error) {
      console.error("Create team error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
            <p className="text-slate-600 mt-1">Manage maintenance teams</p>
          </div>
          {canManageTeams(user) && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Team
            </Button>
          )}
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

        {/* Create Team Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setFormData({ teamName: "", description: "" });
          }}
          title="Create New Team"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Team Name *
              </label>
              <Input
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                placeholder="Enter team name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter team description"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowModal(false);
                  setFormData({ teamName: "", description: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {submitting ? "Creating..." : "Create Team"}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </DashboardLayout>
  );
};

