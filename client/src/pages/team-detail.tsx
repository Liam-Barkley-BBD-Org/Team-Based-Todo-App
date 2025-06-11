"use client"


import { ArrowLeft, CheckCircle, Clock, Crown, Link, Plus, UserPlus } from "lucide-react"
import { useState } from "react"
import { PureAvatar } from "../components/pure-avatar"
import { PureBadge } from "../components/pure-badge"
import { PureButton } from "../components/pure-button"
import { CardContent, PureCard } from "../components/pure-card"
import { PureSelect } from "../components/pure-select"
import { PureSidebar } from "../components/pure-sidebar"
import type { Task, Team, User } from "../components/task-detail-modal"
import { TaskDetailModal } from "../components/task-detail-modal"
import styles from "../styles/TeamView.module.css"


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
      <div
        role="status"
        className={`${styles.toast} ${toastMessage ? styles.show : ""}`}
      >
        {toastMessage}
      </div>

      {/* Header */}
      <header className={styles.header}>
        <nav aria-label="Back navigation">
          <Link href="/" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        {/* Team Header */}
        <section aria-labelledby="team-title">
          <PureCard>
            <CardContent className="">
              <header className={styles.teamHeader}>
                <div>
                  <h1 id="team-title" className={styles.teamTitle}>
                    Team: {teamData.name}
                  </h1>
                  <div className={styles.owner}>
                    <Crown size={16} />
                    <span>Owner: {teamData.owner.name}</span>
                  </div>
                </div>
                <PureButton>
                  <UserPlus size={16} style={{ marginRight: 8 }} />
                  Add Member
                </PureButton>
              </header>

              <section aria-labelledby="team-members" className={styles.members}>
                <h2
                  id="team-members"
                  style={{ fontSize: 16, fontWeight: 500, margin: "0 0 12px 0" }}
                >
                  Members:
                </h2>
                <ul className={styles.memberList}>
                  {teamData.members.map((member) => (
                    <li key={member.id} className={styles.memberItem}>
                      <PureAvatar
                        src={member.avatar}
                        alt={member.name}
                        fallback={member.initials}
                        size={24}
                      />
                      <span style={{ fontSize: 14 }}>{member.name}</span>
                      {member.role === "Owner" && <Crown size={12} color="#eab308" />}
                    </li>
                  ))}
                </ul>
              </section>
            </CardContent>
          </PureCard>
        </section>

        {/* Tasks Section */}
        <section aria-labelledby="task-section">
          <header className={styles.tasksHeader}>
            <h2
              id="task-section"
              style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: 0 }}
            >
              Tasks
            </h2>
            <PureButton>
              <Plus size={16} style={{ marginRight: 8 }} />
              Add Task
            </PureButton>
          </header>

          {/* Filters */}
          <section aria-label="Task Filters" className={styles.filters}>
            <PureSelect
              value={statusFilter}
              onValueChange={setStatusFilter}
              options={statusOptions}
              style={{ width: 140 }}
            />
            <PureSelect
              value={userFilter}
              onValueChange={setUserFilter}
              options={userOptions}
              style={{ width: 140 }}
            />
            <PureSelect
              value={sortBy}
              onValueChange={setSortBy}
              options={sortOptions}
              style={{ width: 120 }}
            />
          </section>

          {/* Task List */}
          <PureCard>
            <section aria-label="Task List" className={styles.taskList}>
              {filteredTasks.length === 0 && (
                <p className={styles.emptyState}>No tasks found matching your filters.</p>
              )}
              {filteredTasks.map((task, index) => (
                <article
                  key={task.id}
                  className={`${styles.taskItem} ${index === filteredTasks.length - 1 ? styles.taskItemLast : ""
                    }`}
                  onClick={() => handleTaskClick(task)}
                  onMouseEnter={(e) =>
                    e.currentTarget.classList.add(styles.taskItemHover)
                  }
                  onMouseLeave={(e) =>
                    e.currentTarget.classList.remove(styles.taskItemHover)
                  }
                >
                  <div className={styles.taskContent}>
                    {getStatusIcon(task.status)}
                    <div className={styles.taskDetails}>
                      <div className={styles.taskTitle}>
                        <span className={styles.taskTitleText}>{task.title}</span>
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className={styles.taskMeta}>
                        {task.assigneeId ? (
                          <span>Assigned: {users.find((u) => u.id === task.assigneeId)?.name}</span>
                        ) : (
                          <span className={styles.unassigned}>Unassigned</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: "#6b7280" }}>{getStatusText(task.status)}</div>
                </article>
              ))}
            </section>
          </PureCard>
        </section>
      </main>

      {/* Task Detail Modal */}
      {isTaskModalOpen && selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={true}
          teams={teams}
          users={users}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </PureSidebar>
  )
}