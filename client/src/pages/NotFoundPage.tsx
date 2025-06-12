"use client"

import { useEffect } from "react"
import { Home, ArrowLeft, Users, ListTodo, Loader2 } from "lucide-react"
import "../styles/NotFound.css"
import { Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiService } from "../api/apiService"
import { useAuth } from "../hooks/useAuth"
import type { TeamMembership } from "../type/api.types"

export default function NotFoundPage() {
    const navigate = useNavigate();
    const { user, roles } = useAuth();
    const canManageTeams = roles.includes('TEAM_LEAD');

    const { data: teamMemberships, isLoading: isLoadingTeams } = useQuery<TeamMembership[], AxiosError>({
        queryKey: ['userTeams', user?.username],
        queryFn: () => apiService.users.getTeamsForUser(user!.username),
        enabled: !!user,
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            // Uncomment to enable auto-redirect after 10 seconds
            // navigate('/');
        }, 10000);

        return () => clearTimeout(timer);
    }, [navigate]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <main className="not-found-container">
            <div className="not-found-content">
                <div className="not-found-icon" aria-hidden="true">404</div>

                <h1 className="not-found-title">Page Not Found</h1>
                <h2 className="not-found-subtitle">Oops! This page doesn't exist.</h2>

                <p className="not-found-description">
                    The page you're looking for might have been moved, deleted, or you entered the wrong URL.
                </p>

                <section className="not-found-actions" aria-label="Primary Actions">
                    <Link to="/dashboard" className="not-found-button not-found-button-primary">
                        <Home size={20} />
                        Go to Dashboard
                    </Link>
                    <button onClick={handleGoBack} className="not-found-button not-found-button-secondary">
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </section>

                <section className="not-found-suggestions" aria-labelledby="suggestions-title">
                    <h3 id="suggestions-title" className="not-found-suggestions-title">Quick Navigation</h3>
                    <nav className="not-found-suggestions-list">
                        <Link to="/dashboard" className="not-found-suggestion-item">
                            <ListTodo className="not-found-suggestion-icon" />
                            View My Tasks
                        </Link>
                        <Link to="/create-task" className="not-found-suggestion-item">
                            <ListTodo className="not-found-suggestion-icon" />
                            Create New Task
                        </Link>
                        {isLoadingTeams ? (
                            <div className="not-found-suggestion-item"><Loader2 className="not-found-suggestion-icon animate-spin" />Loading teams...</div>
                        ) : (
                            teamMemberships?.map(m => (
                                <Link key={m.team.id} to={`/team-details/${m.team.name}`} className="not-found-suggestion-item">
                                    <Users className="not-found-suggestion-icon" />
                                    {m.team.name}
                                </Link>
                            ))
                        )}
                        {canManageTeams && (
                            <Link to="/create-team" className="not-found-suggestion-item">
                                <Users className="not-found-suggestion-icon" />
                                Create New Team
                            </Link>
                        )}
                    </nav>
                </section>

                <footer className="not-found-footer">
                    <p>
                        Still having trouble?{" "}
                        <a href="mailto:support@teamtodo.com" className="not-found-footer-link">
                            Contact Support
                        </a>
                    </p>
                </footer>
            </div>
        </main>
    );
}