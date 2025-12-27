import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useProjects, Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Helmet } from "react-helmet-async";
import {
  LogOut,
  Plus,
  Loader2,
  FolderOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  Activity,
} from "lucide-react";
import { format } from "date-fns";

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-500" },
  in_progress: { label: "In Progress", icon: Play, color: "text-blue-500" },
  review: { label: "Under Review", icon: AlertCircle, color: "text-purple-500" },
  completed: { label: "Completed", icon: CheckCircle2, color: "text-green-500" },
  on_hold: { label: "On Hold", icon: Pause, color: "text-orange-500" },
};

const projectTypes = [
  "Website Development",
  "Web Application",
  "Mobile App",
  "Custom Software",
  "UI/UX Design",
  "API Development",
  "E-commerce",
  "Other",
];

const budgetRanges = [
  "Under ₹50,000",
  "₹50,000 - ₹1,00,000",
  "₹1,00,000 - ₹3,00,000",
  "₹3,00,000 - ₹5,00,000",
  "₹5,00,000+",
  "Let's discuss",
];

const timelines = [
  "Less than 2 weeks",
  "2-4 weeks",
  "1-2 months",
  "2-3 months",
  "3+ months",
  "Flexible",
];

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { projects, activityLogs, loading: projectsLoading, createProject } = useProjects();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [timeline, setTimeline] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectType) return;

    setCreating(true);
    const { error } = await createProject({
      title,
      description,
      project_type: projectType,
      budget_range: budgetRange || undefined,
      timeline: timeline || undefined,
    });

    if (!error) {
      setIsDialogOpen(false);
      setTitle("");
      setDescription("");
      setProjectType("");
      setBudgetRange("");
      setTimeline("");
    }
    setCreating(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "pending").length,
    inProgress: projects.filter((p) => p.status === "in_progress").length,
    completed: projects.filter((p) => p.status === "completed").length,
  };

  return (
    <>
      <Helmet>
        <title>Client Dashboard - CodeFyre</title>
        <meta name="description" content="Manage your projects with CodeFyre" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gradient">CodeFyre</h1>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Client Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden md:block">
                {user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              Welcome back, <span className="text-gradient">{user.user_metadata?.full_name || "Client"}</span>
            </h2>
            <p className="text-muted-foreground">
              Manage your projects and track their progress in real-time.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Projects</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Play className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Your Projects</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>
                        Tell us about your project and we'll get back to you within 24 hours.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                          id="title"
                          placeholder="e.g., E-commerce Website"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Project Type *</Label>
                        <Select value={projectType} onValueChange={setProjectType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Tell us about your project requirements..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="budget">Budget Range</Label>
                          <Select value={budgetRange} onValueChange={setBudgetRange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select budget" />
                            </SelectTrigger>
                            <SelectContent>
                              {budgetRanges.map((range) => (
                                <SelectItem key={range} value={range}>
                                  {range}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timeline">Timeline</Label>
                          <Select value={timeline} onValueChange={setTimeline}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                            <SelectContent>
                              {timelines.map((t) => (
                                <SelectItem key={t} value={t}>
                                  {t}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={creating || !title || !projectType}
                      >
                        {creating ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : null}
                        Submit Project Request
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {projectsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-12 text-center">
                  <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h4 className="text-lg font-semibold mb-2">No projects yet</h4>
                  <p className="text-muted-foreground mb-6">
                    Start your first project and we'll bring your vision to life.
                  </p>
                  <Button variant="hero" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div>
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Activity
              </h3>
              <div className="bg-card border border-border rounded-xl p-4">
                {activityLogs.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No activity yet. Create a project to get started!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {activityLogs.slice(0, 10).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div>
                          <p className="font-medium">{log.action}</p>
                          {log.details && (
                            <p className="text-muted-foreground">{log.details}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(log.created_at), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const config = statusConfig[project.status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="text-lg font-semibold mb-1">{project.title}</h4>
          <p className="text-sm text-muted-foreground">{project.project_type}</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm ${config.color}`}>
          <StatusIcon className="w-4 h-4" />
          {config.label}
        </div>
      </div>

      {project.description && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        {project.budget_range && (
          <span>Budget: {project.budget_range}</span>
        )}
        {project.timeline && (
          <span>Timeline: {project.timeline}</span>
        )}
        <span>Created: {format(new Date(project.created_at), "MMM d, yyyy")}</span>
      </div>

      {project.progress !== null && project.progress > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span>Progress</span>
            <span className="text-primary">{project.progress}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
