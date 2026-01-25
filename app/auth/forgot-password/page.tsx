"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { forgotPassword } from "@/lib/api/auth";
import type { ApiError } from "@/types/auth";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		
		if (!email) {
			toast.error("Please enter your email address");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await forgotPassword({ email });

			if (response.success) {
				setEmailSent(true);
				toast.success("Password reset instructions sent to your email");
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Failed to send reset email. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-bg flex items-center justify-center pt-16 sm:pt-18.25">
			<section className="w-full max-w-xl">
				{/* Card */}
				<div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-lg">
					{/* Header */}
					<header className="text-center mb-8">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
							<i className="fa-solid fa-lock text-accent text-2xl" />
						</div>

						<h1 className="text-2xl sm:text-3xl font-bold text-text mb-2">Forgot Password?</h1>
						<p className="text-text-secondary text-sm">No worries, we&apos;ll send you reset instructions</p>
					</header>

					{/* Success Message */}
					{emailSent && (
						<div className="mb-6 p-4 bg-green-100/50 border border-green-500/30 rounded-lg">
							<div className="flex items-center gap-3">
								<i className="fa-solid fa-circle-check text-green-500"></i>
								<span className="text-green-500 text-sm">Password reset instructions have been sent to your email</span>
							</div>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
								Email Address
							</label>

							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
									<i className="fa-solid fa-envelope" />
								</span>

								<input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={emailSent} placeholder="your.email@example.com" className="w-full rounded-lg border border-border bg-surface px-4 py-3 pl-12 text-text placeholder:text-text-muted focus:outline-none focus:ring-accent/30 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed" />
							</div>
						</div>

						{/* Info Box */}
						<div className="flex items-start gap-3 rounded-lg border border-border bg-bg p-4">
							<i className="fa-solid fa-circle-info text-accent mt-0.5" />
							<p className="text-sm text-text-secondary">We&apos;ll send you a reset link to your registered email address. Please check your inbox and spam folder.</p>
						</div>

						{/* Submit */}
						<button type="submit" disabled={isSubmitting || emailSent} className="w-full rounded-lg bg-accent py-3.5 font-semibold text-white transition hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed">
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<i className="fa-solid fa-spinner fa-spin" />
									Sending...
								</span>
							) : emailSent ? (
								"Email Sent"
							) : (
								"Send Reset Link"
							)}
						</button>

						{/* Back to login */}
						<div className="text-center">
							<Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
								<i className="fa-solid fa-arrow-left" />
								<span>Back to Sign In</span>
							</Link>
						</div>

						{/* Resend link */}
						{emailSent && (
							<div className="text-center">
								<button
									type="button"
									onClick={() => {
										setEmailSent(false);
										setEmail("");
									}}
									className="text-sm text-primary hover:underline"
								>
									Try a different email address
								</button>
							</div>
						)}
					</form>
				</div>

				{/* Security Tip */}
				<div className="mt-8 rounded-xl border border-border bg-surface/70 p-6">
					<div className="flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
							<i className="fa-solid fa-lightbulb text-amber-500" />
						</div>
						<div>
							<h3 className="font-semibold text-text mb-1">Security Tip</h3>
							<p className="text-sm text-text-secondary">Never share your password reset link with anyone. Our team will never ask for your password.</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
