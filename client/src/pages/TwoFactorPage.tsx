import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';

interface TwoFactorPageProps {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean,
    error?: string;
    onSubmit: (code: string) => void;
    onBackToLogin: () => void;
    onSuccessContinue: () => void;
}

const TwoFactorPage: React.FC<TwoFactorPageProps> = ({ isLoading, isSuccess, isError, error, onSubmit, onBackToLogin, onSuccessContinue }) => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInputChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
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
        if (fullCode.length === 6) {
            onSubmit(fullCode);
        }
    };

    useEffect(() => {
        if (isError || error) {
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
        }
    }, [error]);

    if (isSuccess) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <section className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6"><CheckCircle className="w-8 h-8 text-green-600" /></div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification successful!</h1>
                    <p className="text-gray-600 mb-6">You have been successfully authenticated.</p>
                    <button onClick={onSuccessContinue} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200">
                        Continue to Dashboard
                    </button>
                </section>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <nav className="mb-6">
                    <button onClick={onBackToLogin} className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
                    </button>
                </nav>
                <header className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg"><Shield className="w-8 h-8 text-white" /></div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Two-Factor Authentication</h1>
                    <p className="text-gray-600">Enter the 6-digit code from your authenticator app</p>
                </header>
                <section className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <fieldset>
                            <legend className="block text-sm font-semibold text-gray-700 mb-4 text-center">Verification Code</legend>
                            <div className="flex justify-center space-x-3 mb-4">
                                {code.map((digit, index) => (
                                    <input key={`code-${index}`} ref={el => { inputRefs.current[index] = el; }} type="text" inputMode="numeric" maxLength={1} value={digit} onChange={e => handleInputChange(index, e.target.value)} onKeyDown={e => handleKeyDown(index, e)}
                                        className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 ${error ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"} ${digit ? "border-indigo-300 bg-indigo-50" : ""}`}
                                        placeholder="0" aria-label={`Digit ${index + 1}`} />
                                ))}
                            </div>
                            {error && (<p className="text-sm text-red-600 text-center flex items-center justify-center" role="alert"><span className="w-4 h-4 mr-1">⚠</span>{error}</p>)}
                        </fieldset>
                        <button type="submit" disabled={isLoading || code.join("").length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? (<div className="flex items-center justify-center"><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />Verifying...</div>) : ("Verify Code")}
                        </button>
                    </form>
                </section>
            </div>
        </main>
    );
};

export default TwoFactorPage;