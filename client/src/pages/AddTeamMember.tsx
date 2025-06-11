"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, UserPlus, Users, Crown, Send, Link, Loader2 } from "lucide-react"
import "../styles/AddTeamMember.css"
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { apiService } from "../api/apiService"
import { PureSidebar } from "../components/pure-sidebar"
import type { TeamMembership } from "../type/api.types"
import { AppLoader } from "../components/app-loader"

const useToast = () => {
  const [toastMessage, setToastMessage] = useState("");
  const showToast = (message: string, duration: number = 3000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), duration);
  };
  return { toastMessage, showToast };
};

export default function AddTeamMemberPage() {
    const { teamName } = useParams<{ teamName: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { toastMessage, showToast } = useToast();
    
    // Simplified form state
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch existing members to display info and prevent duplicates
    const { data: memberships, isLoading } = useQuery<TeamMembership[], AxiosError>({
        queryKey: ['teamMembers', teamName],
        queryFn: () => apiService.teams.getUsersInTeam(teamName!),
        enabled: !!teamName,
    });

    const addMemberMutation = useMutation<void, AxiosError<{ message: string }>, { username: string; teamname: string }>({
        mutationFn: ({ username, teamname }) => apiService.teams.addUserToTeam(username, teamname),
        onSuccess: () => {
            showToast(`User "${email}" added to the team successfully!`);
            // Invalidate the members query to refetch the list
            queryClient.invalidateQueries({ queryKey: ['teamMembers', teamName] });
            setEmail("");
            setErrors({});
        },
        onError: (error) => {
            const message = error.response?.data?.message || "Failed to add user. They may not exist or an error occurred.";
            showToast(message, 5000);
        },
    });

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};
        if (!email.trim()) {
            newErrors.email = "Username or email is required";
        } else if (memberships?.some(m => m.user.username.toLowerCase() === email.toLowerCase())) {
            newErrors.email = "This user is already a team member";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !teamName) return;
        // API expects a username, we are using the email/username from the input field
        addMemberMutation.mutate({ username: email, teamname: teamName });
    };

    // Derive team info from the fetched memberships data
    const team = memberships?.[0]?.team;
    const owner = memberships?.find(m => m.user.id === m.team.owner_user_id)?.user;
    
    if (isLoading) {
        return <PureSidebar><div><AppLoader /></div></PureSidebar>;
    }
    if (!team) {
        return <PureSidebar><div>Team "{teamName}" not found or you do not have access.</div></PureSidebar>;
    }

    return (
        <div className="add-member-page">
            <PureSidebar>
                <div className={`toast ${toastMessage ? "show" : ""}`}>{toastMessage}</div>
                <header className="add-member-header">
                    <Link to={`/team-details/${teamName}`} className="back-button">
                        <ArrowLeft size={16} />
                        Back to {teamName}
                    </Link>
                </header>
                <main className="add-member-main">
                    <section className="page-header">
                        <h1 className="page-title">Add Team Member</h1>
                        <p className="page-subtitle">Invite an existing user to join {teamName}.</p>
                    </section>
                    <section className="team-info-section">
                        <header className="team-info-header"><Users size={20} /><h2 className="team-info-title">Team Information</h2></header>
                        <div className="team-details">
                            <div className="team-detail-item"><span className="team-detail-label">Team Name</span><span className="team-detail-value">{teamName}</span></div>
                            <div className="team-detail-item"><span className="team-detail-label">Owner</span><span className="team-detail-value">{owner?.username || 'N/A'}</span></div>
                            <div className="team-detail-item"><span className="team-detail-label">Current Members</span><span className="team-detail-value">{memberships?.length || 0} members</span></div>
                        </div>
                        <div className="current-members">
                            <h3 className="current-members-title">Current Members</h3>
                            <div className="members-list">
                                {memberships?.map(m => (
                                    <div key={m.id} className="member-item">
                                        <div className="member-avatar">{m.user.username.charAt(0).toUpperCase()}</div>
                                        <span>{m.user.username}</span>
                                        {m.user.id === team.owner_user_id && <Crown size={12} color="#eab308" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                    <section className="add-member-form">
                        <header className="form-header"><UserPlus size={20} /><h2 className="form-title">Add New Member</h2></header>
                        <form onSubmit={handleSubmit}>
                            <fieldset className="form-section">
                                <legend className="section-title">User to Add</legend>
                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">User's Email or Username *</label>
                                    <input type="text" id="email" className={`form-input ${errors.email ? "error" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter username or email..." required />
                                    {errors.email && <div className="error-message">{errors.email}</div>}
                                    <p className="help-text">The user must have an existing account to be added to the team.</p>
                                </div>
                            </fieldset>
                            <div className="form-actions">
                                <Link to={`/team-details/${teamName}`} className="btn btn-secondary">Cancel</Link>
                                <button type="submit" className="btn btn-primary" disabled={addMemberMutation.isPending}>
                                    {addMemberMutation.isPending ? (
                                        <><Loader2 size={16} className="loading-spinner" /> Adding User...</>
                                    ) : (
                                        <><Send size={16} /> Add User to Team</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </section>
                </main>
            </PureSidebar>
        </div>
    );
}
