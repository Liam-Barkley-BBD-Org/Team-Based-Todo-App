"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Edit3, Save, X, Clock, User, Calendar, Flag, Trash2 } from "lucide-react"
import { PureAvatar } from "../components/pure-avatar"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureAlertModal } from "../components/pure-modal"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link } from "react-router-dom"

// Types
type TaskStatus = "open" | "in-progress" | "completed"
type TaskPriority = "low" | "medium" | "high"

type Task = {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  teamId: string
  teamName: string
  assigneeId: number | null
  assigneeName: string | null
  createdAt: string
  updatedAt: string
  dueDate: string | null
  createdBy: {
    id: number
    name: string
    avatar?: string
    initials: string
  }
}

// Mock data
const mockTask: Task = {
  id: 1,
  title: "Implement user authentication system",
  description:
    "Create a comprehensive user authentication system with login, registration, password reset, and email verification features. The system should support OAuth integration with Google and GitHub, implement JWT tokens for session management, and include proper security measures like rate limiting and password hashing.",
  status: "in-progress",
  priority: "high",
  teamId: "alpha",
  teamName: "Team Alpha",
  assigneeId: 2,
  assigneeName: "Bob Smith",
  createdAt: "2025-06-01T10:00:00Z",
  updatedAt: "2025-06-05T14:30:00Z",
  dueDate: "2025-06-15",
  createdBy: {
    id: 1,
    name: "Alice Johnson",
    avatar: "/placeholder-user.jpg",
    initials: "AJ",
  },
}

const teams = [
  { value: "alpha", label: "Team Alpha" },
  { value: "beta", label: "Team Beta" },
  { value: "gamma", label: "Team Gamma" },
]

const users = [
  { value: "", label: "Unassigned" },
  { value: "1", label: "Alice Johnson" },
  { value: "2", label: "Bob Smith" },
  { value: "3", label: "Charlie Brown" },
  { value: "4", label: "Diana Prince" },
]

const priorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
]

const statuses = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export default function TaskDetailPage() {
  const [isClient, setIsClient] = useState(false)
  const [task, setTask] = useState<Task>(mockTask)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>(mockTask)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return { backgroundColor: "#fee2e2", color: "#dc2626" }
      case "medium":
        return { backgroundColor: "#fef3c7", color: "#d97706" }
      case "low":
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "#dcfce7", color: "#166534" }
      case "in-progress":
        return { backgroundColor: "#dbeafe", color: "#1e40af" }
      case "open":
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
    }
  }

  const handleEdit = () => {
    setEditedTask({ ...task })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTask(editedTask)
      setIsEditing(false)
      showToast("Task updated successfully!")
    } catch (error) {
      showToast("Failed to update task")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditedTask({ ...task })
    setIsEditing(false)
  }

  const handleDelete = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast("Task deleted successfully!")
      // In real app, redirect to task list
    } catch (error) {
      showToast("Failed to delete task")
    }
    setDeleteDialogOpen(false)
  }

  const handleTaskFieldChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }))
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  const headerStyle: React.CSSProperties = {
    display: "flex",
    height: "64px",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 16px",
  }

  const backButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "4px 8px",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.2s ease",
  }

  const mainStyle: React.CSSProperties = {
    flex: 1,
    padding: "24px",
    display: "flex",
    gap: "24px",
  }

  const leftColumnStyle: React.CSSProperties = {
    flex: 2,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const rightColumnStyle: React.CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const titleSectionStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "16px",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#111827",
    margin: 0,
    lineHeight: "1.2",
  }

  const metaRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
    marginBottom: "16px",
  }

  const metaItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#6b7280",
  }

  const descriptionStyle: React.CSSProperties = {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#374151",
    margin: 0,
  }

  const sidebarSectionStyle: React.CSSProperties = {
    marginBottom: "16px",
  }

  const sidebarLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
    display: "block",
  }

  const editFormStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  }

  const buttonGroupStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
  }

  const toastStyle: React.CSSProperties = {
    position: "fixed",
    top: "20px",
    right: "20px",
    backgroundColor: "#111827",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 1000,
    opacity: toastMessage ? 1 : 0,
    transform: toastMessage ? "translateY(0)" : "translateY(-20px)",
    transition: "all 0.3s ease",
  }

  return (
    <PureSidebar>
      {/* Toast */}
      <div style={toastStyle}>{toastMessage}</div>

      {/* Header */}
      <header style={headerStyle}>
        <Link to="/dashboard" style={backButtonStyle}>
          <ArrowLeft size={16} />
          Back to Tasks
        </Link>
        <div style={{ display: "flex", gap: "8px" }}>
          {!isEditing ? (
            <>
              <PureButton variant="outline" onClick={handleEdit}>
                <Edit3 size={16} style={{ marginRight: "8px" }} />
                Edit
              </PureButton>
              <PureButton variant="secondary" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 size={16} style={{ marginRight: "8px" }} />
                Delete
              </PureButton>
            </>
          ) : (
            <>
              <PureButton variant="outline" onClick={handleCancel}>
                <X size={16} style={{ marginRight: "8px" }} />
                Cancel
              </PureButton>
              <PureButton onClick={handleSave} disabled={isSaving}>
                <Save size={16} style={{ marginRight: "8px" }} />
                {isSaving ? "Saving..." : "Save"}
              </PureButton>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* Left Column - Task Details */}
        <div style={leftColumnStyle}>
          <PureCard>
            <CardContent>
              {!isEditing ? (
                <>
                  <div style={titleSectionStyle}>
                    <h1 style={titleStyle}>{task.title}</h1>
                  </div>

                  <div style={metaRowStyle}>
                    <div style={metaItemStyle}>
                      <User size={16} />
                      <span>Created by {task.createdBy.name}</span>
                    </div>
                    <div style={metaItemStyle}>
                      <Clock size={16} />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                    {task.dueDate && (
                      <div style={metaItemStyle}>
                        <Calendar size={16} />
                        <span>Due {formatDateShort(task.dueDate)}</span>
                      </div>
                    )}
                  </div>

                  <div style={metaRowStyle}>
                    <PureBadge style={getStatusColor(task.status)}>
                      {statuses.find((s) => s.value === task.status)?.label}
                    </PureBadge>
                    <PureBadge style={getPriorityColor(task.priority)}>
                      <Flag size={12} style={{ marginRight: "4px" }} />
                      {task.priority} priority
                    </PureBadge>
                  </div>

                  <p style={descriptionStyle}>{task.description}</p>
                </>
              ) : (
                <div style={editFormStyle}>
                  <div>
                    <label style={sidebarLabelStyle}>Title</label>
                    <PureInput
                      value={editedTask.title}
                      onChange={(e: { target: { value: any } }) => handleTaskFieldChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={sidebarLabelStyle}>Description</label>
                    <PureTextarea
                      value={editedTask.description}
                      onChange={(e: { target: { value: any } }) => handleTaskFieldChange("description", e.target.value)}
                      rows={6}
                    />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={sidebarLabelStyle}>Status</label>
                      <PureSelect
                        value={editedTask.status}
                        onValueChange={(value: any) => handleTaskFieldChange("status", value)}
                        options={statuses}
                      />
                    </div>
                    <div>
                      <label style={sidebarLabelStyle}>Priority</label>
                      <PureSelect
                        value={editedTask.priority}
                        onValueChange={(value: unknown) => handleTaskFieldChange("priority", value)}
                        options={priorities}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={sidebarLabelStyle}>Due Date</label>
                    <PureInput
                      type="date"
                      value={editedTask.dueDate || ""}
                      onChange={(e: { target: { value: unknown } }) => handleTaskFieldChange("dueDate", e.target.value)}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </PureCard>
        </div>

        <div style={rightColumnStyle}>
          <PureCard>
            <CardContent>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px" }}>Task Properties</h3>

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Team</label>
                <div style={{ fontSize: "14px", color: "#374151" }}>{task.teamName}</div>
              </div>

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Assignee</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {task.assigneeName ? (
                    <>
                      <PureAvatar fallback="BS" size={24} />
                      <span style={{ fontSize: "14px" }}>{task.assigneeName}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: "14px", color: "#6b7280" }}>Unassigned</span>
                  )}
                </div>
              </div>

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Status</label>
                <PureBadge style={getStatusColor(task.status)}>
                  {statuses.find((s) => s.value === task.status)?.label}
                </PureBadge>
              </div>

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Priority</label>
                <PureBadge style={getPriorityColor(task.priority)}>{task.priority}</PureBadge>
              </div>

              {task.dueDate && (
                <div style={sidebarSectionStyle}>
                  <label style={sidebarLabelStyle}>Due Date</label>
                  <div style={{ fontSize: "14px", color: "#374151" }}>{formatDateShort(task.dueDate)}</div>
                </div>
              )}

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Created</label>
                <div style={{ fontSize: "14px", color: "#374151" }}>{formatDate(task.createdAt)}</div>
              </div>

              <div style={sidebarSectionStyle}>
                <label style={sidebarLabelStyle}>Last Updated</label>
                <div style={{ fontSize: "14px", color: "#374151" }}>{formatDate(task.updatedAt)}</div>
              </div>
            </CardContent>
          </PureCard>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <PureAlertModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        description={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </PureSidebar>
  )
}
