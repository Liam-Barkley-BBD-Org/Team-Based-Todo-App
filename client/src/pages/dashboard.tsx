"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { CheckCircle, Clock, Plus, Search, ChevronDown, LogOut } from "lucide-react"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link, useNavigate } from "react-router-dom"

import styles from "../styles/Dashboard.module.css"

// Mock data
const tasks = [
  {
    id: 1,
    title: "Fix bug login",
    status: "open",
    assignee: "Alice",
    team: "Team Alpha",
    dueDate: "2025-06-10",
  },
  {
    id: 2,
    title: "Write blog post",
    status: "in-progress",
    assignee: "Bob",
    team: "Team Beta",
    dueDate: "2025-06-15",
  },
  {
    id: 3,
    title: "Review code changes",
    status: "completed",
    assignee: "Alice",
    team: "Team Alpha",
    dueDate: "2025-06-08",
  },
  {
    id: 4,
    title: "Update documentation",
    status: "open",
    assignee: "Charlie",
    team: "Team Beta",
    dueDate: "2025-06-12",
  },
]

export default function Dashboard() {
  const [filteredTasks, setFilteredTasks] = useState(tasks)
  const [statusFilter, setStatusFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [teamFilter, setTeamFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    let filtered = [...tasks]

    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    if (assigneeFilter !== "all") {
      filtered = filtered.filter((task) => task.assignee === assigneeFilter)
    }

    if (teamFilter !== "all") {
      filtered = filtered.filter((task) => task.team === teamFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter((task) => task.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    setFilteredTasks(filtered)
  }, [statusFilter, assigneeFilter, teamFilter, searchQuery])

  const getStatusBadge = (status: string) => {
    const classMap = {
      open: styles.statusOpen,
      "in-progress": styles.statusInProgress,
      completed: styles.statusCompleted,
    }
    const labels = {
      open: "Open",
      "in-progress": "In Progress",
      completed: "Completed",
    }

    return (
      <span className={`${styles.statusBadge} ${classMap[status as keyof typeof classMap]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={16} color="#059669" />
      case "in-progress":
        return <Clock size={16} color="#f59e0b" />
      default:
        return <Clock size={16} color="#9ca3af" />
    }
  }

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ]

  const assigneeOptions = [
    { value: "all", label: "All Assignees" },
    { value: "Alice", label: "Alice" },
    { value: "Bob", label: "Bob" },
    { value: "Charlie", label: "Charlie" },
  ]

  const teamOptions = [
    { value: "all", label: "All Teams" },
    { value: "Team Alpha", label: "Team Alpha" },
    { value: "Team Beta", label: "Team Beta" },
  ]

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <PureSidebar>
      <header className={styles.header}>
        <div aria-hidden="true" /> {/* Placeholder for left spacing or future content */}

        <nav className={styles.userMenu} aria-label="User menu">
          <button
            className={styles.userButton}
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            aria-haspopup="true"
            aria-expanded={userMenuOpen}
          >
            <div className={styles.avatar}>A</div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Alice</span>
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
                  <button className={styles.dropdownButton} role="menuitem">Profile</button>
                </li>
                <li>
                  <button className={styles.dropdownButton} role="menuitem">
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
        {/* Welcome Banner */}
        <section className={styles.welcome} aria-labelledby="welcome-title">
          <h1 id="welcome-title" className={styles.welcomeTitle}>Welcome, Alice!</h1>
          <Link to="/create-task">
            <PureButton>
              <Plus size={16} style={{ marginRight: "8px" }} />
              Create Task
            </PureButton>
          </Link>
        </section>

        {/* Filters and Search */}
        <section className={styles.filters} aria-label="Task filters and search">
          <form className={styles.filtersRow} role="group" aria-label="Filter tasks">
            <PureSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
              style={{ width: "120px" }}
            />
            <PureSelect
              value={assigneeFilter}
              onValueChange={setAssigneeFilter}
              options={assigneeOptions}
              style={{ width: "120px" }}
            />
            <PureSelect
              value={teamFilter}
              onValueChange={setTeamFilter}
              options={teamOptions}
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
              onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "40px" }}
              aria-label="Search tasks"
            />
          </div>
        </section>

        {/* Tasks Overview */}
        <section className={styles.tasks} aria-labelledby="tasks-heading">
          <h2 id="tasks-heading" className={styles.tasksTitle}>📋 Tasks Overview</h2>
          <div className={styles.taskGrid}>
            {filteredTasks.map((task) => (
              <article key={task.id}>
                <PureCard onClick={() => navigate('/task-details')}>
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