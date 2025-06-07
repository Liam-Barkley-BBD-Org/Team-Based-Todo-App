"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, ArrowLeft, FileText, Save } from "lucide-react"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureLabel, PureTextarea } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import { Link } from "react-router-dom"


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

  const handleAddTag = () => {
    const tag = formData.currentTag.trim()
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        currentTag: "",
      }))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return { backgroundColor: "#fee2e2", color: "#dc2626" }
      case "medium":
        return { backgroundColor: "#fef3c7", color: "#d97706" }
      case "low":
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
      default:
        return { backgroundColor: "#f3f4f6", color: "#6b7280" }
    }
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

  const headerStyle: React.CSSProperties = {
    display: "flex",
    height: "64px",
    alignItems: "center",
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
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: "768px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const headerTextStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "24px",
  }

  const titleStyle: React.CSSProperties = {
    fontSize: "30px",
    fontWeight: "bold",
    color: "#111827",
    margin: "0 0 8px 0",
  }

  const subtitleStyle: React.CSSProperties = {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  }

  const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const formGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  }

  const errorStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#dc2626",
    marginTop: "4px",
  }

  const tagInputContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  }

  const tagsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }

  const tagStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    backgroundColor: "#e0e7ff",
    color: "#3730a3",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "500",
  }

  const removeTagButtonStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    border: "none",
    color: "#3730a3",
    cursor: "pointer",
    padding: "0",
    fontSize: "14px",
    fontWeight: "bold",
  }

  const previewStyle: React.CSSProperties = {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "16px",
  }

  const previewTitleStyle: React.CSSProperties = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "12px",
  }

  const previewItemStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #e5e7eb",
  }

  const previewLabelStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
    fontWeight: "500",
  }

  const previewValueStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#111827",
  }

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    paddingTop: "16px",
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
          Back to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={containerStyle}>
          <div style={headerTextStyle}>
            <h1 style={titleStyle}>Create New Task</h1>
            <p style={subtitleStyle}>
              Create a new task and assign it to team members to track progress and collaborate effectively.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={formStyle}>
            <PureCard>
              <CardContent>
                <h2
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
                <div style={formGroupStyle}>
                  <PureLabel htmlFor="title">Task Title *</PureLabel>
                  <PureInput
                    id="title"
                    placeholder="Enter a clear and descriptive task title..."
                    value={formData.title}
                    onChange={(e: { target: { value: string } }) => handleInputChange("title", e.target.value)}
                    style={{ borderColor: errors.title ? "#dc2626" : undefined }}
                  />
                  {errors.title && <div style={errorStyle}>{errors.title}</div>}
                </div>

                {/* Description */}
                <div style={formGroupStyle}>
                  <PureLabel htmlFor="description">Description *</PureLabel>
                  <PureTextarea
                    id="description"
                    placeholder="Provide detailed information about the task, requirements, and expected outcomes..."
                    value={formData.description}
                    onChange={(e: { target: { value: string } }) => handleInputChange("description", e.target.value)}
                    rows={4}
                    style={{ borderColor: errors.description ? "#dc2626" : undefined }}
                  />
                  {errors.description && <div style={errorStyle}>{errors.description}</div>}
                </div>

                {/* Team and Assignee */}
                <div style={gridStyle}>
                  <div style={formGroupStyle}>
                    <PureLabel>Team *</PureLabel>
                    <PureSelect
                      value={formData.teamId}
                      onValueChange={(value: string) => handleInputChange("teamId", value)}
                      options={teams}
                      placeholder="Select team"
                      style={{ borderColor: errors.teamId ? "#dc2626" : undefined }}
                    />
                    {errors.teamId && <div style={errorStyle}>{errors.teamId}</div>}
                  </div>

                  <div style={formGroupStyle}>
                    <PureLabel>Assignee</PureLabel>
                    <PureSelect
                      value={formData.assigneeId}
                      onValueChange={(value: string) => handleInputChange("assigneeId", value)}
                      options={[{ value: "", label: "Unassigned" }, ...users]}
                      placeholder="Select assignee"
                    />
                  </div>
                </div>

                {/* Priority and Status */}
                <div style={gridStyle}>
                  <div style={formGroupStyle}>
                    <PureLabel>Priority</PureLabel>
                    <PureSelect
                      value={formData.priority}
                      onValueChange={(value: string) => handleInputChange("priority", value)}
                      options={priorities}
                      placeholder="Select priority"
                    />
                  </div>

                  <div style={formGroupStyle}>
                    <PureLabel>Status</PureLabel>
                    <PureSelect
                      value={formData.status}
                      onValueChange={(value: string) => handleInputChange("status", value)}
                      options={statuses}
                      placeholder="Select status"
                    />
                  </div>
                </div>

                {/* Due Date */}
                <div style={formGroupStyle}>
                  <PureLabel htmlFor="dueDate">Due Date</PureLabel>
                  <PureInput
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e: { target: { value: string } }) => handleInputChange("dueDate", e.target.value)}
                    style={{ borderColor: errors.dueDate ? "#dc2626" : undefined }}
                  />
                  {errors.dueDate && <div style={errorStyle}>{errors.dueDate}</div>}
                </div>

                {/* Tags */}
                <div style={formGroupStyle}>
                  <PureLabel>Tags</PureLabel>
                  <div style={tagInputContainerStyle}>
                    <PureInput
                      placeholder="Add a tag..."
                      value={formData.currentTag}
                      onChange={(e: { target: { value: string } }) => handleInputChange("currentTag", e.target.value)}
                      onKeyPress={handleKeyPress}
                      style={{ flex: 1 }}
                    />
                    <PureButton type="button" onClick={handleAddTag} variant="outline">
                      <Plus size={16} />
                    </PureButton>
                  </div>
                  {formData.tags.length > 0 && (
                    <div style={tagsContainerStyle}>
                      {formData.tags.map((tag, index) => (
                        <span key={index} style={tagStyle}>
                          {tag}
                          <button type="button" onClick={() => handleRemoveTag(tag)} style={removeTagButtonStyle}>
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </PureCard>

            {/* Task Preview */}
            <PureCard>
              <CardContent>
                <h3 style={previewTitleStyle}>Task Preview</h3>
                <div style={previewStyle}>
                  <div style={previewItemStyle}>
                    <span style={previewLabelStyle}>Title:</span>
                    <span style={previewValueStyle}>{formData.title || "Untitled Task"}</span>
                  </div>
                  <div style={previewItemStyle}>
                    <span style={previewLabelStyle}>Team:</span>
                    <span style={previewValueStyle}>
                      {teams.find((t) => t.value === formData.teamId)?.label || "No team selected"}
                    </span>
                  </div>
                  <div style={previewItemStyle}>
                    <span style={previewLabelStyle}>Assignee:</span>
                    <span style={previewValueStyle}>
                      {users.find((u) => u.value === formData.assigneeId)?.label || "Unassigned"}
                    </span>
                  </div>
                  <div style={previewItemStyle}>
                    <span style={previewLabelStyle}>Priority:</span>
                    <PureBadge style={getPriorityColor(formData.priority)}>{formData.priority}</PureBadge>
                  </div>
                  <div style={previewItemStyle}>
                    <span style={previewLabelStyle}>Status:</span>
                    <PureBadge style={getStatusColor(formData.status)}>
                      {statuses.find((s) => s.value === formData.status)?.label}
                    </PureBadge>
                  </div>
                  {formData.dueDate && (
                    <div style={previewItemStyle}>
                      <span style={previewLabelStyle}>Due Date:</span>
                      <span style={previewValueStyle}>{formData.dueDate}</span>
                    </div>
                  )}
                  {formData.tags.length > 0 && (
                    <div style={previewItemStyle}>
                      <span style={previewLabelStyle}>Tags:</span>
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {formData.tags.map((tag, index) => (
                          <span key={index} style={{ ...tagStyle, fontSize: "10px" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </PureCard>

            {/* Action Buttons */}
            <div style={buttonContainerStyle}>
              <PureButton type="button" variant="outline" onClick={() => window.history.back()}>
                Cancel
              </PureButton>
              <PureButton type="submit" disabled={isCreating} style={{ minWidth: "140px" }}>
                {isCreating ? (
                  <>
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: "2px solid transparent",
                        borderTop: "2px solid white",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                        marginRight: "8px",
                      }}
                    />
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
        </div>
      </main>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </PureSidebar>
  )
}
