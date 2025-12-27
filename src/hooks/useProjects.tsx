import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "@/hooks/use-toast";

export interface Project {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  project_type: string;
  budget_range: string | null;
  timeline: string | null;
  status: "pending" | "in_progress" | "review" | "completed" | "on_hold";
  priority: string | null;
  progress: number | null;
  start_date: string | null;
  estimated_completion: string | null;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string;
  user_id: string;
  action: string;
  details: string | null;
  created_at: string;
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProjects = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
      toast({
        title: "Error",
        description: "Failed to fetch projects",
        variant: "destructive",
      });
    } else {
      setProjects(data as Project[]);
    }
    setLoading(false);
  };

  const fetchActivityLogs = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching activity logs:", error);
    } else {
      setActivityLogs(data as ActivityLog[]);
    }
  };

  const createProject = async (projectData: {
    title: string;
    description: string;
    project_type: string;
    budget_range?: string;
    timeline?: string;
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("projects")
      .insert({
        ...projectData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
      return { error };
    }

    // Add activity log
    await supabase.from("activity_logs").insert({
      project_id: data.id,
      user_id: user.id,
      action: "Project Created",
      details: `Created project "${projectData.title}"`,
    });

    toast({
      title: "Success",
      description: "Project created successfully",
    });

    return { data, error: null };
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchActivityLogs();

      // Set up realtime subscription for projects
      const projectsChannel = supabase
        .channel("projects-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "projects",
          },
          () => {
            fetchProjects();
          }
        )
        .subscribe();

      // Set up realtime subscription for activity logs
      const logsChannel = supabase
        .channel("logs-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "activity_logs",
          },
          () => {
            fetchActivityLogs();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(projectsChannel);
        supabase.removeChannel(logsChannel);
      };
    }
  }, [user]);

  return {
    projects,
    activityLogs,
    loading,
    createProject,
    refetch: fetchProjects,
  };
};
