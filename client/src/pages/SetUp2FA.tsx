import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Shield, Loader2, Check, Copy } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { apiService } from "../api/apiService";
import { useState } from "react";
import type { Setup2FAResponse } from "../type/api.types";

export default function Setup2FAPage() {
    const [searchParams] = useSearchParams();
    // 2. Read the 'token' parameter from the URL.
    const tempToken = searchParams.get('token');
    
    const [copied, setCopied] = useState(false);

    const { data, isLoading, isError } = useQuery<Setup2FAResponse, AxiosError>({
        queryKey: ['2faSetup', tempToken],
        queryFn: () => apiService.auth.setup2fa(tempToken!),
        enabled: !!tempToken,
        retry: false,
        staleTime: Infinity,
    });

    const handleCopy = () => {
        if (data?.manualCode) {
            navigator.clipboard.writeText(data.manualCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };


    if (!tempToken) {
        return (
            <main className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600">Session Error</h1>
                    <p className="text-gray-600 mt-2">No temporary session token found. Please register again.</p>
                    <Link to="/signup" className="mt-4 inline-block text-blue-600 hover:underline">Go to Sign Up</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <section className="w-full max-w-md text-center">
                <header className="mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                        <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Set Up Two-Factor Authentication</h1>
                    <p className="text-gray-600">Scan the QR code with your authenticator app (e.g., Google Authenticator, Authy).</p>
                </header>
                <article className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {isLoading && <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-600" />}
                    {isError && <p className="text-red-600">Could not load setup details. Please try registering again.</p>}

                    {data && (
                        <div className="space-y-6">
                            <div className="bg-white p-4 inline-block rounded-lg border">
                                <img src={data.qr} alt="2FA QR Code" width="256" height="256" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Or enter this code manually:</p>
                                <div className="mt-2 flex justify-center items-center gap-2 bg-gray-100 p-3 rounded-lg">
                                    <code className="text-lg font-mono tracking-widest text-gray-800">
                                        {data.manualCode}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="p-2 rounded-md hover:bg-gray-200 transition-colors"
                                        aria-label="Copy manual code"
                                    >
                                        {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-gray-500" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <footer className="mt-8 text-center">
                        <p className="text-gray-600">After scanning, you can now log in using your credentials and the 6-digit code from your app.</p>
                        <Link to="/login" className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all">
                            Proceed to Login
                        </Link>
                    </footer>
                </article>
            </section>
        </main>
    );
}