"use client"

import type React from "react"

import { useState } from "react"
import { Clock, History, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { PureBadge } from "./pure-badge"
import { PureButton } from "./pure-button"
import { PureTextarea } from "./pure-form"
import { PureModal, PureAlertModal } from "./pure-modal"
import { PureSelect } from "./pure-select"
import { PureSeparator } from "./pure-separator"


// Types
export type TaskStatus = "open" | "in-progress" | "completed"

export type TaskPriority = "low" | "medium" | "high"

export type Team = {
  id: string
  name: string
}

export type User = {
  id: number
  name: string
}

export type Task = {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  teamId: string
  assigneeId: number | null
  createdAt: string
  createdBy: User
}

interface TaskDetailModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task) => void
  onDelete: (taskId: number) => void
  teams: Team[]
  users: User[]
}

export function TaskDetailModal({ task, isOpen, onClose, onSave, onDelete, teams, users }: TaskDetailModalProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(task)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useState(() => {
    setEditedTask(task)
  })

  if (!task || !editedTask) return null

  const handleSave = () => {
    if (editedTask) {
      onSave(editedTask)
    }
  }

  const handleDelete = () => {
    onDelete(task.id)
    setDeleteDialogOpen(false)
  }

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd")
    } catch (e) {
      return dateString
    }
  }

  const getStatusBadge = (status: TaskStatus) => {
    const variants = {
      open: "secondary",
      "in-progress": "default",
      completed: "success",
    } as const

    const labels = {
      open: "Open",
      "in-progress": "In Progress",
      completed: "Completed",
    }

    return <PureBadge variant={variants[status]}>{labels[status]}</PureBadge>
  }

  const getPriorityBadge = (priority: TaskPriority) => {
    const variants = {
      low: "secondary",
      medium: "default",
      high: "destructive",
    } as const

    return <PureBadge variant={variants[priority]}>{priority}</PureBadge>
  }

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "16px",
  }

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "8px",
  }

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  }

  const badgeContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    paddingTop: "8px",
  }

  const footerStyle: React.CSSProperties = {
    display: "flex",
    gap: "12px",
    justifyContent: "space-between",
    marginTop: "24px",
  }

  const teamOptions = teams.map((team) => ({ value: team.id, label: team.name }))
  const userOptions = [
    { value: "unassigned", label: "Unassigned" },
    ...users.map((user) => ({ value: user.id.toString(), label: user.name })),
  ]
  const statusOptions = [
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ]
  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ]

  return (
    <>
      <PureModal
        isOpen={isOpen}
        onClose={onClose}
        title={editedTask.title}
      // description=
      // description={
      //   <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      //     <Clock size={12} />
      //     Created on {formatDate(editedTask.createdAt)} by {editedTask.createdBy.name}
      //   </div>
      // }
      >
        <div style={formGroupStyle}>
          <label style={labelStyle} htmlFor="description">
            Description
          </label>
          <PureTextarea
            id="description"
            value={editedTask.description}
            onChange={(e: { target: { value: any } }) => handleChange("description", e.target.value)}
            rows={4}
          />
        </div>

        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="team">
              Team
            </label>
            <PureSelect
              value={editedTask.teamId}
              onValueChange={(value: any) => handleChange("teamId", value)}
              options={teamOptions}
              placeholder="Select team"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="assignee">
              Assigned To
            </label>
            <PureSelect
              value={editedTask.assigneeId?.toString() || "unassigned"}
              onValueChange={(value: string) =>
                handleChange("assigneeId", value === "unassigned" ? null : Number.parseInt(value))
              }
              options={userOptions}
              placeholder="Unassigned"
            />
          </div>
        </div>

        <div style={gridStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="status">
              Status
            </label>
            <PureSelect
              value={editedTask.status}
              onValueChange={(value: string) => handleChange("status", value as TaskStatus)}
              options={statusOptions}
              placeholder="Select status"
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle} htmlFor="priority">
              Priority
            </label>
            <PureSelect
              value={editedTask.priority}
              onValueChange={(value: string) => handleChange("priority", value as TaskPriority)}
              options={priorityOptions}
              placeholder="Select priority"
            />
          </div>
        </div>

        <div style={badgeContainerStyle}>
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Current Status:</span>
            {getStatusBadge(editedTask.status)}
          </div>
          <PureSeparator orientation="vertical" />
          <div style={{ display: "flex", gap: "8px" }}>
            <span style={{ fontSize: "14px", fontWeight: "500" }}>Priority:</span>
            {getPriorityBadge(editedTask.priority)}
          </div>
        </div>

        <PureButton variant="outline" style={{ width: "100%", marginTop: "16px" }}>
          <History size={16} style={{ marginRight: "8px" }} />
          View Snapshot History
        </PureButton>

        <div style={footerStyle}>
          <PureButton variant="secondary" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 size={16} style={{ marginRight: "8px" }} />
            Delete Task
          </PureButton>

          <PureButton onClick={handleSave}>Save Changes</PureButton>
        </div>
      </PureModal>

      <PureAlertModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Are you absolutely sure?"
        description={`This action cannot be undone. This will permanently delete the task "${task.title}" and remove it from the database.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  )
}
