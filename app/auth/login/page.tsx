"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { login as loginUser } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import type { ApiError } from "@/types/auth";
import { useTranslation } from "@/lib/i18n";

export default function LoginPage() {
	const router = useRouter();
	const { setUser, setIsAuthenticated } = useAuthStore();
	const { t } = useTranslation();

	const [emailUsername, setEmailUsername] = useState("");
	const [password, setPassword] = useState("");
	const [remember, setRemember] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [website_url, setWebsiteUrl] = useState(""); // Honeypot field

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();

		if (!emailUsername || !password) {
			toast.error("Please enter your credentials");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await loginUser({
				emailUsername,
				password,
				remember,
				website_url,
			});

			if (response.success && response.data) {
				// Update global state
				setUser({
					user_id: response.data.user_id,
					username: response.data.username,
					email: response.data.email,
					display_name: response.data.display_name,
					account_type: response.data.account_type,
					country: response.data.country,
					currency: response.data.currency,
				});
				setIsAuthenticated(true);

				toast.success(`Welcome back, ${response.data.display_name}!`);

				// Redirect to dashboard
				setTimeout(() => {
					router.push("/dashboard");
				}, 1000);
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Login failed. Please check your credentials.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen bg-bg flex items-center justify-center pt-16 sm:pt-18.25">
			<section className="w-full max-w-md sm:max-w-lg">
				<div className="bg-surface border border-border rounded-2xl shadow-xl p-8 sm:p-10">
					{/* Header */}
					<header className="text-center mb-8">
						<div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
							<i className="fa-solid fa-futbol text-white text-2xl" />
						</div>

						<h1 className="text-2xl sm:text-3xl font-bold text-text">{t('welcome_back')}</h1>
						<p className="mt-2 text-sm text-text-secondary">{t('login_subtitle')}</p>
					</header>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Honeypot Field - Hidden from users */}
						<div className="hidden" aria-hidden="true">
							<input
								type="text"
								name="website_url"
								value={website_url}
								onChange={(e) => setWebsiteUrl(e.target.value)}
								tabIndex={-1}
								autoComplete="off"
							/>
						</div>
						{/* Email / Username */}
						<div>
							<label htmlFor="identifier" className="block mb-2 text-sm font-medium text-text-secondary">
								{t('email_username')}
							</label>

							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
									<i className="fa-regular fa-user" />
								</span>

								<input id="identifier" name="identifier" type="text" required value={emailUsername} onChange={(e) => setEmailUsername(e.target.value)} placeholder="Enter your email or username" className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 pl-12 text-text placeholder:text-text-muted focus:outline-none focus:ring-primary/20 focus:border-primary" />
							</div>
						</div>

						{/* Password */}
						<div>
							<label htmlFor="password" className="block mb-2 text-sm font-medium text-text-secondary">
								{t('password')}
							</label>

							<div className="relative">
								<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
									<i className="fa-solid fa-lock" />
								</span>

								<input id="password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full rounded-lg border border-border bg-surface px-4 py-3.5 pl-12 pr-12 text-text placeholder:text-text-muted focus:outline-none focus:ring-primary/20 focus:border-primary" />

								<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text" aria-label="Toggle password visibility">
									<i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
								</button>
							</div>
						</div>

						{/* Remember + Forgot */}
						<div className="flex items-center justify-between gap-4 flex-wrap">
							<label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
								<input type="checkbox" name="remember" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-primary border-border rounded" />
								{t('remember_me')}
							</label>

							<Link href="/auth/forgot-password" className="text-sm font-medium text-primary hover:underline">
								{t('forgot_password')}
							</Link>
						</div>

						{/* Submit */}
						<button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-primary py-3.5 font-semibold text-white transition hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
							{isSubmitting ? (
								<>
									<i className="fa-solid fa-spinner fa-spin" />
									Signing in...
								</>
							) : (
								<>
									{t('login')}
									<i className="fa-solid fa-arrow-right" />
								</>
							)}
						</button>
					</form>

					{/* Footer */}
					<footer className="mt-8 text-center">
						<p className="text-sm text-text-secondary">
							{t('dont_have_account')}
							<Link href="/auth/register" className="ml-1 font-semibold text-primary hover:underline">
								{t('signup')}
							</Link>
						</p>
					</footer>
				</div>
			</section>
		</main>
	);
}
