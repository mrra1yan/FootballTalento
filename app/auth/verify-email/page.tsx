"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { verifyEmail } from "@/lib/api/auth";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const doVerify = async () => {
            try {
                const response = await verifyEmail(token);
                if (response.success) {
                    setStatus("success");
                    setMessage(response.message || "Your email has been verified successfully!");
                }
            } catch (error) {
                setStatus("error");
                const errorMessage = error instanceof Error ? error.message : "Email verification failed. The link may be invalid or expired.";
                setMessage(errorMessage);
            }
        };

        doVerify();
    }, [token]);

    return (
        <main className="min-h-screen flex items-center justify-center p-6 bg-bg pt-16 sm:pt-18.25">
            <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                {status === "loading" && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                        <h2 className="text-2xl font-bold text-text">Verifying Account</h2>
                        <p className="text-text-secondary">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <i className="fa-solid fa-circle-check text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-text">Email Verified!</h2>
                        <p className="text-text-secondary">{message}</p>
                        <div className="pt-4">
                            <Link href="/auth/login" className="inline-block w-full rounded-lg bg-primary py-4 font-bold text-white transition hover:bg-secondary">
                                Sign In to Your Account
                            </Link>
                        </div>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-6">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                            <i className="fa-solid fa-circle-xmark text-4xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-text">Verification Failed</h2>
                        <p className="text-text-secondary">{message}</p>
                        <div className="pt-4 space-y-4">
                            <Link href="/auth/register" className="inline-block w-full rounded-lg bg-primary py-4 font-bold text-white transition hover:bg-secondary">
                                Try Registering Again
                            </Link>
                            <Link href="/auth/login" className="block text-sm font-semibold text-primary hover:underline">
                                Return to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen flex items-center justify-center p-6 bg-bg pt-16 sm:pt-18.25">
                <div className="w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl p-8 sm:p-12 text-center">
                    <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
                </div>
            </main>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
