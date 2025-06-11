"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Plus, ArrowLeft, FileText, Save, Loader2 } from "lucide-react"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureLabel, PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiService } from "../api/apiService"
import { useAuth } from "../hooks/useAuth"
import type { TeamMembership, NewTodoPayload } from "../type/api.types"


const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };
  return { toastMessage, showToast };
};

interface TaskFormData {
  title: string;
  description: string;
  teamname: string;
  assigned_to_username: string | null;
}

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { toastMessage, showToast } = useToast();

  const preselectedTeam = location.state?.teamName || "";

  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    teamname: preselectedTeam,
    assigned_to_username: null,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskFormData, string>>>({});

  const { data: userMemberships } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['userTeams', user?.username],
    queryFn: () => apiService.users.getTeamsForUser(user!.username),
    enabled: !!user,
  });

  const { data: teamMembers, isLoading: isLoadingTeamMembers } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['teamMembers', formData.teamname],
    queryFn: () => apiService.teams.getUsersInTeam(formData.teamname),
    enabled: !!formData.teamname,
  });

  const createTaskMutation = useMutation<any, AxiosError<{ message: string }>, NewTodoPayload>({
    mutationFn: apiService.todos.createTodo,
    onSuccess: (data) => {
      showToast(`Task "${data.title}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: ['teamTodos', data.teamname] });
      queryClient.invalidateQueries({ queryKey: ['todos', user?.username] });
      navigate(`/team-details/${data.teamname}`);
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Failed to create task.";
      showToast(message, 5000);
    }
  });

  const handleInputChange = (field: keyof TaskFormData, value: string | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof TaskFormData, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.teamname) newErrors.teamname = "Please select a team";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !user?.username) return;
    const payload: NewTodoPayload = {
      ...formData,
      created_at: new Date().toISOString(),
      created_by_username: user.username,
    };
    createTaskMutation.mutate(payload);
  };

  // --- Dynamic Dropdown Options ---
  const teamOptions = useMemo(() => userMemberships?.map(m => ({ value: m.team.name, label: m.team.name })) || [], [userMemberships]);
  const assigneeOptions = useMemo(() => {
    if (isLoadingTeamMembers) return [{ value: '', label: "Loading..." }];
    if (!teamMembers) return [{ value: '', label: "Select a team first" }];
    return [{ value: '', label: "Unassigned" }, ...teamMembers.map(m => ({ value: m.user.username, label: m.user.username }))];
  }, [teamMembers, isLoadingTeamMembers]);

  // --- Style Definitions ---
  const headerStyle: React.CSSProperties = { display: "flex", height: "64px", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "0 16px" };
  const backButtonStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", fontSize: "14px", color: "#374151", backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer", textDecoration: "none", transition: "background-color 0.2s ease" };
  const mainStyle: React.CSSProperties = { flex: 1, padding: "24px" };
  const containerStyle: React.CSSProperties = { maxWidth: "768px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" };
  const headerTextStyle: React.CSSProperties = { textAlign: "center", marginBottom: "24px" };
  const titleStyle: React.CSSProperties = { fontSize: "30px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" };
  const subtitleStyle: React.CSSProperties = { fontSize: "16px", color: "#6b7280", margin: 0 };
  const formStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "24px" };
  const formGroupStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "8px" };
  const gridStyle: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };
  const errorStyle: React.CSSProperties = { fontSize: "14px", color: "#dc2626", marginTop: "4px" };
  const buttonContainerStyle: React.CSSProperties = { display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "16px" };
  const toastStyle: React.CSSProperties = { position: "fixed", top: "20px", right: "20px", backgroundColor: "#111827", color: "white", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000, opacity: toastMessage ? 1 : 0, transform: toastMessage ? "translateY(0)" : "translateY(-20px)", transition: "all 0.3s ease" };

  return (
    <PureSidebar>
      <div style={toastStyle}>{toastMessage}</div>
      <header style={headerStyle}>
        <Link to={-1 as unknown as string} style={backButtonStyle}>
          <ArrowLeft size={16} /> Back
        </Link>
      </header>
      <main style={mainStyle}>
        <div style={containerStyle}>
          <div style={headerTextStyle}>
            <h1 style={titleStyle}>Create New Task</h1>
            <p style={subtitleStyle}>Fill in the details below to create a new task for your team.</p>
          </div>
          <form onSubmit={handleSubmit} style={formStyle} noValidate>
            <PureCard>
              <CardContent>
                <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={20} /> Task Details
                </h2>
                <div style={formGroupStyle}>
                  <PureLabel htmlFor="title">Task Title *</PureLabel>
                  <PureInput id="title" placeholder="e.g., Design new marketing banner" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} style={{ borderColor: errors.title ? '#dc2626' : undefined }} />
                  {errors.title && <div style={errorStyle}>{errors.title}</div>}
                </div>
                <div style={formGroupStyle}>
                  <PureLabel htmlFor="description">Description *</PureLabel>
                  <PureTextarea id="description" placeholder="Provide details about the task..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} style={{ borderColor: errors.description ? '#dc2626' : undefined }} />
                  {errors.description && <div style={errorStyle}>{errors.description}</div>}
                </div>
                <div style={gridStyle}>
                  <div style={formGroupStyle}>
                    <PureLabel>Team *</PureLabel>
                    <PureSelect value={formData.teamname} onValueChange={(v) => handleInputChange("teamname", v)} options={teamOptions} placeholder="Select team" style={{ borderColor: errors.teamname ? '#dc2626' : undefined }} />
                    {errors.teamname && <div style={errorStyle}>{errors.teamname}</div>}
                  </div>
                  <div style={formGroupStyle}>
                    <PureLabel>Assignee</PureLabel>
                    <PureSelect value={formData.assigned_to_username || ''} onValueChange={(v) => handleInputChange("assigned_to_username", v || null)} options={assigneeOptions} placeholder="Select assignee" disabled={isLoadingTeamMembers || !formData.teamname} />
                  </div>
                </div>
              </CardContent>
            </PureCard>
            <div style={buttonContainerStyle}>
              <PureButton type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</PureButton>
              <PureButton type="submit" disabled={createTaskMutation.isPending} style={{ minWidth: "140px" }}>
                {createTaskMutation.isPending ? (<Loader2 size={16} style={{ marginRight: '8px', animation: "spin 1s linear infinite" }} />) : (<Save size={16} style={{ marginRight: "8px" }} />)}
                {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
              </PureButton>
            </div>
          </form>
        </div>
      </main>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </PureSidebar>
  );
}