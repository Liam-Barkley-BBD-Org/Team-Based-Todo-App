"use client";

import type React from "react";
import "../styles/CreateTaskPage.css";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ArrowLeft, FileText, Loader2, Save } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiService } from "../api/apiService";
import { PureButton } from "../components/pure-button";
import { CardContent, PureCard } from "../components/pure-card";
import { PureLabel, PureTextarea } from "../components/pure-form";
import { PureInput } from "../components/pure-input";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";
import { useAuth } from "../hooks/useAuth";
import type { NewTodoPayload, TeamMembership } from "../type/api.types";


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
      queryClient.invalidateQueries({ queryKey: ['teamTodos', formData.teamname] });
      queryClient.invalidateQueries({ queryKey: ['todos', user?.username] });
      navigate(`/team-details/${formData.teamname}`);
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

  return (
    <PureSidebar>
      <div className={`create-task-toast ${toastMessage ? 'create-task-toast--visible' : ''}`}>{toastMessage}</div>

      <div className="create-task-page-wrapper">
        <header className="create-task-header">
          <Link to={-1 as unknown as string} className="create-task-back-button">
            <ArrowLeft size={16} /> Back
          </Link>
        </header>

        <main className="create-task-main">
          <div className="create-task-container">
            <section className="create-task-intro" aria-labelledby="page-title">
              <h1 id="page-title" className="create-task-intro__title">Create New Task</h1>
              <p className="create-task-intro__subtitle">Fill in the details below to create a new task for your team.</p>
            </section>

            <form onSubmit={handleSubmit} className="create-task-form" noValidate>
              <PureCard>
                <CardContent className="">
                  <h2 className="create-task-form__card-header"><FileText size={20} /> Task Details</h2>
                  <div className="create-task-form__group">
                    <PureLabel htmlFor="title">Task Title *</PureLabel>
                    <PureInput id="title" placeholder="e.g., Design new marketing banner" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} style={{ borderColor: errors.title ? '#dc2626' : undefined }} />
                    {errors.title && <div className="create-task-form__error">{errors.title}</div>}
                  </div>
                  <div className="create-task-form__group">
                    <PureLabel htmlFor="description">Description *</PureLabel>
                    <PureTextarea id="description" placeholder="Provide details about the task..." value={formData.description} onChange={(e) => handleInputChange("description", e.target.value)} rows={4} style={{ borderColor: errors.description ? '#dc2626' : undefined }} />
                    {errors.description && <div className="create-task-form__error">{errors.description}</div>}
                  </div>
                  <div className="create-task-form__grid">
                    <div className="create-task-form__group">
                      <PureLabel>Team *</PureLabel>
                      <PureSelect value={formData.teamname} onValueChange={(v) => handleInputChange("teamname", v)} options={teamOptions} placeholder="Select team" style={{ borderColor: errors.teamname ? '#dc2626' : undefined }} />
                      {errors.teamname && <div className="create-task-form__error">{errors.teamname}</div>}
                    </div>
                    <div className="create-task-form__group">
                      <PureLabel>Assignee</PureLabel>
                      <PureSelect value={formData.assigned_to_username || ''} onValueChange={(v) => handleInputChange("assigned_to_username", v || null)} options={assigneeOptions} placeholder="Select assignee" />
                    </div>
                  </div>
                </CardContent>
              </PureCard>
              <div className="create-task-form__actions">
                <PureButton type="button" variant="outline" onClick={() => navigate(-1)}>Cancel</PureButton>
                <PureButton type="submit" disabled={createTaskMutation.isPending} style={{ minWidth: "140px" }}>
                  {createTaskMutation.isPending ? (<Loader2 size={16} className="animate-spin" style={{ marginRight: '8px' }} />) : (<Save size={16} style={{ marginRight: "8px" }} />)}
                  {createTaskMutation.isPending ? 'Creating...' : 'Create Task'}
                </PureButton>
              </div>
            </form>
          </div>
        </main>
      </div>
    </PureSidebar>
  );
}
