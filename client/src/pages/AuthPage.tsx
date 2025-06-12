import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

// Import our API service and token manager
import { tokenManager } from "../api/tokenManager";

// Import the two child page components (we'll create/update these next)
import LoginPage from "./LoginPage";
import TwoFactorPage from "./TwoFactorPage";
import { apiService } from "../api/apiService";
import type { TempAuthResponse, LoginPayload, FinalAuthResponse } from "../type/api.types";

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/dashboard";

    const [authStep, setAuthStep] = useState<'login' | '2fa'>('login');
    const [tempToken, setTempToken] = useState<string | null>(null);
    const [username, setUsername] = useState("");


    const loginMutation = useMutation<TempAuthResponse, AxiosError<{ message: string }>, { payload: LoginPayload }>({
        mutationFn: ({ payload }) => {
            setUsername(payload.username);
            return apiService.auth.login(payload);
        },
        onSuccess: (data) => {
            if (data.needs2FASetup) {
                const params = new URLSearchParams();
                params.append('token', data.token);
                navigate(`/setup-2fa?${params.toString()}`);
            } else {
                setTempToken(data.token);
                setAuthStep('2fa');
            }
        },
    });

    const verify2faMutation = useMutation<FinalAuthResponse, AxiosError<{ message: string }>, { code: string }>({
        mutationFn: ({ code }) => {
            if (!tempToken) {
                throw new Error("Temporary session token not found. Please try logging in again.");
            }
            return apiService.auth.verify2fa(code, tempToken);
        },
        onSuccess: (data) => {
            
            if (data.success) {
                localStorage.setItem('username', username);
                tokenManager.setToken(data.token);
            } else {
                throw new Error("Invalid 2FA code");
            }

            
        },
        onError: () => {

        }
    });


    if (authStep === 'login') {
        return (
            <LoginPage
                isLoading={loginMutation.isPending}
                error={loginMutation.error?.response?.data?.message || loginMutation.error?.message}
                onSubmit={(formData) => loginMutation.mutate({
                    payload: {
                        username: formData.username,
                        password: formData.password
                    }
                })}
            />
        );
    }

    if (authStep === '2fa') {
        return (
            <TwoFactorPage
                isLoading={verify2faMutation.isPending}
                isSuccess={verify2faMutation.isSuccess}
                isError={verify2faMutation.isError}
                error={verify2faMutation.error?.response?.data?.message || verify2faMutation.error?.message}
                onSubmit={(code) => verify2faMutation.mutate({ code })}
                onBackToLogin={() => {
                    loginMutation.reset();
                    verify2faMutation.reset();
                    setAuthStep('login');
                }}
                onSuccessContinue={() => navigate(from, { replace: true })}
            />
        );
    }

    return null;
}