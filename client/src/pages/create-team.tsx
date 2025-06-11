"use client";

import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, X, Mail, UserPlus, Users, Link, } from "lucide-react";
import { PureButton } from "../components/pure-button";
import { PureCard, CardContent } from "../components/pure-card";
import { PureLabel } from "../components/pure-form";
import { PureInput } from "../components/pure-input";
import { PureSidebar } from "../components/pure-sidebar";
import { useUserRoles } from "../hooks/useUserRoles";
import { hasTeamLeaderRole } from "../utils/roleUtil";

import styles from "../styles/CreateTeamPage.module.css";

interface CreateTeamPageProps {
  userId: string;
}

export default function CreateTeamPage({ userId }: CreateTeamPageProps) {
  const [teamName, setTeamName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [inviteEmails, setInviteEmails] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const { roles, loading, error } = useUserRoles(userId);
  const [isTeamLeader, setIsTeamLeader] = useState(false);

  useEffect(() => {
    if (roles) {
      setIsTeamLeader(hasTeamLeaderRole(roles));
    }
  }, [roles]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    if (!currentEmail.trim()) {
      showToast("Please enter an email address");
      return;
    }

    if (!isValidEmail(currentEmail)) {
      showToast("Please enter a valid email address");
      return;
    }

    if (inviteEmails.includes(currentEmail)) {
      showToast("This email has already been added to the invite list");
      return;
    }

    setInviteEmails([...inviteEmails, currentEmail]);
    setCurrentEmail("");
    showToast(`Added ${currentEmail} to invite list`);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove));
    showToast(`Removed ${emailToRemove} from invite list`);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      showToast("Please enter a team name");
      return;
    }

    setIsCreating(true);

    try {
      // Simulate API call
      const response = await fetch("http://localhost:3000/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          invites: inviteEmails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create team");
      }

      showToast("Team created successfully!");

      setTeamName("");
      setInviteEmails([]);
      setCurrentEmail("");
    } catch (error) {
      showToast("Something went wrong. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) return <p>Loading roles...</p>;
  if (error) return <p>{error}</p>;
  if (!isTeamLeader) {
    return (
      <PureSidebar>
        <div className={styles.accessDenied}>
          <h2>Access Denied</h2>
          <p>You do not have permission to create a team.</p>
        </div>
      </PureSidebar>
    );
  }

  return (
    <PureSidebar>
      {/* Toast Notification */}
      <aside
        role="status"
        aria-live="polite"
        className={`${styles.toast} ${!toastMessage ? styles.toastHidden : ""}`}
      >
        {toastMessage}
      </aside>

      {/* Page Header */}
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
        <section className={styles.container} aria-labelledby="page-title">
          <header className={styles.headerText}>
            <h1 id="page-title" className={styles.title}>Create a New Team</h1>
            <p className={styles.subtitle}>
              Start collaborating with your team members by creating a new team and inviting them to join.
            </p>
          </header>

          <section aria-labelledby="team-details-title">
            <PureCard>
              <CardContent className="">
                <header className={styles.cardHeader}>
                  <UserPlus size={20} />
                  <h2 id="team-details-title" className="sr-only">Team Details</h2>
                  <span>Team Details</span>
                </header>

                {/* Team Name */}
                <div className={styles.formGroup}>
                  <PureLabel htmlFor="teamName">Team Name</PureLabel>
                  <PureInput
                    id="teamName"
                    placeholder="Enter team name..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>

                {/* Invite Members */}
                <fieldset className={styles.formGroup}>
                  <legend className="sr-only">Invite Members</legend>
                  <PureLabel>Invite Members (username)</PureLabel>

                  {/* Username Input */}
                  <div className={styles.emailInputContainer}>
                    <div className={styles.emailInputWrapper}>
                      <PureInput
                        placeholder="Enter username..."
                        value={currentEmail}
                        onChange={(e) => setCurrentEmail(e.target.value)}
                        onKeyPress={handleKeyPress}
                        style={{ paddingLeft: "36px" }}
                      />
                    </div>
                    <PureButton onClick={handleAddEmail} variant="outline">
                      <Plus size={16} style={{ marginRight: "8px" }} />
                      Add
                    </PureButton>
                  </div>

                  {/* Username List */}
                  {inviteEmails.length > 0 ? (
                    <section aria-label="Invited Members">
                      <PureLabel
                        style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}
                      >
                        Invited Members ({inviteEmails.length})
                      </PureLabel>
                      <ul className={styles.emailList}>
                        {inviteEmails.map((email, index) => (
                          <li key={index} className={styles.emailItem}>
                            <div className={styles.emailItemLeft}>
                              <Mail size={16} color="#6b7280" />
                              <span style={{ fontSize: "14px" }}>{email}</span>
                            </div>
                            <button
                              type="button"
                              className={styles.removeButton}
                              onClick={() => handleRemoveEmail(email)}
                            >
                              <X size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </section>
                  ) : (
                    <div className={styles.emptyState} aria-live="polite">
                      <Users
                        size={32}
                        color="#9ca3af"
                        style={{ margin: "0 auto 8px" }}
                      />
                      <p style={{ fontSize: "14px", margin: "0 0 4px 0" }}>
                        No members invited yet
                      </p>
                      <p style={{ fontSize: "12px", margin: 0 }}>
                        Add usernames to invite team members
                      </p>
                    </div>
                  )}
                </fieldset>

                {/* Create Team Button */}
                <div style={{ paddingTop: "16px" }}>
                  <PureButton
                    onClick={handleCreateTeam}
                    disabled={!teamName.trim() || isCreating}
                  >
                    {isCreating ? (
                      <>
                        <div className={styles.spin} />
                        Creating Team...
                      </>
                    ) : (
                      <>
                        <Plus size={16} style={{ marginRight: "8px" }} />
                        Create Team
                      </>
                    )}
                  </PureButton>
                </div>
              </CardContent>
            </PureCard>
          </section>

          {/* Info Box */}
          <aside className={styles.infoBox} aria-labelledby="info-title">
            <p id="info-title" className={styles.infoTitle}>Note:</p>
            <ul className={styles.infoList}>
              <li>Only users with the Team Leader role can create teams.</li>
              <li>
                You can invite members by entering their username and clicking "Add."
              </li>
              <li>
                You can remove invited members by clicking the "X" button next to their username.
              </li>
            </ul>
          </aside>
        </section>
      </main>
    </PureSidebar>
  );
}