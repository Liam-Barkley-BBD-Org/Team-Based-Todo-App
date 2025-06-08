"use client"

import type React from "react"

import { useState } from "react"
import { CheckCircle, Clock, Plus, ArrowLeft, UserPlus, Crown, Link } from "lucide-react"
import { PureAvatar } from "../components/pure-avatar"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import type { Task, Team, User } from "../components/task-detail-modal"
import { TaskDetailModal } from "../components/task-detail-modal"


// Mock data for Team Alpha
const teamData = {
  id: "alpha",
  name: "Team Alpha",
  owner: {
    id: 1,
    name: "Alice",
    avatar: "/placeholder-user.jpg",
    initials: "A",
  },
  members: [
    { id: 1, name: "Alice", avatar: "/placeholder-user.jpg", initials: "A", role: "Owner" },
    { id: 2, name: "Bob", avatar: "/placeholder-user.jpg", initials: "B", role: "Member" },
    { id: 3, name: "Charlie", avatar: "/placeholder-user.jpg", initials: "C", role: "Member" },
  ],
}

const teamTasks: Task[] = [
  {
    id: 1,
    title: "Fix bug login",
    description: "Fix the login redirect loop that occurs after password reset",
    status: "completed",
    priority: "high",
    teamId: "alpha",
    assigneeId: 1,
    createdAt: "2025-06-01",
    createdBy: { id: 1, name: "Alice" },
  },
  {
    id: 2,
    title: "Design new logo",
    description: "Create a new logo for the application that better represents our brand",
    status: "in-progress",
    priority: "medium",
    teamId: "alpha",
    assigneeId: 2,
    createdAt: "2025-06-02",
    createdBy: { id: 1, name: "Alice" },
  },
  {
    id: 3,
    title: "Write docs",
    description: "Write documentation for the new API endpoints",
    status: "open",
    priority: "low",
    teamId: "alpha",
    assigneeId: null,
    createdAt: "2025-06-03",
    createdBy: { id: 3, name: "Charlie" },
  },
  {
    id: 4,
    title: "Setup CI/CD pipeline",
    description: "Configure GitHub Actions for continuous integration and deployment",
    status: "open",
    priority: "high",
    teamId: "alpha",
    assigneeId: 3,
    createdAt: "2025-06-04",
    createdBy: { id: 2, name: "Bob" },
  },
  {
    id: 5,
    title: "Code review",
    description: "Review pull request #42 for the new authentication flow",
    status: "in-progress",
    priority: "medium",
    teamId: "alpha",
    assigneeId: 1,
    createdAt: "2025-06-05",
    createdBy: { id: 1, name: "Alice" },
  },
]

const teams: Team[] = [
  { id: "alpha", name: "Team Alpha" },
  { id: "beta", name: "Team Beta" },
]

const users: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
]

export default function TeamView() {
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(teamTasks)
  const [statusFilter, setStatusFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [sortBy, setSortBy] = useState("created")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  // Apply filters and sorting
  const applyFiltersAndSort = () => {
    let filtered = [...teamTasks]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter)
    }

    // Apply user filter
    if (userFilter !== "all") {
      if (userFilter === "unassigned") {
        filtered = filtered.filter((task) => !task.assigneeId)
      } else {
        filtered = filtered.filter((task) => {
          const user = users.find((u) => u.id === task.assigneeId)
          return user?.name === userFilter
        })
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return (
            priorityOrder[b.priority as keyof typeof priorityOrder] -
            priorityOrder[a.priority as keyof typeof priorityOrder]
          )
        case "assignee":
          const aName = users.find((u) => u.id === a.assigneeId)?.name || "Unassigned"
          const bName = users.find((u) => u.id === b.assigneeId)?.name || "Unassigned"
          return aName.localeCompare(bName)
        case "status":
          return a.status.localeCompare(b.status)
        default: // created
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    setFilteredTasks(filtered)
  }

  // Apply filters whenever filter values change
  useState(() => {
    applyFiltersAndSort()
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle size={20} color="#059669" />
      case "in-progress":
        return <Clock size={20} color="#f59e0b" />
      default:
        return <Clock size={20} color="#9ca3af" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "in-progress":
        return "In Progress"
      default:
        return "Open"
    }
  }

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return <PureBadge variant={variants[priority as keyof typeof variants]}>{priority}</PureBadge>
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleSaveTask = (updatedTask: Task) => {
    const taskIndex = teamTasks.findIndex((t) => t.id === updatedTask.id)
    if (taskIndex !== -1) {
      teamTasks[taskIndex] = updatedTask
      applyFiltersAndSort()
      showToast(`Successfully updated "${updatedTask.title}"`)
    }
    setIsTaskModalOpen(false)
  }

  const handleDeleteTask = (taskId: number) => {
    const taskIndex = teamTasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      const taskTitle = teamTasks[taskIndex].title
      teamTasks.splice(taskIndex, 1)
      applyFiltersAndSort()
      showToast(`Successfully deleted "${taskTitle}"`)
    }
    setIsTaskModalOpen(false)
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
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  }

  const teamHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  }

  const teamTitleStyle: React.CSSProperties = {
    fontSize: "24px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const ownerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#6b7280",
  }

  const membersStyle: React.CSSProperties = {
    marginTop: "12px",
  }

  const memberListStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "12px",
  }

  const memberItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "8px 12px",
  }

  const tasksHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }

  const filtersStyle: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  }

  const taskListStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    overflow: "hidden",
  }

  const taskItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderBottom: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  }

  const taskContentStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  }

  const taskDetailsStyle: React.CSSProperties = {
    flex: 1,
  }

  const taskTitleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px",
  }

  const taskMetaStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#6b7280",
  }

  const emptyStateStyle: React.CSSProperties = {
    padding: "32px",
    textAlign: "center",
    color: "#6b7280",
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

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "open", label: "Open" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ]

  const userOptions = [
    { value: "all", label: "All Users" },
    { value: "unassigned", label: "Unassigned" },
    ...teamData.members.map((member) => ({ value: member.name, label: member.name })),
  ]

  const sortOptions = [
    { value: "created", label: "Created Date" },
    { value: "priority", label: "Priority" },
    { value: "status", label: "Status" },
    { value: "assignee", label: "Assignee" },
  ]

  return (
    <PureSidebar>
      {/* Toast */}
      <div style={toastStyle}>{toastMessage}</div>

      {/* Header */}
      <header style={headerStyle}>
        <Link href="/" style={backButtonStyle}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        {/* Team Header */}
        <PureCard>
          <CardContent>
            <div style={teamHeaderStyle}>
              <div>
                <h1 style={teamTitleStyle}>Team: {teamData.name}</h1>
                <div style={ownerStyle}>
                  <Crown size={16} />
                  <span>Owner: {teamData.owner.name}</span>
                </div>
              </div>
              <PureButton>
                <UserPlus size={16} style={{ marginRight: "8px" }} />
                Add Member
              </PureButton>
            </div>
            <div style={membersStyle}>
              <h3 style={{ fontSize: "16px", fontWeight: "500", margin: "0 0 12px 0" }}>Members:</h3>
              <div style={memberListStyle}>
                {teamData.members.map((member) => (
                  <div key={member.id} style={memberItemStyle}>
                    <PureAvatar src={member.avatar} alt={member.name} fallback={member.initials} size={24} />
                    <span style={{ fontSize: "14px" }}>{member.name}</span>
                    {member.role === "Owner" && <Crown size={12} color="#eab308" />}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </PureCard>

        {/* Tasks Section */}
        <div>
          <div style={tasksHeaderStyle}>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "#111827", margin: 0 }}>Tasks</h2>
            <PureButton>
              <Plus size={16} style={{ marginRight: "8px" }} />
              Add Task
            </PureButton>
          </div>

          {/* Filters and Sort */}
          <div style={filtersStyle}>
            <PureSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
              style={{ width: "140px" }}
            />

            <PureSelect
              value={userFilter}
              onValueChange={setUserFilter}
              options={userOptions}
              style={{ width: "140px" }}
            />

            <PureSelect value={sortBy} onValueChange={setSortBy} options={sortOptions} style={{ width: "120px" }} />
          </div>

          {/* Task List */}
          <PureCard>
            <div style={taskListStyle}>
              {filteredTasks.map((task, index) => (
                <div
                  key={task.id}
                  style={{
                    ...taskItemStyle,
                    borderBottom: index === filteredTasks.length - 1 ? "none" : "1px solid #e5e7eb",
                  }}
                  onClick={() => handleTaskClick(task)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f9fafb"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  <div style={taskContentStyle}>
                    {getStatusIcon(task.status)}
                    <div style={taskDetailsStyle}>
                      <div style={taskTitleStyle}>
                        <span style={{ fontSize: "16px", fontWeight: "500" }}>{task.title}</span>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div style={taskMetaStyle}>
                        {task.assigneeId ? (
                          <span>Assigned: {users.find((u) => u.id === task.assigneeId)?.name}</span>
                        ) : (
                          <span style={{ color: "#f59e0b" }}>Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: "14px", color: "#6b7280" }}>{getStatusText(task.status)}</div>
                </div>
              ))}

              {filteredTasks.length === 0 && <div style={emptyStateStyle}>No tasks found matching your filters.</div>}
            </div>
          </PureCard>
        </div>

        {/* Task Detail Modal */}
        <TaskDetailModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          teams={teams}
          users={users}
        />
      </main>
    </PureSidebar>
  )
}
