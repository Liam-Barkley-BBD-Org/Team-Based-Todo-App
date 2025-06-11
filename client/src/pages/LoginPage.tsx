import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { tokenManager } from "../api/tokenManager";
import "../styles/LoginPage.css";
import { apiService } from "../api/apiService";
import type { TempAuthResponse, LoginPayload, FinalAuthResponse } from "../type/api.types";

const LoginPage: React.FC = () => {
    const [loginStep, setLoginStep] = useState<'credentials' | '2fa'>('credentials');
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";
    

    const loginMutation = useMutation<TempAuthResponse, AxiosError, LoginPayload>({
        mutationFn: apiService.auth.login,
        onSuccess: () => {
            // On success, move to the 2FA step
            setLoginStep('2fa');
        },
    });

    // Mutation for the SECOND step: verifying the 2FA code
    const verify2faMutation = useMutation<FinalAuthResponse, AxiosError, { twoFactorCode: string }>({
        mutationFn: ({ twoFactorCode }) => {
            // The tempToken comes from the successful result of the first mutation
            const tempToken = loginMutation.data?.tempToken;
            if (!tempToken) {
                throw new Error("Temporary session token not found. Please try logging in again.");
            }
            return apiService.auth.verify2fa(twoFactorCode, tempToken);
        },
        onSuccess: (data) => {
            // On final success, store the token and navigate away
            tokenManager.setToken(data.jwt);
            navigate(from, { replace: true });
        },
    });

    // --- Event Handlers ---
    const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!username || !password) return;
        loginMutation.mutate({ username, password });
    };
    
    const handle2faSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (!twoFactorCode) return;
        verify2faMutation.mutate({ twoFactorCode });
    };

    const isLoading = loginMutation.isPending || verify2faMutation.isPending;
    const error = loginMutation.error || verify2faMutation.error;

    return (
        <main className="mainLogin">
            {loginStep === 'credentials' && (
                <>
                    <h1>Login</h1>
                    <form onSubmit={handleLoginSubmit}>
                        <section>
                            <label htmlFor="username">Username:</label><br />
                            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </section>
                        <section className="mainDiv">
                            <label htmlFor="password">Password:</label><br />
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            {password && (
                                <div className="strength-meter">
                                    {/* ... password strength UI ... */}
                                </div>
                            )}
                        </section>
                        <button disabled={isLoading} className="loginButton" type="submit">
                            {isLoading ? "Verifying..." : "Continue"}
                        </button>
                    </form>
                </>
            )}

            {loginStep === '2fa' && (
                <>
                    <h1>Two-Factor Authentication</h1>
                    <p>Enter the code from your authenticator app.</p>
                    <form onSubmit={handle2faSubmit}>
                         <section>
                            <label htmlFor="2fa-code">6-Digit Code:</label><br />
                            <input
                                id="2fa-code"
                                type="text"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                required
                                maxLength={6}
                                pattern="\d{6}"
                                title="Enter a 6-digit code"
                            />
                        </section>
                         <button disabled={isLoading} className="loginButton" type="submit">
                            {isLoading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </>
            )}

            {error && (
                <p className="error-message">
                    {error.response?.data ? (error.response.data as any).message : error.message}
                </p>
            )}
        </main>
    );
};

export default LoginPage;