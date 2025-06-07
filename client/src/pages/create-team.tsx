"use client"

import type React from "react"

import { useState } from "react"
import { Plus, ArrowLeft, X, Mail, UserPlus, Users, Link } from "lucide-react"
import { PureButton } from "../components/pure-button"
import { PureCard, CardContent } from "../components/pure-card"
import { PureLabel } from "../components/pure-form"
import { PureInput } from "../components/pure-input"
import { PureSidebar } from "../components/pure-sidebar"


export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("")
  const [currentEmail, setCurrentEmail] = useState("")
  const [inviteEmails, setInviteEmails] = useState<string[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    if (!currentEmail.trim()) {
      showToast("Please enter an email address")
      return
    }

    if (!isValidEmail(currentEmail)) {
      showToast("Please enter a valid email address")
      return
    }

    if (inviteEmails.includes(currentEmail)) {
      showToast("This email has already been added to the invite list")
      return
    }

    setInviteEmails([...inviteEmails, currentEmail])
    setCurrentEmail("")
    showToast(`Added ${currentEmail} to invite list`)
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setInviteEmails(inviteEmails.filter((email) => email !== emailToRemove))
    showToast(`Removed ${emailToRemove} from invite list`)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      showToast("Please enter a team name")
      return
    }

    setIsCreating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      showToast(`Created "${teamName}" and sent invites to ${inviteEmails.length} members`)

      // Reset form
      setTeamName("")
      setInviteEmails([])
      setCurrentEmail("")
    } catch (error) {
      showToast("Something went wrong. Please try again.")
    } finally {
      setIsCreating(false)
    }
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
    maxWidth: "512px",
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

  const cardHeaderStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
    marginBottom: "24px",
  }

  const formGroupStyle: React.CSSProperties = {
    marginBottom: "24px",
  }

  const emailInputContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  }

  const emailInputWrapperStyle: React.CSSProperties = {
    position: "relative",
    flex: 1,
  }

  const emailIconStyle: React.CSSProperties = {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#6b7280",
  }

  const emailListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    maxHeight: "160px",
    overflowY: "auto",
  }

  const emailItemStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: "8px",
    padding: "12px",
  }

  const emailItemLeftStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  }

  const removeButtonStyle: React.CSSProperties = {
    width: "24px",
    height: "24px",
    padding: 0,
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    color: "#6b7280",
    transition: "all 0.2s ease",
  }

  const emptyStateStyle: React.CSSProperties = {
    textAlign: "center",
    padding: "32px",
    color: "#6b7280",
  }

  const infoBoxStyle: React.CSSProperties = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px",
    marginTop: "16px",
  }

  const infoTitleStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1e40af",
    margin: "0 0 8px 0",
  }

  const infoListStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "#1e40af",
    margin: 0,
    paddingLeft: "16px",
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
        <Link href="/" style={backButtonStyle}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </header>

      {/* Main Content */}
      <main style={mainStyle}>
        <div style={containerStyle}>
          <div style={headerTextStyle}>
            <h1 style={titleStyle}>Create a New Team</h1>
            <p style={subtitleStyle}>
              Start collaborating with your team members by creating a new team and inviting them to join.
            </p>
          </div>

          <PureCard>
            <CardContent>
              <div style={cardHeaderStyle}>
                <UserPlus size={20} />
                Team Details
              </div>

              {/* Team Name */}
              <div style={formGroupStyle}>
                <PureLabel htmlFor="teamName">Team Name</PureLabel>
                <PureInput
                  id="teamName"
                  placeholder="Enter team name..."
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              {/* Invite Members */}
              <div style={formGroupStyle}>
                <PureLabel>Invite Members (email)</PureLabel>

                {/* Email Input */}
                <div style={emailInputContainerStyle}>
                  <div style={emailInputWrapperStyle}>
                    <div style={emailIconStyle}>
                      <Mail size={16} />
                    </div>
                    <PureInput
                      placeholder="Enter email address..."
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

                {/* Email List */}
                {inviteEmails.length > 0 && (
                  <div>
                    <PureLabel style={{ fontSize: "14px", color: "#6b7280", marginBottom: "8px" }}>
                      Invited Members ({inviteEmails.length})
                    </PureLabel>
                    <div style={emailListStyle}>
                      {inviteEmails.map((email, index) => (
                        <div key={index} style={emailItemStyle}>
                          <div style={emailItemLeftStyle}>
                            <Mail size={16} color="#6b7280" />
                            <span style={{ fontSize: "14px" }}>{email}</span>
                          </div>
                          <button
                            style={removeButtonStyle}
                            onClick={() => handleRemoveEmail(email)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#dc2626"
                              e.currentTarget.style.color = "white"
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "transparent"
                              e.currentTarget.style.color = "#6b7280"
                            }}
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {inviteEmails.length === 0 && (
                  <div style={emptyStateStyle}>
                    <Users size={32} color="#9ca3af" style={{ margin: "0 auto 8px" }} />
                    <p style={{ fontSize: "14px", margin: "0 0 4px 0" }}>No members invited yet</p>
                    <p style={{ fontSize: "12px", margin: 0 }}>Add email addresses to invite team members</p>
                  </div>
                )}
              </div>

              {/* Create Button */}
              <div style={{ paddingTop: "16px" }}>
                <PureButton
                  onClick={handleCreateTeam}
                  disabled={!teamName.trim() || isCreating}
                  style={{ width: "100%", padding: "12px 24px", fontSize: "16px" }}
                >
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

              {/* Info */}
              <div style={infoBoxStyle}>
                <h4 style={infoTitleStyle}>What happens next?</h4>
                <ul style={infoListStyle}>
                  <li>Your team will be created and you'll be the owner</li>
                  <li>Invitation emails will be sent to all added members</li>
                  <li>Members can join by clicking the link in their email</li>
                  <li>You can add more members later from the team settings</li>
                </ul>
              </div>
            </CardContent>
          </PureCard>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </PureSidebar>
  )
}
