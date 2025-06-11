import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value);
        // Clear error when user starts typing
        if (errors.username) {
            setErrors(prev => ({ ...prev, username: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        } else if (username.length < 3) {
            newErrors.username = 'Please enter a valid username';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // // Simulate API call
        // setTimeout(() => {
        //     setIsLoading(false);
        //     setIsSuccess(true);
        //     console.log('Password reset request for:', username);
        //     // Handle password reset logic here
        // }, 2000);
    };

    const handleBackToLogin = () => {
        setIsSuccess(false);
        setUsername('');
        setErrors({});
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <section className="w-full max-w-md" aria-labelledby="reset-password-title">
                {/* Back to Login */}
                <nav className="mb-6" aria-label="Back navigation">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to login
                    </Link>
                </nav>

                {!isSuccess ? (
                    <>
                        {/* Header */}
                        <header className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-2xl mb-4 shadow-lg">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h1 id="reset-password-title" className="text-3xl font-bold text-gray-900 mb-2">
                                Reset password
                            </h1>
                            <p className="text-gray-600">
                                Enter your username and we'll send you instructions to reset your password
                            </p>
                        </header>

                        {/* Reset Form */}
                        <article className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6" aria-label="Password reset form">
                                {/* Username Field */}
                                <div>
                                    <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Username
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={username}
                                            onChange={handleInputChange}
                                            className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'}`}
                                            placeholder="Enter your username"
                                            aria-invalid={!!errors.username}
                                            aria-describedby={errors.username ? "username-error" : undefined}
                                        />
                                    </div>
                                    {errors.username && (
                                        <p id="username-error" className="mt-2 text-sm text-red-600 flex items-center">
                                            <span className="w-4 h-4 mr-1">⚠</span>
                                            {errors.username}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Sending instructions...
                                        </div>
                                    ) : (
                                        'Send Reset Instructions'
                                    )}
                                </button>
                            </form>

                            {/* Additional Help */}
                            <aside className="mt-6 p-4 bg-gray-50 rounded-xl" aria-label="Additional help">
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Need help?</strong>
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                                    <li>Make sure you enter the correct username</li>
                                    <li>Check your email (including spam folder)</li>
                                    <li>Contact support if you don't receive instructions</li>
                                </ul>
                            </aside>
                        </article>
                    </>
                ) : (
                    // Success State
                    <article
                        className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
                        aria-labelledby="success-title"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>

                        <h2 id="success-title" className="text-2xl font-bold text-gray-900 mb-4">
                            Instructions sent!
                        </h2>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            We've sent password reset instructions to the email associated with the username{' '}
                            <span className="font-semibold text-gray-900">{username}</span>.
                        </p>

                        <section
                            className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left"
                            aria-label="Next steps"
                        >
                            <p className="text-sm text-blue-800">
                                <strong>What's next?</strong>
                            </p>
                            <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                                <li>Check your email inbox</li>
                                <li>Click the reset link in the email</li>
                                <li>Create your new password</li>
                                <li>Sign in with your new password</li>
                            </ol>
                        </section>

                        <div className="space-y-3">
                            <button
                                onClick={handleBackToLogin}
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                            >
                                Back to Login
                            </button>

                            <p className="text-sm text-gray-500">
                                Didn't receive the email?{' '}
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                                >
                                    Try again
                                </button>
                            </p>
                        </div>
                    </article>
                )}
            </section>
        </main>
    );
};

export default ResetPasswordPage;