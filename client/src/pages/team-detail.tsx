"use client"


import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { ArrowLeft, CheckCircle, Clock, Crown, Plus, UserPlus } from "lucide-react"
import { useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { apiService } from "../api/apiService"
import { AppLoader } from "../components/app-loader"
import { PureAvatar } from "../components/pure-avatar"
import { PureButton } from "../components/pure-button"
import { CardContent, PureCard } from "../components/pure-card"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { useAuth } from "../hooks/useAuth"
import type { TeamMembership, Todo } from "../type/api.types"


const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };
  return { toastMessage, showToast };
};

export default function TeamView() {
  // --- Hooks and State ---
  const { teamName } = useParams<{ teamName: string }>();
  const navigate = useNavigate();
  useAuth();
  const { toastMessage } = useToast();

  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "completed">("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [, setSelectedTask] = useState<Todo | null>(null);
  const [, setIsTaskModalOpen] = useState(false);

  const canManageMembers = true;

  // --- Data Fetching with React Query ---
  const { data: memberships, isLoading: isLoadingMembers } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['teamMembers', teamName],
    queryFn: () => apiService.teams.getUsersInTeam(teamName!),
    enabled: !!teamName,
  });

  const { data: todos, isLoading: isLoadingTodos, isError: isErrorTodos } = useQuery<Todo[], AxiosError>({
    queryKey: ['teamTodos', teamName],
    queryFn: () => apiService.todos.getTodosForTeam(teamName!),
    enabled: !!teamName,
  });

  // --- Derived Data and Memoization ---
  const teamOwnerUsername = useMemo(() => {
    if (!memberships || memberships.length === 0) return null;
    const ownerMembership = memberships.find(m => m.user.id === m.team.owner_user_id);
    return ownerMembership?.user.username || null;
  }, [memberships]);

  const filteredAndSortedTasks = useMemo<Todo[]>(() => {
    if (!todos) return [];
    let filtered = [...todos];
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => (statusFilter === 'open' ? task.is_open : !task.is_open));
    }
    if (userFilter !== "all") {
      filtered = filtered.filter((task) => userFilter === "unassigned" ? !task.assigned_to_user?.username : task.assigned_to_user?.username === userFilter);
    }
    filtered.sort((a: any, b) => {
      if (sortBy === 'created_at') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'assignee') return (a.assigned_to_user?.username || 'Z').localeCompare(b.assigned_to_user?.username || 'Z');
      return 0;
    });
    return filtered;
  }, [todos, statusFilter, userFilter, sortBy]);

  // --- Event Handlers ---
  const handleTaskClick = (task: Todo) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  // --- Dynamic Options for Filters ---
  const userOptions = useMemo(() => {
    if (!memberships) return [{ value: "all", label: "All Users" }, { value: "unassigned", label: "Unassigned" }];
    const memberOptions = memberships.map(m => ({ value: m.user.username, label: m.user.username }));
    return [{ value: "all", label: "All Users" }, { value: "unassigned", label: "Unassigned" }, ...memberOptions];
  }, [memberships]);

  const statusOptions = [{ value: "all", label: "All Status" }, { value: "open", label: "Open" }, { value: "completed", label: "Completed" }];
  const sortOptions = [{ value: "created_at", label: "Created Date" }, { value: "assignee", label: "Assignee" }];

  // --- Style Definitions ---
  const headerStyle: React.CSSProperties = { display: "flex", height: "64px", alignItems: "center", borderBottom: "1px solid #e5e7eb", padding: "0 16px" };
  const backButtonStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", padding: "4px 8px", fontSize: "14px", color: "#374151", backgroundColor: "transparent", border: "none", borderRadius: "6px", cursor: "pointer", textDecoration: "none", transition: "background-color 0.2s ease" };
  const mainStyle: React.CSSProperties = { flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "24px" };
  const teamHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" };
  const teamTitleStyle: React.CSSProperties = { fontSize: "24px", fontWeight: "600", color: "#111827", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: "8px" };
  const ownerStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "#6b7280" };
  const membersStyle: React.CSSProperties = { marginTop: "12px" };
  const memberListStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "12px" };
  const memberItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", backgroundColor: "#f3f4f6", borderRadius: "8px", padding: "8px 12px" };
  const tasksHeaderStyle: React.CSSProperties = { display: "flex", alignItems: "center", justifyContent: "space-between" };
  const filtersStyle: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" };
  const taskListStyle: React.CSSProperties = { border: "1px solid #e5e7eb", borderRadius: "8px", overflow: "hidden" };
  const taskItemStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "16px", padding: "16px", borderBottom: "1px solid #e5e7eb", cursor: "pointer", transition: "background-color 0.2s ease" };
  const taskContentStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "12px", flex: 1 };
  const taskDetailsStyle: React.CSSProperties = { flex: 1 };
  const taskTitleStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" };
  const taskMetaStyle: React.CSSProperties = { fontSize: "14px", color: "#6b7280" };
  const emptyStateStyle: React.CSSProperties = { padding: "32px", textAlign: "center", color: "#6b7280" };
  const toastStyle: React.CSSProperties = { position: "fixed", top: "20px", right: "20px", backgroundColor: "#111827", color: "white", padding: "12px 16px", borderRadius: "8px", fontSize: "14px", zIndex: 1000, opacity: toastMessage ? 1 : 0, transform: toastMessage ? "translateY(0)" : "translateY(-20px)", transition: "all 0.3s ease" };

  // --- Render Logic ---
  if (isLoadingMembers || isLoadingTodos) {
    return <PureSidebar><div style={{ padding: '2rem', textAlign: 'center' }}><AppLoader /></div></PureSidebar>;
  }

  if (isErrorTodos || !teamName) {
    return <PureSidebar><div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error loading team data or team not found.</div></PureSidebar>;
  }

  return (
    <PureSidebar>
      <div style={toastStyle}>{toastMessage}</div>
      <header style={headerStyle}>
        <Link to="/dashboard" style={backButtonStyle}><ArrowLeft size={16} /> Back to Dashboard</Link>
      </header>
      <main style={mainStyle}>
        <PureCard>
          <CardContent className="">
            <div style={teamHeaderStyle}>
              <div>
                <h1 style={teamTitleStyle}>Team: {teamName}</h1>
                {teamOwnerUsername && <div style={ownerStyle}><Crown size={16} /><span>Owner: {teamOwnerUsername}</span></div>}
              </div>
              {canManageMembers && (
                <Link to={`/team-details/${teamName}/add-member`}>
                  <PureButton>
                    <UserPlus size={16} style={{ marginRight: "8px" }} />
                    Add Member
                  </PureButton>
                </Link>
              )}
            </div>
            <div style={membersStyle}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0" }}>Members:</h3>
              <div style={memberListStyle}>
                {memberships && memberships.map((membership) => (
                  <div key={membership.id} style={memberItemStyle}>
                    <PureAvatar fallback={membership.user.username.charAt(0).toUpperCase()} size={24} />
                    <span style={{ fontSize: "14px" }}>{membership.user.username}</span>
                    {membership.user.username === teamOwnerUsername && <Crown size={12} color="#eab308" />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </PureCard>
        <div>
          <div style={tasksHeaderStyle}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>Tasks</h2>
            <PureButton onClick={() => navigate('/create-task', { state: { teamName } })}><Plus size={16} style={{ marginRight: "8px" }} /> Add Task</PureButton>
          </div>
          <div style={filtersStyle}>
            <PureSelect value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)} options={statusOptions} style={{ width: "140px" }} />
            <PureSelect value={userFilter} onValueChange={setUserFilter} options={userOptions} style={{ width: "140px" }} />
            <PureSelect value={sortBy} onValueChange={setSortBy} options={sortOptions} style={{ width: "120px" }} />
          </div>
          <PureCard>
            <div style={taskListStyle}>
              {filteredAndSortedTasks.map((task, index) => (

                <Link to={`/task-details/${task.id}`}>
                  <div key={task.id} style={{ ...taskItemStyle, borderBottom: index === filteredAndSortedTasks.length - 1 ? "none" : "1px solid #e5e7eb" }} onClick={() => handleTaskClick(task)} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                    <div style={taskContentStyle}>
                      {task.is_open ? <Clock size={20} color="#9ca3af" /> : <CheckCircle size={20} color="#059669" />}
                      <div style={taskDetailsStyle}>
                        <div style={taskTitleStyle}><span style={{ fontSize: "16px", fontWeight: "500" }}>{task.title}</span></div>
                        <div style={taskMetaStyle}>{task.assigned_to_user?.username ? <span>Assigned: {task.assigned_to_user.username}</span> : <span style={{ color: "#f59e0b" }}>Unassigned</span>}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", color: "#6b7280" }}>{task.is_open ? "Open" : "Completed"}</div>
                  </div>
                </Link>

              ))}
              {filteredAndSortedTasks.length === 0 && <div style={emptyStateStyle}>No tasks found matching your filters.</div>}
            </div>
          </PureCard>
        </div>
      </main>
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </PureSidebar>
  );
}