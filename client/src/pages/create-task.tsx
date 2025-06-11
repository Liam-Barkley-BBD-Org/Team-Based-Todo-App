"use client"

import React, { useState, useEffect } from "react"
import { Plus, ArrowLeft, FileText, Save } from "lucide-react"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureLabel, PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link } from "react-router-dom"

import styles from "../styles/CreateTaskPage.module.css"  // Adjust path as needed

// Mock data
const teams = [
  { value: "alpha", label: "Team Alpha" },
  { value: "beta", label: "Team Beta" },
  { value: "gamma", label: "Team Gamma" },
]

const users = [
  { value: "1", label: "Alice Johnson" },
  { value: "2", label: "Bob Smith" },
  { value: "3", label: "Charlie Brown" },
  { value: "4", label: "Diana Prince" },
  { value: "5", label: "Eve Wilson" },
]

const statuses = [
  { value: "open", label: "Open" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
]

export default function CreateTaskPage() {
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    teamId: "",
    assigneeId: "",
    priority: "medium",
    status: "open",
    dueDate: "",
    tags: [] as string[],
    currentTag: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    setIsClient(true)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showToast = (message: string, _type: "success" | "error" = "success") => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Task description is required"
    }

    if (!formData.teamId) {
      newErrors.teamId = "Please select a team"
    }

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        newErrors.dueDate = "Due date cannot be in the past"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      showToast("Please fix the errors below", "error")
      return
    }

    setIsCreating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      showToast(`Task "${formData.title}" created successfully!`)

      // Reset form
      setFormData({
        title: "",
        description: "",
        teamId: "",
        assigneeId: "",
        priority: "medium",
        status: "open",
        dueDate: "",
        tags: [],
        currentTag: "",
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast("Failed to create task. Please try again.", "error")
    } finally {
      setIsCreating(false)
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return { backgroundColor: "#dcfce7", color: "#166534" }
      case "in-progress":
        return { backgroundColor: "#dbeafe", color: "#1e40af" }
      case "open":
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
    }
  }

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <PureSidebar>
      {/* Toast Notification */}
      <aside
        role="status"
        aria-live="polite"
        className={`${styles.toast} ${toastMessage ? "" : styles.toastHidden}`}
      >
        {toastMessage}
      </aside>

      {/* Page Header */}
      <header className={styles.header}>
        <nav aria-label="Back navigation">
          <Link to="/dashboard" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <section className={styles.container} aria-labelledby="create-task-heading">
          <header className={styles.headerText}>
            <h1 id="create-task-heading" className={styles.title}>Create New Task</h1>
            <p className={styles.subtitle}>
              Create a new task and assign it to team members to track progress and collaborate effectively.
            </p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            <section aria-labelledby="task-details-heading">
              <PureCard>
                <CardContent className="">
                  <h2
                    id="task-details-heading"
                    style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <FileText size={20} />
                    Task Details
                  </h2>

                  {/* Title */}
                  <div className={styles.formGroup}>
                    <PureLabel htmlFor="title">Task Title *</PureLabel>
                    <PureInput
                      id="title"
                      placeholder="Enter a clear and descriptive task title..."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      style={{ borderColor: errors.title ? "#dc2626" : undefined }}
                    />
                    {errors.title && <p className={styles.error}>{errors.title}</p>}
                  </div>

                  {/* Description */}
                  <div className={styles.formGroup}>
                    <PureLabel htmlFor="description">Description *</PureLabel>
                    <PureTextarea
                      id="description"
                      placeholder="Provide detailed information about the task, requirements, and expected outcomes..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      rows={4}
                      style={{ borderColor: errors.description ? "#dc2626" : undefined }}
                    />
                    {errors.description && <p className={styles.error}>{errors.description}</p>}
                  </div>

                  {/* Team and Assignee */}
                  <fieldset className={styles.grid}>
                    <legend className="sr-only">Team and Assignee</legend>
                    <div className={styles.formGroup}>
                      <PureLabel>Team *</PureLabel>
                      <PureSelect
                        value={formData.teamId}
                        onValueChange={(value: string) => handleInputChange("teamId", value)}
                        options={teams}
                        placeholder="Select team"
                        style={{ borderColor: errors.teamId ? "#dc2626" : undefined }}
                      />
                      {errors.teamId && <p className={styles.error}>{errors.teamId}</p>}
                    </div>

                    <div className={styles.formGroup}>
                      <PureLabel>Assignee</PureLabel>
                      <PureSelect
                        value={formData.assigneeId}
                        onValueChange={(value: string) => handleInputChange("assigneeId", value)}
                        options={[{ value: "", label: "Unassigned" }, ...users]}
                        placeholder="Select assignee"
                      />
                    </div>
                  </fieldset>

                  {/* Priority and Status */}
                  <fieldset className={styles.grid}>
                    <legend className="sr-only">Task Status</legend>
                    <div className={styles.formGroup}>
                      <PureLabel>Status</PureLabel>
                      <PureSelect
                        value={formData.status}
                        onValueChange={(value: string) => handleInputChange("status", value)}
                        options={statuses}
                        placeholder="Select status"
                      />
                    </div>
                  </fieldset>
                </CardContent>
              </PureCard>
            </section>

            {/* Task Preview */}
            <section aria-labelledby="task-preview-heading">
              <PureCard>
                <CardContent className="">
                  <h3 id="task-preview-heading" className={styles.previewTitle}>Task Preview</h3>
                  <dl className={styles.preview}>
                    <div className={styles.previewItem}>
                      <dt className={styles.previewLabel}>Title:</dt>
                      <dd className={styles.previewValue}>{formData.title || "Untitled Task"}</dd>
                    </div>
                    <div className={styles.previewItem}>
                      <dt className={styles.previewLabel}>Team:</dt>
                      <dd className={styles.previewValue}>
                        {teams.find((t) => t.value === formData.teamId)?.label || "No team selected"}
                      </dd>
                    </div>
                    <div className={styles.previewItem}>
                      <dt className={styles.previewLabel}>Assignee:</dt>
                      <dd className={styles.previewValue}>
                        {users.find((u) => u.value === formData.assigneeId)?.label || "Unassigned"}
                      </dd>
                    </div>
                    <div className={styles.previewItem}>
                      <dt className={styles.previewLabel}>Status:</dt>
                      <dd>
                        <PureBadge style={getStatusColor(formData.status)}>
                          {statuses.find((s) => s.value === formData.status)?.label}
                        </PureBadge>
                      </dd>
                    </div>
                    {formData.dueDate && (
                      <div className={styles.previewItem}>
                        <dt className={styles.previewLabel}>Due Date:</dt>
                        <dd className={styles.previewValue}>{formData.dueDate}</dd>
                      </div>
                    )}
                    {formData.tags.length > 0 && (
                      <div className={styles.previewItem}>
                        <dt className={styles.previewLabel}>Tags:</dt>
                        <dd style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {formData.tags.map((tag, index) => (
                            <span key={index} className={styles.tag} style={{ fontSize: "10px" }}>
                              {tag}
                            </span>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </PureCard>
            </section>

            {/* Form Actions */}
            <div className={styles.buttonContainer}>
              <PureButton type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </PureButton>
              <PureButton type="submit" disabled={isCreating} style={{ minWidth: "140px" }}>
                {isCreating ? (
                  <>
                    <div className={styles.creatingSpinner} />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save size={16} style={{ marginRight: "8px" }} />
                    Create Task
                  </>
                )}
              </PureButton>
            </div>
          </form>
        </section>
      </main>
    </PureSidebar>
  );
}