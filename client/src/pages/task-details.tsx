"use client"

import { ArrowLeft, Clock, Edit3, Save, Trash2, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { PureAvatar } from "../components/pure-avatar"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { CardContent, PureCard } from "../components/pure-card"
import { PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureAlertModal } from "../components/pure-modal"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import styles from "../styles/TaskDetailPage.module.css"

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

  return (
    <PureSidebar>
      {/* Toast */}
      <div
        role="status"
        className={`${styles.toast} ${toastMessage ? styles.toastVisible : ""}`}
      >
        {toastMessage}
      </div>

      {/* Header */}
      <header className={styles.header}>
        <nav aria-label="Back navigation">
          <Link to="/dashboard" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Tasks
          </Link>
        </nav>

        <div style={{ display: "flex", gap: "8px" }}>
          {!isEditing ? (
            <>
              <PureButton variant="outline" onClick={handleEdit}>
                <Edit3 size={16} style={{ marginRight: "8px" }} />
                Edit
              </PureButton>
              <PureButton
                variant="secondary"
                onClick={() => setDeleteDialogOpen(true)}
              >
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
      <main className={styles.main}>
        {/* Left Column */}
        <section className={styles.leftColumn}>
          <PureCard>
            <CardContent className="">
              {!isEditing ? (
                <>
                  <header className={styles.titleSection}>
                    <h1 className={styles.title}>{task.title}</h1>
                  </header>

                  <section className={styles.metaRow} aria-label="Task Metadata">
                    <div className={styles.metaItem}>
                      <User size={16} />
                      <span>Created by {task.createdBy.name}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <Clock size={16} />
                      <span>Created {formatDate(task.createdAt)}</span>
                    </div>
                  </section>

                  <section className={styles.metaRow}>
                    <PureBadge style={getStatusColor(task.status)}>
                      {statuses.find((s) => s.value === task.status)?.label}
                    </PureBadge>
                  </section>

                  <p className={styles.description}>{task.description}</p>
                </>
              ) : (
                <form className={styles.editForm}>
                  <div>
                    <label className={styles.sidebarLabel} htmlFor="title">
                      Title
                    </label>
                    <PureInput
                      id="title"
                      value={editedTask.title}
                      onChange={(e) =>
                        handleTaskFieldChange("title", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={styles.sidebarLabel} htmlFor="description">
                      Description
                    </label>
                    <PureTextarea
                      id="description"
                      rows={6}
                      value={editedTask.description}
                      onChange={(e) =>
                        handleTaskFieldChange("description", e.target.value)
                      }
                    />
                  </div>

                  <div
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
                  >
                    <div>
                      <label className={styles.sidebarLabel} htmlFor="status">
                        Status
                      </label>
                      <PureSelect
                        value={editedTask.status}
                        onValueChange={(value) =>
                          handleTaskFieldChange("status", value)
                        }
                        options={statuses}
                      />
                    </div>

                    <div>
                      <label className={styles.sidebarLabel} htmlFor="priority">
                        Priority
                      </label>
                      <PureSelect
                        value={editedTask.priority}
                        onValueChange={(value) =>
                          handleTaskFieldChange("priority", value)
                        }
                        options={priorities}
                      />
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </PureCard>
        </section>

        {/* Right Column - Sidebar Info */}
        <aside className={styles.rightColumn} aria-label="Task Properties Sidebar">
          <PureCard>
            <CardContent className="">
              <h2
                style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}
              >
                Task Properties
              </h2>

              <section className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Team</label>
                <div style={{ fontSize: 14, color: "#374151" }}>
                  {task.teamName}
                </div>
              </section>

              <section className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Assignee</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {task.assigneeName ? (
                    <>
                      <PureAvatar fallback="BS" size={24} />
                      <span style={{ fontSize: 14 }}>{task.assigneeName}</span>
                    </>
                  ) : (
                    <span style={{ fontSize: 14, color: "#6b7280" }}>Unassigned</span>
                  )}
                </div>
              </section>

              <section className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Status</label>
                <PureBadge style={getStatusColor(task.status)}>
                  {statuses.find((s) => s.value === task.status)?.label}
                </PureBadge>
              </section>

              <section className={styles.sidebarSection}>
                <label className={styles.sidebarLabel}>Created</label>
                <div style={{ fontSize: 14, color: "#374151" }}>
                  {formatDate(task.createdAt)}
                </div>
              </section>
            </CardContent>
          </PureCard>
        </aside>
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