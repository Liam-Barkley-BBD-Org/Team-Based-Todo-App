/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit3, Save, X, Clock, User, Calendar, Flag, Trash2, Loader2, Tag } from "lucide-react"
import { PureAvatar } from "../components/pure-avatar"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureAlertModal } from "../components/pure-modal"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiService } from "../api/apiService"
import type { Todo, TeamMembership, UpdateTodoPayload } from "../type/api.types"
import { AppLoader } from "../components/app-loader"

// Types
const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };
  return { toastMessage, showToast };
};

export default function TaskDetailPage() {
  // --- Hooks and State ---
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toastMessage, showToast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Todo | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: task, isLoading: isLoadingTask, isError: isErrorTask } = useQuery<Todo, AxiosError>({
    queryKey: ['todo', taskId],
    queryFn: () => apiService.todos.getTodoById(parseInt(taskId!, 10)),
    enabled: !!taskId,
  });

  const { data: teamMembers } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['teamMembers', task?.team.name],
    queryFn: () => apiService.teams.getUsersInTeam(task!.team.name),
    enabled: !!task?.team.name,
  });
  // --- API Mutations ---
  const updateTaskMutation = useMutation<Todo, AxiosError, { payload: UpdateTodoPayload }>({
    mutationFn: ({ payload }) => apiService.todos.updateTodo(task!.id, payload),
    onSuccess: (updatedData) => {
      showToast("Task updated successfully!");
      queryClient.setQueryData(['todo', taskId], updatedData);
      queryClient.invalidateQueries({ queryKey: ['teamTodos', updatedData.team.name] });
      setIsEditing(false);
    },
    onError: (error) => showToast(`Update failed: ${error.message}`, 5000),
  });

  const deleteTaskMutation = useMutation<void, AxiosError>({
    mutationFn: () => apiService.todos.deleteTodo(task!.id),
    onSuccess: () => {
      showToast("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ['teamTodos', task?.team.name] });
      navigate(`/team-details/${task?.team.name}`);
    },
    onError: (error) => showToast(`Delete failed: ${error.message}`, 5000),
  });

  useEffect(() => {
    if (task) setEditedTask(task);
  }, [task]);

  // --- Event Handlers ---
  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => { setEditedTask(task || null); setIsEditing(false); };
  const handleSave = () => {
    if (!editedTask) return;
    const payload: UpdateTodoPayload = {
      title: editedTask.title,
      description: editedTask.description,
      is_open: editedTask.is_open,
      assigned_to_username: editedTask.assigned_to_user?.username,
    };
    updateTaskMutation.mutate({ payload });
  };
  const handleDeleteConfirm = () => deleteTaskMutation.mutate();
  const handleFieldChange = (field: keyof UpdateTodoPayload, value: any) => {
    setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
  };

  // --- UI Helpers & Styles ---
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const getStatusColor = (isOpen: boolean) => isOpen ? { backgroundColor: "#f3f4f6", color: "#6b7280" } : { backgroundColor: "#dcfce7", color: "#166534" };

  const headerStyle: React.CSSProperties = { display: "flex", height: "64px", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #e5e7eb", padding: "0 16px" };
  const backButtonStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", fontSize: "14px", color: "#374151", backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer", textDecoration: "none", transition: "background-color 0.2s ease" };
  const mainStyle: React.CSSProperties = { flex: 1, padding: "24px", display: "flex", gap: "24px" };
  const leftColumnStyle: React.CSSProperties = { flex: 2, display: "flex", flexDirection: "column", gap: "24px" };
  const rightColumnStyle: React.CSSProperties = { flex: 1, display: "flex", flexDirection: "column", gap: "24px" };
  const titleStyle: React.CSSProperties = { fontSize: "28px", fontWeight: "bold", color: "#111827", margin: 0, lineHeight: "1.2" };
  const metaRowStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", margin: "16px 0" };
  const metaItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: "#6b7280" };
  const descriptionStyle: React.CSSProperties = { fontSize: "16px", lineHeight: "1.6", color: "#374151", whiteSpace: "pre-wrap", margin: 0 };
  const sidebarSectionStyle: React.CSSProperties = { marginBottom: "16px" };
  const sidebarLabelStyle: React.CSSProperties = { fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px", display: "block" };
  const editFormStyle: React.CSSProperties = { display: "flex", flexDirection: "column", gap: "16px" };
  const buttonGroupStyle: React.CSSProperties = { display: "flex", gap: "8px" };
  const toastStyle: React.CSSProperties = { position: "fixed", top: "20px", right: "20px", backgroundColor: "#111827", color: "white", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000, opacity: toastMessage ? 1 : 0, transform: toastMessage ? "translateY(0)" : "translateY(-20px)", transition: "all 0.3s ease" };

  // --- Render Logic ---
  if (isLoadingTask) {
    return <PureSidebar><div style={{ padding: '2rem', textAlign: 'center' }}><AppLoader /> </div></PureSidebar>;
  }
  if (isErrorTask || !task || !editedTask) {
    return <PureSidebar><div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>Task not found or failed to load.</div></PureSidebar>;
  }

  const assigneeOptions = [{ value: '', label: 'Unassigned' }, ...(teamMembers?.map(m => ({ value: m.user.username, label: m.user.username })) || [])];
  const statusOptions = [{ value: 'open', label: 'Open' }, { value: 'completed', label: 'Completed' }];

  return (
    <PureSidebar>
      <div style={toastStyle}>{toastMessage}</div>
      <header style={headerStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}><ArrowLeft size={16} /> Back</button>
        <div style={buttonGroupStyle}>
          {!isEditing ? (
            <>
              <PureButton variant="outline" onClick={handleEdit}><Edit3 size={16} /> Edit</PureButton>
              <PureButton variant="secondary" onClick={() => setDeleteDialogOpen(true)}><Trash2 size={16} /> Delete</PureButton>
            </>
          ) : (
            <>
              <PureButton variant="outline" onClick={handleCancel}><X size={16} /> Cancel</PureButton>
              <PureButton onClick={handleSave} disabled={updateTaskMutation.isPending}>
                {updateTaskMutation.isPending ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
                <span style={{ marginLeft: '8px' }}>Save Changes</span>
              </PureButton>
            </>
          )}
        </div>
      </header>
      <main style={mainStyle}>
        <div style={leftColumnStyle}>
          <PureCard>
            <CardContent>
              {!isEditing ? (
                <>
                  <h1 style={titleStyle}>{task.title}</h1>
                  <div style={metaRowStyle}>
                    <div style={metaItemStyle}><User size={16} /><span>Created by {task.created_by_user.username}</span></div>
                    <div style={metaItemStyle}><Clock size={16} /><span>Created on {formatDate(task.created_at)}</span></div>
                  </div>
                  <p style={descriptionStyle}>{task.description}</p>
                </>
              ) : (
                <div style={editFormStyle}>
                  <div>
                    <label style={sidebarLabelStyle}>Title</label>
                    <PureInput value={editedTask.title} onChange={(e) => handleFieldChange("title", e.target.value)} />
                  </div>
                  <div>
                    <label style={sidebarLabelStyle}>Description</label>
                    <PureTextarea value={editedTask.description} onChange={(e) => handleFieldChange("description", e.target.value)} rows={8} />
                  </div>
                </div>
              )}
            </CardContent>
          </PureCard>
        </div>
        <div style={rightColumnStyle}>
          <PureCard>
            <CardContent>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Properties</h3>
              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Status</label>
                {isEditing ? (
                  <PureSelect value={editedTask.is_open ? 'open' : 'completed'} onValueChange={(v) => handleFieldChange('is_open', v === 'open')} options={statusOptions} />
                ) : (
                  <PureBadge style={getStatusColor(task.is_open)}>{task.is_open ? 'Open' : 'Completed'}</PureBadge>
                )}
              </div>
              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Assignee</label>
                {isEditing ? (
                  <PureSelect
                    value={editedTask.assigned_to_user?.username || ''}
                    onValueChange={(v) => handleFieldChange('assigned_to_username', v || null)}
                    options={[{ value: '', label: 'Unassigned' }, ...(teamMembers?.map(m => ({ value: m.user.username, label: m.user.username })) || [])]}
                  />) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {task.assigned_to_user ? <><PureAvatar fallback={task.assigned_to_user.username.charAt(0).toUpperCase()} size={24} /><span>{task.assigned_to_user.username}</span></> : <span>Unassigned</span>}                  </div>
                )}
              </div>
              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Team</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Tag size={16} /><span style={{ fontSize: "14px", color: "#374151" }}>{task.team.name}</span></div>
              </div>
            </CardContent>
          </PureCard>
        </div>
      </main>
      <PureAlertModal isOpen={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} title="Delete Task" description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`} confirmText="Delete" cancelText="Cancel" isDestructive={true} isConfirming={deleteTaskMutation.isPending} />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </PureSidebar>
  );
}