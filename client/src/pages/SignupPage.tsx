import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, UserPlus, Check } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { apiService } from '../api/apiService';
import type { RegisterResponse, RegisterPayload } from '../type/api.types';

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState<any>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const registerMutation = useMutation<RegisterResponse, AxiosError<{ message: string }>, RegisterPayload>({
        mutationFn: apiService.auth.register,
        onSuccess: (data) => {
           
            const params = new URLSearchParams();
            params.append('token', data.token);

            navigate(`/setup-2fa?${params.toString()}`);
        },
    });
    useEffect(() => {
        if (formData.password) {
            const result = zxcvbn(formData.password);
            setPasswordStrength(result);
        } else {
            setPasswordStrength(null);
        }
    }, [formData.password]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const apiError = registerMutation.error?.response?.data?.message || registerMutation.error?.message;


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        registerMutation.mutate({ username: formData.username, password: formData.password });
    };

    const getStrengthColor = (score: number) => {
        const colors = [
            'bg-red-500',
            'bg-orange-500',
            'bg-yellow-500',
            'bg-lime-500',
            'bg-green-500'
        ];
        return colors[score] || 'bg-gray-200';
    };

    const getStrengthText = (score: number) => {
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return texts[score] || '';
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <section className="w-full max-w-md" aria-labelledby="signup-title">
                {/* Header */}
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-4 shadow-lg">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h1 id="signup-title" className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
                    <p className="text-gray-600">Sign up to get started with your new account</p>
                </header>

                {/* Signup Form */}
                <article className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6" aria-label="Signup form">
                        {/* Username */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                                    placeholder="Choose a username"
                                    aria-invalid={!!errors.username}
                                    aria-describedby={errors.username ? "username-error" : undefined}
                                />
                                {formData.username.length >= 3 && !errors.username && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.username && (
                                <p id="username-error" className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                                    placeholder="Create a strong password"
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? "password-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                            </div>

                            {/* Password Strength */}
                            {passwordStrength && (
                                <div className="mt-3" aria-live="polite">
                                    <div className="flex space-x-1 mb-2" role="presentation">
                                        {[0, 1, 2, 3, 4].map(index => (
                                            <div
                                                key={index}
                                                className={`h-2 flex-1 rounded-full transition-all duration-300 ${index <= passwordStrength.score
                                                    ? getStrengthColor(passwordStrength.score)
                                                    : 'bg-gray-200'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center text-xs">
                                        <span
                                            className={`font-medium ${passwordStrength.score >= 3
                                                ? 'text-green-600'
                                                : passwordStrength.score >= 2
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'
                                                }`}
                                        >
                                            {getStrengthText(passwordStrength.score)}
                                        </span>
                                        {passwordStrength.feedback.warning && (
                                            <span className="text-gray-500 text-right max-w-xs">
                                                {passwordStrength.feedback.warning}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                                    placeholder="Confirm your password"
                                    aria-invalid={!!errors.confirmPassword}
                                    aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-green-600 transition-colors"
                                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                </button>
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <div className="absolute inset-y-0 right-8 pr-3 flex items-center">
                                        <Check className="h-5 w-5 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {errors.confirmPassword && (
                                <p id="confirmPassword-error" className="mt-2 text-sm text-red-600 flex items-center">
                                    <span className="w-4 h-4 mr-1">⚠</span>
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>
                        {apiError && <p className="text-sm text-red-600 text-center">{apiError}</p>}

                        <button type="submit" disabled={registerMutation.isPending} className="w-full ...">
                            {registerMutation.isPending ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <footer className="mt-8 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                            >
                                Sign in
                            </Link>
                        </p>
                    </footer>
                </article>
            </section>
        </main>
    );
};

export default SignupPage;