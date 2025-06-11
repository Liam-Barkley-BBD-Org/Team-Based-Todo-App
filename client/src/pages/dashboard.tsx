"use client";

<<<<<<< HEAD
import {
  CheckCircle,
  ChevronDown,
  Clock,
  LogOut,
  Plus,
  Search,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PureButton } from "../components/pure-button";
import { CardContent, PureCard } from "../components/pure-card";
import { PureInput } from "../components/pure-input";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";

import styles from "../styles/Dashboard.module.css";
import { API_URL } from "../utils/hiddenGlobals";

export default function Dashboard() {
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [teamFilter, setTeamFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [allTasks] = useState([]);
=======
import "../styles/Dashboard.css";
import { useMemo, useState } from "react"
import { Plus, Search, CheckCircle, Clock } from "lucide-react"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link, useNavigate } from "react-router-dom"
import type { Todo } from "../type/api.types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "../hooks/useAuth"
import type { AxiosError } from "axios"
import { apiService } from "../api/apiService"
import { tokenManager } from "../api/tokenManager"
import { AppLoader } from "../components/app-loader";
import { PageHeader } from "../components/PageHeader";


const getDisplayStatus = (todo: Todo): 'completed' | 'open' => {
    return todo.is_open ? 'open' : 'completed';
};

export default function Dashboard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
>>>>>>> origin/frontend

    const [roleFilter, setRoleFilter] = useState<'assigned' | 'owned' | 'all'>("all");
    const [teamFilter, setTeamFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);

<<<<<<< HEAD
  const username = sessionStorage.getItem("username");
  const token = sessionStorage.getItem("authToken");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!username || !token) return;

      try {
        const teamRes = await fetch(`${API_URL}/api/team_members/user/${username}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const teams = await teamRes.json();

        const allTodos = [];

        for (const team of teams) {
          const todoRes = await fetch(`${API_URL}/api/todos/team/${team.teamname}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const todos = await todoRes.json();
          allTodos.push(...todos);
        }

        // setAllTasks(allTodos);
        // setFilteredTasks(allTodos);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchData();
  }, [username, token]);

  useEffect(() => {
    let filtered = [...allTasks];

    if (statusFilter !== "all") {
      filtered = filtered.filter((task: any) => task.status === statusFilter);
    }
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task: any) => task.assignee === assigneeFilter);
    }
    if (teamFilter !== "all") {
      filtered = filtered.filter((task: any) => task.team === teamFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((task: any) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [statusFilter, assigneeFilter, teamFilter, searchQuery, allTasks]);

  const getStatusBadge = (status: any) => {
    const classMap: any = {
      open: styles.statusOpen,
      "in-progress": styles.statusInProgress,
      completed: styles.statusCompleted,
    };
    const labels: any = {
      open: "Open",
      "in-progress": "In Progress",
      completed: "Completed",
    };

    return (
      <span className={`${styles.statusBadge} ${classMap[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getStatusIcon = (status: any) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#059669" />;
      case "in-progress":
        return <Clock size={16} color="#f59e0b" />;
      default:
        return <Clock size={16} color="#9ca3af" />;
    }
  };

  const getUniqueOptions = (key: any) => {
    const uniqueValues = Array.from(new Set(allTasks.map((task) => task[key])));
    return [
      { value: "all", label: `All ${key[0].toUpperCase() + key.slice(1)}s` },
      ...uniqueValues.map((v) => ({ value: v, label: v })),
    ];
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <PureSidebar>
      <header className={styles.header}>
        <div aria-hidden="true" />
        <nav className={styles.userMenu} aria-label="User menu">
          <button
            className={styles.userButton}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <div className={styles.avatar}>{username?.[0].toUpperCase()}</div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>{username}</span>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <>
              <div
                className={styles.userMenuBackdrop}
                onClick={() => setUserMenuOpen(false)}
                aria-hidden="true"
              />
              <ul className={styles.dropdown} role="menu">
                <li>
                  <button className={styles.dropdownButton} role="menuitem">
                    Profile
                  </button>
                </li>
                <li>
                  <button
                    className={styles.dropdownButton}
                    role="menuitem"
                    onClick={() => {
                      sessionStorage.clear();
                      navigate("/login");
                    }}
                  >
                    <LogOut size={16} style={{ marginRight: "8px" }} />
                    Logout
                  </button>
                </li>
              </ul>
            </>
          )}
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <h1 id="welcome-title" className={styles.welcomeTitle}>
            Welcome, {username}!
          </h1>
          <Link to="/create-task">
            <PureButton>
              <Plus size={16} style={{ marginRight: "8px" }} />
              Create Task
            </PureButton>
          </Link>
        </section>

        <section className={styles.filters} aria-label="Task filters and search">
          <form className={styles.filtersRow} role="group" aria-label="Filter tasks">
            <PureSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={getUniqueOptions("status")}
              style={{ width: "120px" }}
            />
            <PureSelect
              value={assigneeFilter}
              onValueChange={setAssigneeFilter}
              options={getUniqueOptions("assignee")}
              style={{ width: "120px" }}
            />
            <PureSelect
              value={teamFilter}
              onValueChange={setTeamFilter}
              options={getUniqueOptions("team")}
              style={{ width: "120px" }}
            />
          </form>
          <div className={styles.searchContainer}>
            <div className={styles.searchIcon}>
              <Search size={16} />
            </div>
            <PureInput
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "40px" }}
              aria-label="Search tasks"
            />
          </div>
        </section>

        <section className={styles.tasks} aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className={styles.tasksTitle}>
            📋 Tasks Overview
          </h2>
          <div className={styles.taskGrid}>
            {filteredTasks.map((task: any) => (
              <article key={task.id}>
                <PureCard onClick={() => navigate(`/task/${task.id}`)}>
                  <CardContent className="">
                    <div className={styles.taskContent}>
                      <div className={styles.taskLeft}>
                        {getStatusIcon(task.status)}
                        <div className={styles.taskDetails}>
                          <h3 className={styles.taskTitle}>{task.title}</h3>
                          <div className={styles.taskMeta}>
                            <span>Assignee: {task.assignee}</span>
                            <span>Team: {task.team}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {getStatusBadge(task.status)}
                      </div>
=======
    const { data: todos, isLoading, isError, error } = useQuery<Todo[], AxiosError>({
        queryKey: ['todos', user?.username, roleFilter],
        queryFn: () => apiService.todos.getTodosForUser(user!.username, roleFilter),
        enabled: !!user?.username,
    });

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

    const logoutMutation = useMutation<void, AxiosError>({
        mutationFn: apiService.auth.logout,
        onSuccess: () => {
            tokenManager.deleteToken();
            queryClient.clear();
            navigate('/login');
        },
        onError: (err) => {
            console.error("Logout failed", err);
            tokenManager.deleteToken();
            navigate('/login');
        }
    });


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
                    <Link to="/create-task">
                        <PureButton>
                            <Plus size={16} style={{ marginRight: "8px" }} />
                            Create Task
                        </PureButton>
                    </Link>
                </section>

                <section className="dashboard-filters" aria-label="Task Filters">
                    <div className="dashboard-filters-row">
                        <PureSelect value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)} options={roleOptions} style={{ width: "160px" }} />
                        <PureSelect value={teamFilter} onValueChange={setTeamFilter} options={teamOptions} style={{ width: "160px" }} />
>>>>>>> origin/frontend
                    </div>
                    <div className="dashboard-search-container">
                        <div className="dashboard-search-icon"><Search size={16} /></div>
                        <PureInput placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ paddingLeft: "40px" }} />
                    </div>
                </section>

<<<<<<< HEAD
            {filteredTasks.length === 0 && (
              <section role="status" aria-live="polite">
                <PureCard>
                  <CardContent className={styles.cardContentCenter}>
                    <p style={{ color: "#6b7280", margin: 0 }}>
                      No tasks found matching your filters.
                    </p>
                  </CardContent>
                </PureCard>
              </section>
            )}
          </div>
        </section>
      </main>
    </PureSidebar>
  );
=======
                <section className="dashboard-tasks" aria-labelledby="tasks-heading">
                    <h2 id="tasks-heading">📋 Tasks Overview</h2>
                    <div className="dashboard-task-grid">
                        {filteredTasks.length > 0 ? filteredTasks.map((task) => {
                            const displayStatus = getDisplayStatus(task);
                            return (
                                <article key={task.id}>
                                    <PureCard onClick={() => navigate(`/task-details/${task.id}`)}>
                                        <CardContent>
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
                                <CardContent style={{ padding: "32px", textAlign: "center" }}>
                                    <p style={{ color: "#6b7280", margin: 0 }}>No tasks found matching your filters.</p>
                                </CardContent>
                            </PureCard>
                        )}
                    </div>
                </section>
            </main>
        </PureSidebar>
    );
>>>>>>> origin/frontend
}
