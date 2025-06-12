/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "../styles/TaskDetailPage.css";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Edit3,
  Save,
  X,
  Clock,
  User,
  Calendar,
  Flag,
  Trash2,
  Loader2,
  Tag,
} from "lucide-react";
import { PureAvatar } from "../components/pure-avatar";
import { PureBadge } from "../components/pure-badge";
import { PureButton } from "../components/pure-button";
import { PureCard, CardContent } from "../components/pure-card";
import { PureTextarea } from "../components/pure-form";
import { PureInput } from "../components/pure-input";
import { PureAlertModal } from "../components/pure-modal";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { apiService } from "../api/apiService";
import type {
  Todo,
  TeamMembership,
  UpdateTodoPayload,
} from "../type/api.types";
import { AppLoader } from "../components/app-loader";

const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };
  return { toastMessage, showToast };
};

export default function TaskDetailPage() {
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
    queryKey: ['teamMembers', "teamName"],
    queryFn: () => apiService.teams.getUsersInTeam(task?.team.name ?? ''),
    enabled: !!task,
  });

  // --- API Mutations ---
  const updateTaskMutation = useMutation<Todo, AxiosError, { payload: UpdateTodoPayload }>({
    mutationFn: ({ payload }) => apiService.todos.updateTodo(task!.id, payload),
    onSuccess: (updatedData) => {
      showToast("Task updated successfully!");
      queryClient.setQueryData(['todo', taskId], {...task, ...updatedData});
      setIsEditing(false);
    },
    onError: (error) => showToast(`Update failed: ${error.message}`, 5000),
  });

  const deleteTaskMutation = useMutation<void, AxiosError>({
    mutationFn: () => apiService.todos.deleteTodo(task!.id),
    onSuccess: () => {
      showToast("Task deleted successfully!");
      if (task) {
        queryClient.invalidateQueries({ queryKey: ['teamTodos', task.team.name] });
        navigate(`/team-details/${task.team.name}`);
      } else {
        navigate('/dashboard');
      }
    },
    onError: (error) => showToast(`Delete failed: ${error.message}`, 5000),
  });

  useEffect(() => { if (task) setEditedTask(task); }, [task]);

  // --- Event Handlers ---
  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => { setEditedTask(task || null); setIsEditing(false); };

  const handleSave = () => {
    if (!editedTask) return;
    const payload: UpdateTodoPayload = {
      title: editedTask.title, description: editedTask.description, is_open: editedTask.is_open,
      assigned_to_username: editedTask.assigned_to_user?.username || null,
    };
    updateTaskMutation.mutate({ payload });
  };
  const handleDeleteConfirm = () => deleteTaskMutation.mutate();

  const handleFieldChange = (field: keyof UpdateTodoPayload, value: any) => {
    if (field === 'assigned_to_username') {
      const selectedUser = teamMembers?.find(m => m.user.username === value)?.user || null;
      setEditedTask(prev => prev ? { ...prev, assigned_to_user: selectedUser } : null);
    } else {
      setEditedTask(prev => prev ? { ...prev, [field]: value } : null);
    }
  };
  const isTaskCompleted = task ? !task.is_open : false;

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const getStatusColor = (isOpen: boolean) => isOpen ? { backgroundColor: "#f3f4f6", color: "#6b7280" } : { backgroundColor: "#dcfce7", color: "#166534" };

  if (isLoadingTask) {
    return (
      <PureSidebar>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <AppLoader />{" "}
        </div>
      </PureSidebar>
    );
  }
  if (isErrorTask || !task || !editedTask) {
    return (
      <PureSidebar>
        <div style={{ padding: "2rem", textAlign: "center", color: "#dc2626" }}>
          Task not found or failed to load.
        </div>
      </PureSidebar>
    );
  }

  const assigneeOptions = [
    { value: "", label: "Unassigned" },
    ...(teamMembers?.map((m) => ({
      value: m.user.username,
      label: m.user.username,
    })) || []),
  ];
  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "completed", label: "Completed" },
  ];

  return (
    <PureSidebar>
      <div
        className={`task-detail-toast ${toastMessage ? "task-detail-toast--visible" : ""
          }`}
      >
        {toastMessage}
      </div>

      <div className="task-detail-page-wrapper">
        <header className="task-detail-header">
          <button
            onClick={() => navigate(-1)}
            className="task-detail-back-button"
          >
            <ArrowLeft size={16} /> Back
          </button>
          <div className="task-detail-header__actions">
            {!isEditing ? (
              <>
                {!isTaskCompleted && (
                  <PureButton variant="outline" onClick={handleEdit}>
                    <Edit3 size={16} /> Edit
                  </PureButton>
                )}

                {
                  !isTaskCompleted && (
                    <PureButton
                      variant="primary"
                      onClick={() => setDeleteDialogOpen(true)}
                      disabled={isTaskCompleted}
                    >
                      <Trash2 size={16} /> Delete
                    </PureButton>
                  )
                }
              </>
            ) : (
              <>
                <PureButton variant="outline" onClick={handleCancel}><X size={16} /> Cancel</PureButton>
                <PureButton onClick={handleSave} disabled={updateTaskMutation.isPending}>
                  {updateTaskMutation.isPending ? <Loader2 className="animate-spin" /> : <Save size={16} />} Save Changes
                </PureButton>
              </>
            )}
          </div>
        </header>

        <main className="task-detail-main">
          <article className="task-detail-content">
            <PureCard>
              <CardContent>
                {!isEditing ? (
                  <section aria-labelledby="task-title">
                    <h1 id="task-title" className="task-detail-content__title">
                      {task.title}
                    </h1>
                    <div className="task-detail-content__meta-row">
                      <span className="task-detail-content__meta-item">
                        <User size={16} /> Created by{" "}
                        {task.created_by_user.username}
                      </span>
                      <span className="task-detail-content__meta-item">
                        <Clock size={16} /> Created on{" "}
                        {formatDate(task.created_at)}
                      </span>
                    </div>
                    <p className="task-detail-content__description">
                      {task.description}
                    </p>
                  </section>
                ) : (
                  <form className="task-detail-edit-form">
                    <section>
                      <label className="task-detail-sidebar__label">
                        Title
                      </label>
                      <PureInput
                        value={editedTask.title}
                        onChange={(e) =>
                          handleFieldChange("title", e.target.value)
                        }
                      />
                    </section>
                    <section>
                      <label className="task-detail-sidebar__label">
                        Description
                      </label>
                      <PureTextarea
                        value={editedTask.description}
                        onChange={(e) =>
                          handleFieldChange("description", e.target.value)
                        }
                        rows={8}
                      />
                    </section>
                  </form>
                )}
              </CardContent>
            </PureCard>
          </article>

          <aside className="task-detail-sidebar">
            <PureCard>
              <CardContent>
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "16px",
                  }}
                >
                  Properties
                </h3>
                <section className="task-detail-sidebar__section">
                  <label className="task-detail-sidebar__label">Status</label>
                  {isEditing ? (
                    <PureSelect
                      value={editedTask.is_open ? "open" : "completed"}
                      onValueChange={(v) =>
                        handleFieldChange("is_open", v === "open")
                      }
                      options={statusOptions}
                    />
                  ) : (
                    <PureBadge style={getStatusColor(task.is_open)}>
                      {task.is_open ? "Open" : "Completed"}
                    </PureBadge>
                  )}
                </section>
                <section className="task-detail-sidebar__section">
                  <label className="task-detail-sidebar__label">Assignee</label>
                  {isEditing ? (
                    <PureSelect
                      value={editedTask.assigned_to_user?.username || ""}
                      onValueChange={(v) =>
                        handleFieldChange(
                          "assigned_to_username",
                          v === "" ? null : v
                        )
                      }
                      options={assigneeOptions}
                    />
                  ) : (
                    <div className="task-detail-sidebar__value--flex">
                      {task.assigned_to_user ? (
                        <>
                          <PureAvatar
                            fallback={task.assigned_to_user.username
                              .charAt(0)
                              .toUpperCase()}
                            size={24}
                          />
                          <span>{task.assigned_to_user.username}</span>
                        </>
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </div>
                  )}
                </section>
                <section className="task-detail-sidebar__section">
                  <label className="task-detail-sidebar__label">Team</label>
                  <div className="task-detail-sidebar__value--flex">
                    <Tag size={16} />
                    <span>{task.team.name}</span>
                  </div>
                </section>
              </CardContent>
            </PureCard>
          </aside>
        </main>
      </div>

      <PureAlertModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
        isConfirming={deleteTaskMutation.isPending}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </PureSidebar>
  );
}
