import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronDown, LogOut, User, Loader2 } from "lucide-react";

// Import the new stylesheet
import "../styles/PageHeader.css";

// Import custom hooks and services
import { useAuth } from "../hooks/useAuth";
import { apiService } from "../api/apiService";
import { tokenManager } from "../api/tokenManager";

export function PageHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const logoutMutation = useMutation<void, AxiosError>({
        mutationFn: apiService.auth.logout,
        onSuccess: () => {
            tokenManager.deleteToken();
            queryClient.clear();
            navigate('/login');
        },
        onError: (err) => {
            console.error(err)
            tokenManager.deleteToken();
            navigate('/login');
        }
    });

    return (
        <header className="page-header">
            <div className="user-menu">
                <button className="user-menu__button" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    <div className="user-menu__avatar">{user?.username?.charAt(0).toUpperCase()}</div>
                    <span>{user?.username}</span>
                    <ChevronDown size={16} />
                </button>

                {isMenuOpen && (
                    <>
                        <div className="user-menu__overlay" onClick={() => setIsMenuOpen(false)} />
                        <nav className="user-menu__dropdown">
                            <button className="user-menu__dropdown-item">
                                <User size={16} /> Profile
                            </button>
                            <button className="user-menu__dropdown-item" onClick={() => logoutMutation.mutate()} disabled={logoutMutation.isPending}>
                                {logoutMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                                {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
                            </button>
                        </nav>
                    </>
                )}
            </div>
        </header>
    );
}