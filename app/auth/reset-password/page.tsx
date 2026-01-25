"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { resetPassword } from "@/lib/api/auth";
import type { ApiError } from "@/types/auth";

function ResetPasswordContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		if (!token) {
			toast.error("Invalid or missing reset token");
			router.push("/auth/forgot-password");
		}
	}, [token, router]);

	const rules = {
		length: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /[0-9]/.test(password),
		special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	};

	const score = Object.values(rules).filter(Boolean).length;
	const strengthLabel = score <= 2 ? "Weak" : score <= 4 ? "Medium" : "Strong";
	const strengthColor = score <= 2 ? "bg-red-500" : score <= 4 ? "bg-amber-500" : "bg-accent";
	const canSubmit = score === 5 && password === confirmPassword && confirmPassword.length > 0 && !isSubmitting;

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!canSubmit || !token) {
			toast.error("Please ensure all requirements are met");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await resetPassword({
				token,
				newPassword: password,
			});

			if (response.success) {
				toast.success("Password reset successful!");
				setSuccess(true);
			}
		} catch (error) {
			const apiError = error as ApiError;
			
			if (apiError.code === 'expired_token') {
				toast.error("Reset link has expired. Please request a new one.");
				setTimeout(() => {
					router.push("/auth/forgot-password");
				}, 2000);
			} else {
				toast.error(apiError.message || "Failed to reset password. Please try again.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	if (!token) {
		return null;
	}

	// Success Screen
	if (success) {
		return (
			<main className="min-h-screen bg-bg flex items-center justify-center pt-16 sm:pt-18.25">
				<section className="w-full max-w-xl">
					{/* Success Card */}
					<div className="bg-surface border border-border rounded-2xl p-8 sm:p-12 text-center shadow-lg">
						{/* Animated Success Icon */}
						<div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent animate-pulse">
							<i className="fa-solid fa-circle-check text-surface text-4xl" />
						</div>

						{/* Success Message */}
						<h1 className="text-2xl sm:text-3xl font-bold text-text mb-4">Password Reset Successful!</h1>
						<p className="text-text-secondary mb-8 leading-relaxed">Your password has been successfully reset. You can now use your new password to sign in to your FootballTalento account.</p>

						{/* Security Reminder */}
						<div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-8 text-left">
							<div className="flex items-start gap-3">
								<i className="fa-solid fa-shield-halved text-green-600 mt-1" />
								<div>
									<h4 className="text-text font-semibold mb-1">Security Reminder</h4>
									<p className="text-sm text-text-secondary">Keep your password secure and don't share it with anyone. Enable two-factor authentication for added security.</p>
								</div>
							</div>
						</div>

						{/* Continue Button */}
						<Link href="/auth/login" className="inline-block w-full bg-linear-to-r from-primary to-accent text-surface font-semibold py-3.5 px-6 rounded-lg hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 mb-4">
							Continue to Login
						</Link>

						{/* Back to Home */}
						<Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors">
							<i className="fa-solid fa-arrow-left" />
							<span>Back to Home</span>
						</Link>
					</div>

					{/* Additional Info */}
					<div className="mt-8 rounded-xl border border-border bg-surface/70 p-6">
						<div className="flex items-start gap-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
								<i className="fa-solid fa-info-circle text-accent" />
							</div>
							<div>
								<h3 className="font-semibold text-text mb-1">What's Next?</h3>
								<p className="text-sm text-text-secondary mb-2">Sign in with your new password and explore your FootballTalento dashboard.</p>
								<ul className="text-sm text-text-secondary space-y-1">
									<li>• Update your profile information</li>
									<li>• Connect with the football community</li>
									<li>• Explore players, clubs, and scouts</li>
								</ul>
							</div>
						</div>
					</div>
				</section>
			</main>
		);
	}

	// Reset Password Form
	return (
		<main className="min-h-screen bg-bg flex items-center justify-center px-4 pt-24 pb-16">
			<section className="w-full max-w-xl">
				{/* Card */}
				<div className="bg-surface border border-border rounded-2xl p-8 sm:p-10 shadow-lg">
					{/* Header */}
					<header className="text-center mb-8">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
							<i className="fa-solid fa-key text-accent text-2xl" />
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">Create New Password</h1>
						<p className="text-text-secondary text-sm">Your new password must be different from previous passwords</p>
					</header>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* New Password */}
						<div>
							<label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
							<div className="relative">
								<input 
									type={showPassword ? "text" : "password"} 
									value={password} 
									onChange={(e) => setPassword(e.target.value)} 
									required
									placeholder="Enter new password"
									className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/30" 
								/>
								<button 
									type="button" 
									onClick={() => setShowPassword(!showPassword)} 
									className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
								>
									<i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
								</button>
							</div>
						</div>

						{/* Confirm Password */}
						<div>
							<label className="block text-sm font-medium text-text-secondary mb-2">Confirm Password</label>
							<div className="relative">
								<input 
									type={showConfirm ? "text" : "password"} 
									value={confirmPassword} 
									onChange={(e) => setConfirmPassword(e.target.value)} 
									required
									placeholder="Confirm new password"
									className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-accent/30" 
								/>
								<button 
									type="button" 
									onClick={() => setShowConfirm(!showConfirm)} 
									className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
								>
									<i className={`fa-regular ${showConfirm ? "fa-eye-slash" : "fa-eye"}`} />
								</button>
							</div>

							{confirmPassword && password !== confirmPassword && (
								<p className="mt-1 text-xs text-red-500">Passwords do not match</p>
							)}
							{confirmPassword && password === confirmPassword && (
								<p className="mt-1 text-xs text-green-500">Passwords match!</p>
							)}
						</div>

						{/* Strength */}
						{password && (
							<div className="rounded-lg border border-border bg-bg p-5">
								<div className="flex justify-between mb-3">
									<span className="text-sm text-text-secondary">Password Strength</span>
									<span className={`text-sm font-semibold ${score <= 2 ? "text-red-500" : score <= 4 ? "text-amber-500" : "text-accent"}`}>
										{strengthLabel}
									</span>
								</div>

								<div className="h-2 rounded-full bg-border overflow-hidden mb-4">
									<div className={`h-full ${strengthColor} transition-all`} style={{ width: `${(score / 5) * 100}%` }} />
								</div>

								<ul className="space-y-1 text-sm">
									<li className={rules.length ? "text-accent" : "text-text-muted"}>✓ Minimum 8 characters</li>
									<li className={rules.upper ? "text-accent" : "text-text-muted"}>✓ At least 1 uppercase letter</li>
									<li className={rules.lower ? "text-accent" : "text-text-muted"}>✓ At least 1 lowercase letter</li>
									<li className={rules.number ? "text-accent" : "text-text-muted"}>✓ At least 1 number</li>
									<li className={rules.special ? "text-accent" : "text-text-muted"}>✓ At least 1 special character</li>
								</ul>
							</div>
						)}

						{/* Submit */}
						<button 
							type="submit" 
							disabled={!canSubmit} 
							className="w-full rounded-lg bg-accent py-3.5 font-semibold text-white transition hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<i className="fa-solid fa-spinner fa-spin" />
									Resetting Password...
								</span>
							) : (
								"Reset Password"
							)}
						</button>

						{/* Back */}
						<div className="text-center">
							<Link href="/auth/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-accent">
								<i className="fa-solid fa-arrow-left" />
								Back to Sign In
							</Link>
						</div>
					</form>
				</div>

				{/* Security Tip */}
				<div className="mt-8 rounded-xl border border-border bg-surface/70 p-6">
					<div className="flex items-start gap-4">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
							<i className="fa-solid fa-lightbulb text-amber-500" />
						</div>
						<div>
							<h3 className="font-semibold text-text-primary mb-1">Security Tip</h3>
							<p className="text-sm text-text-secondary">
								Never share your password reset link with anyone. FootballTalento will never ask for your password.
							</p>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}

export default function ResetPasswordPage() {
	return (
		<Suspense fallback={
			<main className="min-h-screen bg-bg flex items-center justify-center px-4 pt-24 pb-16">
				<div className="text-center">
					<i className="fa-solid fa-spinner fa-spin text-accent text-4xl mb-4" />
					<p className="text-text-secondary">Loading...</p>
				</div>
			</main>
		}>
			<ResetPasswordContent />
		</Suspense>
	);
}