"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Clock,
  Plus,
  Search,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { PureButton } from "../components/pure-button";
import { PureCard, CardContent } from "../components/pure-card";
import { PureInput } from "../components/pure-input";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";
import { Link, useNavigate } from "react-router-dom";

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
  const [allTasks, setAllTasks] = useState([]);

  const navigate = useNavigate();

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

        setAllTasks(allTodos);
        setFilteredTasks(allTodos);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      }
    };

    fetchData();
  }, [username, token]);

  useEffect(() => {
    let filtered = [...allTasks];

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }
    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) => task.assignee === assigneeFilter);
    }
    if (teamFilter !== "all") {
      filtered = filtered.filter((task) => task.team === teamFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [statusFilter, assigneeFilter, teamFilter, searchQuery, allTasks]);

  const getStatusBadge = (status) => {
    const classMap = {
      open: styles.statusOpen,
      "in-progress": styles.statusInProgress,
      completed: styles.statusCompleted,
    };
    const labels = {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#059669" />;
      case "in-progress":
        return <Clock size={16} color="#f59e0b" />;
      default:
        return <Clock size={16} color="#9ca3af" />;
    }
  };

  const getUniqueOptions = (key) => {
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
            {filteredTasks.map((task) => (
              <article key={task.id}>
                <PureCard onClick={() => navigate(`/task/${task.id}`)}>
                  <CardContent>
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
                    </div>
                  </CardContent>
                </PureCard>
              </article>
            ))}

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
}
