import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';

const TwoFactorPage: React.FC = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Timer for resend functionality
    useEffect(() => {
        if (timeLeft > 0 && !canResend) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0) {
            setCanResend(true);
        }
    }, [timeLeft, canResend]);

    const handleInputChange = (index: number, value: string) => {
        // Only allow numbers
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1); // Only take the last character
        setCode(newCode);

        // Clear error when user starts typing
        if (error) setError('');

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        // Handle backspace
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }

        // Handle paste
        if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').slice(0, 6);
                const newCode = [...code];
                for (let i = 0; i < 6; i++) {
                    newCode[i] = digits[i] || '';
                }
                setCode(newCode);

                // Focus the next empty input or the last one
                const nextEmptyIndex = newCode.findIndex(digit => !digit);
                const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
                inputRefs.current[focusIndex]?.focus();
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const fullCode = code.join('');
        if (fullCode.length !== 6) {
            setError('Please enter the complete 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        // // Simulate API call
        // setTimeout(() => {
        //     setIsLoading(false);

        //     // Simulate success/failure
        //     if (fullCode === '123456') {
        //         setIsSuccess(true);
        //         console.log('2FA verification successful:', fullCode);
        //     } else {
        //         setError('Invalid verification code. Please try again.');
        //         // Clear the code on error
        //         setCode(['', '', '', '', '', '']);
        //         inputRefs.current[0]?.focus();
        //     }
        // }, 1500);
    };

    const handleResendCode = async () => {
        setIsResending(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            setIsResending(false);
            setCanResend(false);
            setTimeLeft(60);
            console.log('Verification code resent');
        }, 1000);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (isSuccess) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4" role="main">
                <section
                    className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center"
                    aria-labelledby="verification-success-title"
                    aria-describedby="verification-success-desc"
                >
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6"
                        aria-hidden="true"
                    >
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>

                    <h1
                        id="verification-success-title"
                        className="text-2xl font-bold text-gray-900 mb-4"
                    >
                        Verification successful!
                    </h1>

                    <p
                        id="verification-success-desc"
                        className="text-gray-600 mb-6"
                    >
                        You have been successfully authenticated and can now access your account.
                    </p>

                    <button
                        onClick={() => console.log('Redirect to dashboard')}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
                    >
                        Continue to Dashboard
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4" role="main">
            <div className="w-full max-w-md">

                {/* Back to Login */}
                <nav aria-label="Breadcrumb" className="mb-6">
                    <Link
                        to="/login"
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
                        Back to login
                    </Link>
                </nav>

                {/* Header */}
                <header className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg"
                        aria-hidden="true"
                    >
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h1>
                    <p className="text-gray-600">
                        Enter the 6-digit verification code sent to your registered device
                    </p>
                </header>

                {/* 2FA Form */}
                <section
                    className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                    aria-labelledby="two-fa-form-title"
                >
                    <form onSubmit={handleSubmit} className="space-y-6" aria-describedby="two-fa-form-desc">
                        {/* Code Input */}
                        <fieldset>
                            <legend
                                id="two-fa-form-title"
                                className="block text-sm font-semibold text-gray-700 mb-4 text-center"
                            >
                                Verification Code
                            </legend>
                            <div
                                className="flex justify-center space-x-3 mb-4"
                                aria-describedby={error ? "code-error" : undefined}
                            >
                                {code.map((digit, index) => (
                                    <input
                                        key={`code-${index}`}
                                        ref={el => {
                                            inputRefs.current[index] = el;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={e => handleInputChange(index, e.target.value)}
                                        onKeyDown={e => handleKeyDown(index, e)}
                                        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
                                            } ${digit ? "border-indigo-300 bg-indigo-50" : ""}`}
                                        placeholder="0"
                                        aria-label={`Digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p
                                    id="code-error"
                                    className="text-sm text-red-600 text-center flex items-center justify-center"
                                    role="alert"
                                >
                                    <span className="w-4 h-4 mr-1" aria-hidden="true">
                                        ⚠
                                    </span>
                                    {error}
                                </p>
                            )}
                        </fieldset>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading || code.join("").length !== 6}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Verifying...
                                </div>
                            ) : (
                                "Verify Code"
                            )}
                        </button>
                    </form>

                    {/* Resend Code */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm mb-3">Didn't receive the code?</p>

                        {canResend ? (
                            <button
                                onClick={handleResendCode}
                                disabled={isResending}
                                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium transition-colors disabled:opacity-50"
                            >
                                {isResending ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" aria-hidden="true" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-1" aria-hidden="true" />
                                        Resend code
                                    </>
                                )}
                            </button>
                        ) : (
                            <p className="text-gray-500 text-sm">Resend code in {formatTime(timeLeft)}</p>
                        )}
                    </div>

                    {/* Help Text */}
                    <aside className="mt-6 p-4 bg-blue-50 rounded-xl" aria-label="Help and troubleshooting tips">
                        <p className="text-sm text-blue-800 mb-2">
                            <strong>Having trouble?</strong>
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Check your authenticator app or SMS messages</li>
                            <li>• Make sure you're entering the most recent code</li>
                            <li>• Codes expire after a few minutes</li>
                            <li>• Contact support if you continue having issues</li>
                        </ul>
                    </aside>
                </section>
            </div>
        </main>
    );
};

export default TwoFactorPage;