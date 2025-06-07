"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CheckCircle, Clock, Plus, Search, ChevronDown, LogOut } from "lucide-react"
import  { PureButton } from "../components/pure-button"
import  { PureCard, CardContent } from "../components/pure-card"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link, useNavigate } from "react-router-dom"


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

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Filter tasks based on current filters
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
    const colors = {
      open: { backgroundColor: "#f3f4f6", color: "#1f2937" },
      "in-progress": { backgroundColor: "#dbeafe", color: "#1e40af" },
      completed: { backgroundColor: "#dcfce7", color: "#166534" },
    }

    const labels = {
      open: "Open",
      "in-progress": "In Progress",
      completed: "Completed",
    }

    const badgeStyle: React.CSSProperties = {
      padding: "4px 8px",
      fontSize: "12px",
      fontWeight: "500",
      borderRadius: "9999px",
      ...colors[status as keyof typeof colors],
    }

    return <span style={badgeStyle}>{labels[status as keyof typeof labels]}</span>
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

  const headerStyle: React.CSSProperties = {
    display: "flex",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 16px",
  }

  const userMenuStyle: React.CSSProperties = {
    position: "relative",
  }

  const userButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "6px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }

  const avatarStyle: React.CSSProperties = {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
  }

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    right: 0,
    top: "100%",
    marginTop: "4px",
    width: "192px",
    backgroundColor: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    zIndex: 20,
  }

  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const welcomeStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const filtersStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const filtersRowStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }

  const searchContainerStyle: React.CSSProperties = {
    position: "relative",
    width: "250px",
  }

  const searchIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
  }

  const tasksStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const taskGridStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const taskContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  }

  const taskLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    flex: 1,
  }

  const taskDetailsStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  }

  const taskMetaStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    fontSize: "14px",
    color: "#6b7280",
  }

  // Don't render full content until client-side
  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <PureSidebar>
      {/* Header */}
      <header style={headerStyle}>
        <div></div>
        <div style={userMenuStyle}>
          <button style={userButtonStyle} onClick={() => setUserMenuOpen(!userMenuOpen)}>
            <div style={avatarStyle}>A</div>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Alice</span>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <>
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 10,
                }}
                onClick={() => setUserMenuOpen(false)}
              />
              <div style={dropdownStyle}>
                <div style={{ padding: "4px" }}>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 16px",
                      fontSize: "14px",
                      color: "#374151",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    Profile
                  </button>
                  <button
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                      padding: "8px 16px",
                      fontSize: "14px",
                      color: "#374151",
                      backgroundColor: "transparent",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      transition: "background-color 0.2s ease",
                    }}
                  >
                    <LogOut size={16} style={{ marginRight: "8px" }} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* Welcome Section */}
        <div style={welcomeStyle}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: 0 }}>Welcome, Alice!</h1>
          <Link to="/create-task">
            <PureButton>
            <Plus size={16} style={{ marginRight: "8px" }} />
            Create Task
          </PureButton>
          </Link>
          
        </div>

        {/* Filters and Search */}
        <div style={filtersStyle}>
          <div style={filtersRowStyle}>
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
          </div>

          <div style={searchContainerStyle}>
            <div style={searchIconStyle}>
              <Search size={16} />
            </div>
            <PureInput
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "40px" }}
            />
          </div>
        </div>

        {/* Tasks Overview */}
        <div style={tasksStyle}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>📋 Tasks Overview</h2>

          <div style={taskGridStyle}>
            {filteredTasks.map((task) => (
              <PureCard key={task.id} onClick={() => navigate('/task-details')}>
                <CardContent>
                  <div style={taskContentStyle}>
                    <div style={taskLeftStyle}>
                      {getStatusIcon(task.status)}
                      <div style={taskDetailsStyle}>
                        <h3 style={{ fontSize: "16px", fontWeight: "500", color: "#111827", margin: 0 }}>
                          {task.title}
                        </h3>
                        <div style={taskMetaStyle}>
                          <span>Assignee: {task.assignee}</span>
                          <span>Team: {task.team}</span>
                          <span>Due: {task.dueDate}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      {getStatusBadge(task.status)}
                    </div>
                  </div>
                </CardContent>
              </PureCard>
            ))}

            {filteredTasks.length === 0 && (
              <PureCard>
                <CardContent style={{ padding: "32px", textAlign: "center" }}>
                  <p style={{ color: "#6b7280", margin: 0 }}>No tasks found matching your filters.</p>
                </CardContent>
              </PureCard>
            )}
          </div>
        </div>
      </main>
    </PureSidebar>
  )
}
