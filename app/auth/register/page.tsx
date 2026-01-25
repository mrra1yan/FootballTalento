"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { register as registerUser } from "@/lib/api/auth";
import { countries, currencies } from "@/lib/data/countries";
import type { ApiError } from "@/types/auth";

export default function RegisterPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	// Form fields
	const [accountType, setAccountType] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [country, setCountry] = useState("");
	const [currency, setCurrency] = useState("");
	const [parentConsent, setParentConsent] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	/* Password strength validation */
	const rules = {
		length: password.length >= 8,
		upper: /[A-Z]/.test(password),
		lower: /[a-z]/.test(password),
		number: /[0-9]/.test(password),
		special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	};

	const strengthScore = Object.values(rules).filter(Boolean).length;
	const strengthLabel = strengthScore <= 2 ? "WEAK" : strengthScore <= 4 ? "MEDIUM" : "STRONG";

	/* Progress calculation */
	const progress = useMemo(() => {
		let value = 0;
		if (accountType) value += 14;
		if (fullName.trim().length > 0) value += 14;
		if (email.trim().length > 0) value += 14;
		if (country) value += 14;
		if (currency) value += 14;
		if (password.length > 0 && strengthScore === 5) value += 15;
		if (confirmPassword && confirmPassword === password) value += 15;
		return value;
	}, [accountType, fullName, email, country, currency, password, confirmPassword, strengthScore]);

	const canSubmit = useMemo(() => {
		return (
			accountType &&
			fullName.trim() &&
			email.trim() &&
			country &&
			currency &&
			password &&
			confirmPassword &&
			password === confirmPassword &&
			strengthScore === 5 &&
			termsAccepted &&
			!isSubmitting
		);
	}, [accountType, fullName, email, country, currency, password, confirmPassword, strengthScore, termsAccepted, isSubmitting]);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		
		if (!canSubmit) {
			toast.error("Please fill all required fields correctly");
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await registerUser({
				fullName,
				email,
				password,
				accountType,
				country,
				currency,
				parentConsent: accountType === 'player' ? parentConsent : undefined,
			});

			if (response.success) {
				toast.success("Registration successful! Redirecting...");
				
				// Redirect to dashboard or home after successful registration
				setTimeout(() => {
					router.push("/dashboard");
				}, 1500);
			}
		} catch (error) {
			const apiError = error as ApiError;
			toast.error(apiError.message || "Registration failed. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className="min-h-screen flex items-center justify-center pt-16 sm:pt-36 sm:pb-18.25">
			<div className="w-full max-w-2xl">
				<div className="bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
					{/* Header */}
					<div className="border-b border-border bg-primary p-6 sm:p-8">
						<div className="flex items-center gap-4">
							<div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center">
								<i className="fa-solid fa-user-plus text-primary text-lg" />
							</div>
							<div className="flex-1">
								<h1 className="text-xl sm:text-2xl font-bold text-surface">Create Your Account</h1>
								<p className="text-sm text-surface">Join the global football talent network</p>

								{/* Progress Bar */}
								<div className="mt-4">
									<div className="h-1.5 w-full bg-surface/30 rounded-full overflow-hidden">
										<div className="h-full bg-surface transition-all duration-300" style={{ width: `${progress}%` }} />
									</div>
									<p className="mt-1 text-xs text-surface">Progress: {progress}%</p>
								</div>
							</div>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
						{/* Account Type */}
						<div>
							<label className="block mb-2 text-sm font-semibold">
								Account Type <span className="text-red-500">*</span>
							</label>
							<select required value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20">
								<option value="" disabled>
									Select your role
								</option>
								<option value="player">Player</option>
								<option value="club">Club / Academy</option>
								<option value="scout">Scout</option>
								<option value="coach">Coach</option>
								<option value="parent">Parent</option>
								<option value="agent">Agent</option>
								<option value="sponsor">Sponsor</option>
								<option value="fan">Fan</option>
							</select>
						</div>

						{/* Name & Email */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block mb-2 text-sm font-semibold">
									Full Name <span className="text-red-500">*</span>
								</label>
								<input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20" />
							</div>

							<div>
								<label className="block mb-2 text-sm font-semibold">
									Email Address <span className="text-red-500">*</span>
								</label>
								<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20" />
							</div>
						</div>

						{/* Country & Currency */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block mb-2 text-sm font-semibold">
									<i className="fa-solid fa-globe text-primary mr-2"></i>
									Country <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
										<i className="fa-solid fa-flag" />
									</span>
									<select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 pl-12 focus:border-primary focus:outline-none focus:ring-primary/20">
										<option value="" disabled>
											Select your country
										</option>
										{countries.map((c) => (
											<option key={c.code} value={c.code}>
												{c.name}
											</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block mb-2 text-sm font-semibold">
									<i className="fa-solid fa-money-bill-wave text-primary mr-2"></i>
									Preferred Currency <span className="text-red-500">*</span>
								</label>
								<div className="relative">
									<span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
										<i className="fa-solid fa-dollar-sign" />
									</span>
									<select required value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 pl-12 focus:border-primary focus:outline-none focus:ring-primary/20">
										<option value="" disabled>
											Select currency
										</option>
										{currencies.map((c) => (
											<option key={c.code} value={c.code}>
												{c.name}
											</option>
										))}
									</select>
								</div>
							</div>
						</div>

						{/* Password */}
						<div>
							<label className="block mb-2 text-sm font-semibold">
								Password <span className="text-red-500">*</span>
							</label>

							<div className="relative">
								<input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 focus:border-primary focus:outline-none focus:ring-primary/20" />
								<button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
									<i className={`fa-regular ${showPassword ? "fa-eye-slash" : "fa-eye"}`} />
								</button>
							</div>

							{/* Password Strength */}
							{password && (
								<div className="mt-4 rounded-lg border border-border bg-bg p-4">
									<div className="flex justify-between mb-3">
										<span className="text-xs font-semibold text-text-muted">PASSWORD STRENGTH</span>
										<span className={`text-xs font-bold ${strengthLabel === "STRONG" ? "text-green-600" : strengthLabel === "MEDIUM" ? "text-amber-600" : "text-red-600"}`}>{strengthLabel}</span>
									</div>

									<div className="flex gap-1.5 mb-4">
										{[1, 2, 3, 4, 5].map((i) => (
											<div key={i} className={`h-1.5 flex-1 rounded-full ${strengthScore >= i ? "bg-primary" : "bg-border"}`} />
										))}
									</div>

									<ul className="space-y-1 text-sm">
										<li className={rules.length ? "text-primary" : "text-text-muted"}>✓ Minimum 8 characters</li>
										<li className={rules.upper ? "text-primary" : "text-text-muted"}>✓ At least 1 uppercase letter</li>
										<li className={rules.lower ? "text-primary" : "text-text-muted"}>✓ At least 1 lowercase letter</li>
										<li className={rules.number ? "text-primary" : "text-text-muted"}>✓ At least 1 number</li>
										<li className={rules.special ? "text-primary" : "text-text-muted"}>✓ At least 1 special character</li>
									</ul>
								</div>
							)}
						</div>

						{/* Confirm Password */}
						{password.length > 0 && (
							<div>
								<label className="block mb-2 text-sm font-semibold">
									Confirm Password <span className="text-red-500">*</span>
								</label>

								<div className="relative">
									<input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 focus:border-primary focus:outline-none focus:ring-primary/20" />
									<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
										<i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
									</button>
								</div>

								{confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-500">Passwords do not match</p>}
								{confirmPassword && password === confirmPassword && <p className="mt-1 text-xs text-green-500">Passwords match!</p>}
							</div>
						)}

						{/* Parent Consent for Players */}
						{accountType === "player" && (
							<div className="flex items-start gap-3 bg-bg p-4 rounded-lg border border-border">
								<input type="checkbox" checked={parentConsent} onChange={(e) => setParentConsent(e.target.checked)} className="h-5 w-5 accent-primary mt-0.5" />
								<p className="text-sm text-text">I confirm that I have parental/guardian consent (required for players under 18)</p>
							</div>
						)}

						{/* Terms */}
						<div className="flex items-start gap-3 bg-bg p-4 rounded-lg border border-border">
							<input type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-5 w-5 accent-primary mt-0.5" />
							<p className="text-sm text-text">
								I agree to the{" "}
								<Link href="/terms" className="text-primary font-semibold">
									Terms of Service
								</Link>{" "}
								and{" "}
								<Link href="/privacy" className="text-primary font-semibold">
									Privacy Policy
								</Link>
							</p>
						</div>

						{/* Submit */}
						<button type="submit" disabled={!canSubmit} className="w-full rounded-lg bg-primary py-4 font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary">
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<i className="fa-solid fa-spinner fa-spin" />
									Creating Account...
								</span>
							) : (
								"Create Account"
							)}
						</button>

						<p className="text-center text-sm text-text-muted">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-primary font-semibold hover:underline">
								Sign in here
							</Link>
						</p>
					</form>
				</div>
			</div>
		</main>
	);
}
