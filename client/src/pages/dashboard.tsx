"use client"

import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { CheckCircle, Clock, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "../api/apiService";
import { AppLoader } from "../components/app-loader";
import { PageHeader } from "../components/PageHeader";
import { PureButton } from "../components/pure-button";
import { CardContent, PureCard } from "../components/pure-card";
import { PureInput } from "../components/pure-input";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";
import { useAuth } from "../hooks/useAuth";
import "../styles/Dashboard.css";
import type { TeamMembership, Todo } from "../type/api.types";


const getDisplayStatus = (todo: Todo): 'completed' | 'open' => {
  return todo.is_open ? 'open' : 'completed';
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [roleFilter, setRoleFilter] = useState<'assigned' | 'owned' | 'all'>("all");
  const [teamFilter, setTeamFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

  const { data: todos, isLoading, isError, error } = useQuery<Todo[], AxiosError>({
    queryKey: ['todos', user?.username, roleFilter],
    queryFn: () => apiService.todos.getTodosForUser(user!.username, roleFilter),
    enabled: !!user?.username,
  });

  const { data: teamMemberships } = useQuery<TeamMembership[], AxiosError>({
    queryKey: ['userTeams', user?.username],
    queryFn: () => apiService.users.getTeamsForUser(user!.username),
    enabled: !!user,
  });

  const userHasTeams = (teamMemberships?.length ?? 0) > 0;


  const filteredTasks = useMemo<Todo[]>(() => {
    if (!todos) return [];
    let filtered = [...todos];

    if (teamFilter !== "all") {
      filtered = filtered.filter((task) => task.team.name === teamFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  }, [todos, teamFilter, searchQuery]);

  const teamOptions = useMemo(() => {
    if (!todos) return [{ value: "all", label: "All Teams" }];
    const uniqueTeams = [...new Set(todos.map(task => task.team.name))];
    return [
      { value: "all", label: "All Teams" },
      ...uniqueTeams.map(team => ({ value: team, label: team })),
    ];
  }, [todos]);



  const getStatusBadge = (status: 'completed' | 'open'): React.ReactElement => {
    const colors = {
      open: { backgroundColor: "#f3f4f6", color: "#1f2937" },
      completed: { backgroundColor: "#dcfce7", color: "#166534" },
    };
    const labels = { open: "Open", completed: "Completed" };
    const badgeStyle: React.CSSProperties = {
      padding: "4px 8px", fontSize: "12px", fontWeight: "500",
      borderRadius: "9999px", ...colors[status],
    };
    return <span style={badgeStyle}>{labels[status]}</span>;
  };

  const getStatusIcon = (status: 'completed' | 'open'): React.ReactElement => {
    return status === 'completed'
      ? <CheckCircle size={16} color="#059669" />
      : <Clock size={16} color="#9ca3af" />;
  };

  if (isLoading) {
    return <PureSidebar><div className="dashboard-loader"><AppLoader /></div></PureSidebar>;
  }
  if (isError) {
    return <PureSidebar><div className="dashboard-error">Error: {error.message}</div></PureSidebar>;
  }

  const roleOptions = [{ value: "all", label: "All My Tasks" }, { value: "assigned", label: "Assigned to Me" }, { value: "owned", label: "Created by Me" }];

  return (
    <PureSidebar>
      <PageHeader />
      <main className="dashboard-main">
        <section className="dashboard-welcome" aria-labelledby="welcome-heading">
          <h1 id="welcome-heading">Welcome, {user?.username}!</h1>

          {
            userHasTeams && (
              <Link to="/create-task">
                <PureButton>
                  <Plus size={16} style={{ marginRight: "8px" }} />
                  Create Task
                </PureButton>
              </Link>
            )

          }

        </section>

        <section className="dashboard-filters" aria-label="Task Filters">
          <div className="dashboard-filters-row">
            <PureSelect value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)} options={roleOptions} style={{ width: "160px" }} />
            <PureSelect value={teamFilter} onValueChange={setTeamFilter} options={teamOptions} style={{ width: "160px" }} />
          </div>
          <div className="dashboard-search-container">
            <div className="dashboard-search-icon"><Search size={16} /></div>
            <PureInput placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: "40px" }} />
          </div>
        </section>

        <section className="dashboard-tasks" aria-labelledby="tasks-heading">
          <h2 id="tasks-heading">📋 Tasks Overview</h2>
          <div className="dashboard-task-grid">
            {filteredTasks.length > 0 ? filteredTasks.map((task) => {
              const displayStatus = getDisplayStatus(task);
              return (
                <article key={task.id}>
                  <PureCard onClick={() => navigate(`/task-details/${task.id}`)}>
                    <CardContent className="">
                      <div className="dashboard-task-content">
                        <div className="dashboard-task-left">
                          {getStatusIcon(displayStatus)}
                          <div className="dashboard-task-details">
                            <h3>{task.title}</h3>
                            <div className="dashboard-task-meta">
                              <span>Assignee: {task.assigned_to_user?.username || 'Unassigned'}</span>
                              <span>Team: {task.team.name}</span>
                            </div>
                          </div>
                        </div>
                        <div className="dashboard-task-status">{getStatusBadge(displayStatus)}</div>
                      </div>
                    </CardContent>
                  </PureCard>
                </article>
              )
            }) : (
              <PureCard>
                <CardContent style={{ padding: "32px", textAlign: "center" }} className="">
                  <p style={{ color: "#6b7280", margin: 0 }}>No tasks found matching your filters.</p>
                </CardContent>
              </PureCard>
            )}
          </div>
        </section>
      </main>
    </PureSidebar>
  );
}
