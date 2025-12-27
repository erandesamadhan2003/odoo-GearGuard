import { Button } from "@/components/ui/button";
import { Navbar } from "@/layouts/Navbar";
import {Footer } from "@/layouts/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import {
  Package,
  KanbanSquare,
  Users,
  ClipboardList,
  Wrench,
  BarChart3,
  User,
  Activity,
  Clock,
  Zap,
} from "lucide-react";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <Navbar />

      <div className="container mx-auto px-4 py-16">
        {/* ================= HERO SECTION ================= */}
        <section className="text-center mb-24">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-blue-800">
              GearGuard
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            A smart maintenance management system to track equipment, manage
            teams, and streamline repair workflows — all in one place.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            {!isAuthenticated ? (
              <>
                <Button
                  size="lg"
                  onClick={() => navigate("/signup")}
                  className="px-8 py-6 text-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="px-8 py-6 text-lg border-slate-300 text-slate-700 hover:bg-slate-100"
                >
                  Sign In
                </Button>
              </>
            ) : (
              <Button
                size="lg"
                onClick={() => navigate("/dashboard")}
                className="px-8 py-6 text-lg text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="max-w-6xl mx-auto mb-24">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Centralized Equipment Tracking",
                desc: "Maintain a single source of truth for all company assets and their status.",
                icon: Package,
                color: "text-blue-600 bg-blue-100",
              },
              {
                title: "Efficient Maintenance Workflow",
                desc: "Manage corrective and preventive maintenance using Kanban-style workflows.",
                icon: KanbanSquare,
                color: "text-amber-600 bg-amber-100",
              },
              {
                title: "Team-Based Assignments",
                desc: "Assign jobs to the right maintenance teams with clear responsibility.",
                icon: Users,
                color: "text-emerald-600 bg-emerald-100",
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition"
                >
                  <div
                    className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="max-w-6xl mx-auto mb-24">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">
            How GearGuard Works
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
            {[
              {
                title: "Register Equipment",
                desc: "Add machines and assign maintenance teams.",
                icon: ClipboardList,
              },
              {
                title: "Create Request",
                desc: "Raise corrective or preventive maintenance requests.",
                icon: Package,
              },
              {
                title: "Track on Kanban",
                desc: "Move requests from New to Repaired.",
                icon: KanbanSquare,
              },
              {
                title: "Monitor & Improve",
                desc: "Use calendar and dashboards for insights.",
                icon: Activity,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-200"
                >
                  <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= WHO IS IT FOR ================= */}
        <section className="max-w-6xl mx-auto mb-24 text-center">
          <h2 className="text-3xl font-bold mb-10 text-slate-900">
            Built for Every Role
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              {
                title: "Operators",
                desc: "Quickly raise maintenance requests when equipment fails.",
                icon: User,
              },
              {
                title: "Technicians",
                desc: "Manage tasks using Kanban and scheduled calendar jobs.",
                icon: Wrench,
              },
              {
                title: "Managers",
                desc: "Track workload, overdue tasks, and team performance.",
                icon: BarChart3,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-xl border border-slate-200"
                >
                  <Icon className="w-6 h-6 mx-auto mb-3 text-blue-600" />
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="max-w-6xl mx-auto mb-24">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-slate-900">
              Built for Reliability & Scale
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <Zap className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-4xl font-bold text-blue-600 mb-2">100%</p>
                <p className="text-sm sm:text-base text-slate-600">
                  Asset Visibility
                </p>
              </div>
              <div>
                <Clock className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-4xl font-bold text-emerald-600 mb-2">24/7</p>
                <p className="text-sm sm:text-base text-slate-600">
                  Monitoring
                </p>
              </div>
              <div>
                <Activity className="w-6 h-6 mx-auto mb-2 text-amber-600" />
                <p className="text-4xl font-bold text-amber-600 mb-2">
                  Real-time
                </p>
                <p className="text-sm sm:text-base text-slate-600">
                  Status Updates
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-900">
            Ready to streamline maintenance?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Start managing assets and maintenance smarter with GearGuard.
          </p>

          {!isAuthenticated && (
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="px-10 py-6 text-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              Create Free Account
            </Button>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
};
