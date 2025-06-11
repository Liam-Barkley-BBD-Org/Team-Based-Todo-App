"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, FileText, Save } from "lucide-react";
import { PureBadge } from "../components/pure-badge";
import { PureButton } from "../components/pure-button";
import { PureCard, CardContent } from "../components/pure-card";
import { PureLabel, PureTextarea } from "../components/pure-form";
import { PureInput } from "../components/pure-input";
import { PureSelect } from "../components/pure-select";
import { PureSidebar } from "../components/pure-sidebar";
import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/CreateTaskPage.module.css";
import { API_URL } from "../utils/hiddenGlobals";

interface OptionType {
  value: string;
  label: string;
}

export default function CreateTaskPage() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [teams, setTeams] = useState<OptionType[]>([]);
  const [users, setUsers] = useState<OptionType[]>([]);

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
  });

  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        const teamData = await teamRes.json();
        setTeams(teamData.map((t: any) => ({ value: t.teamname, label: t.teamname })));

        const allUsers: any[] = [];
        for (const team of teamData) {
          const userRes = await fetch(`${API_URL}/api/team_members/team/${team.teamname}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const members = await userRes.json();
          allUsers.push(...members);
        }

        const uniqueUsers = Array.from(new Map(allUsers.map(u => [u.username, u])).values());
        setUsers(uniqueUsers.map(u => ({ value: u.username, label: u.username })));

      } catch (err) {
        console.error("Failed to fetch teams or users.", err);
      }
    };

    fetchData();
  }, [username, token]);

  const showToast = (message: string, _type: "success" | "error" = "success") => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Task title is required";
    if (!formData.description.trim()) newErrors.description = "Task description is required";
    if (!formData.teamId) newErrors.teamId = "Please select a team";

    if (formData.dueDate) {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) newErrors.dueDate = "Due date cannot be in the past";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        created_at: new Date().toISOString(),
        created_by_username: username,
        teamname: formData.teamId,
        assigned_to_username: formData.assigneeId || null,
      };

      const res = await fetch(`${API_URL}/api/todos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create task");

      showToast(`Task \"${formData.title}\" created successfully!`);
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
      });
    } catch (error) {
      showToast("Failed to create task. Please try again.", "error");
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return { backgroundColor: "#dcfce7", color: "#166534" };
      case "in-progress": return { backgroundColor: "#dbeafe", color: "#1e40af" };
      case "open":
      default: return { backgroundColor: "#f3f4f6", color: "#6b7280" };
    }
  };

  if (!isClient) return <div>Loading...</div>;

  return (
    <PureSidebar>
      <aside role="status" aria-live="polite" className={`${styles.toast} ${toastMessage ? "" : styles.toastHidden}`}>{toastMessage}</aside>
      <header className={styles.header}>
        <nav aria-label="Back navigation">
          <Link to="/dashboard" className={styles.backButton}>
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </nav>
      </header>

      <main className={styles.main}>
        <section className={styles.container} aria-labelledby="create-task-heading">
          <header className={styles.headerText}>
            <h1 id="create-task-heading" className={styles.title}>Create New Task</h1>
            <p className={styles.subtitle}>Create a new task and assign it to team members to track progress and collaborate effectively.</p>
          </header>

          <form onSubmit={handleSubmit} className={styles.form}>
            <section aria-labelledby="task-details-heading">
              <PureCard>
                <CardContent className="">
                  <h2 id="task-details-heading" className={styles.sectionHeading}><FileText size={20} /> Task Details</h2>

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

                  <fieldset className={styles.grid}>
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
                </CardContent>
              </PureCard>
            </section>

            <div className={styles.buttonContainer}>
              <PureButton type="button" variant="outline" onClick={() => window.history.back()}>Cancel</PureButton>
              <PureButton type="submit" disabled={isCreating} style={{ minWidth: "140px" }}>
                {isCreating ? (<><div className={styles.creatingSpinner} /> Creating...</>) : (<><Save size={16} style={{ marginRight: "8px" }} /> Create Task</>)}
              </PureButton>
            </div>
          </form>
        </section>
      </main>
    </PureSidebar>
  );
}
