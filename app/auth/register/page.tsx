"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { register as registerUser } from "@/lib/api/auth";
import { countries, currencies } from "@/lib/data/countries";
import type { ApiError } from "@/types/auth";
import { useTranslation, useLanguageStore } from "@/lib/i18n";

export default function RegisterPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { t, language } = useTranslation();
	const { currency: globalCurrency } = useLanguageStore();

	// Form fields
	const [accountType, setAccountType] = useState("");
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [country, setCountry] = useState("");
	const [currency, setCurrency] = useState(globalCurrency);
	const [parentConsent, setParentConsent] = useState(false);
	const [termsAccepted, setTermsAccepted] = useState(false);
	const [website_url, setWebsiteUrl] = useState(""); // Honeypot field
	const [isPendingVerification, setIsPendingVerification] = useState(false);

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
				language,
				parentConsent: accountType === 'player' ? parentConsent : undefined,
				website_url,
			});

			if (response.success) {
				if (response.data?.unverified) {
					setIsPendingVerification(true);
					toast.success("Registration successful! Please check your email to verify your account.", { duration: 6000 });
				} else {
					toast.success("Registration successful! Redirecting...");
					setTimeout(() => {
						router.push("/dashboard");
					}, 1500);
				}
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
								<h1 className="text-xl sm:text-2xl font-bold text-surface">{t('create_account')}</h1>
								<p className="text-sm text-surface">{t('join_network')}</p>

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
					{isPendingVerification ? (
						<div className="p-12 text-center space-y-6">
							<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
								<i className="fa-solid fa-envelope-circle-check text-4xl text-primary" />
							</div>
							<h2 className="text-2xl font-bold text-text">{t('verify_email_title')}</h2>
							<p className="text-text-muted max-w-md mx-auto">
								{t('verify_email_desc', { email: email })}
							</p>
							<div className="pt-4">
								<Link href="/auth/login" className="text-primary font-semibold hover:underline border border-primary/20 rounded-lg px-6 py-2 transition hover:bg-primary/5">
									{t('back_to_login')}
								</Link>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
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
							{/* Account Type */}
							<div>
								<label className="block mb-2 text-sm font-semibold">
									{t('account_type')} <span className="text-red-500">*</span>
								</label>
								<select required value={accountType} onChange={(e) => setAccountType(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20">
									<option value="" disabled>
										{t('select_your_role')}
									</option>
									<option value="player">{t('player')}</option>
									<option value="club">{t('club_academy')}</option>
									<option value="scout">{t('scout')}</option>
									<option value="coach">{t('coach')}</option>
									<option value="parent">{t('parent')}</option>
									<option value="agent">{t('agent')}</option>
									<option value="sponsor">{t('sponsor')}</option>
									<option value="fan">{t('fan')}</option>
								</select>
							</div>

							{/* Name & Email */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block mb-2 text-sm font-semibold">
										{t('full_name')} <span className="text-red-500">*</span>
									</label>
									<input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t('john_doe_placeholder')} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20" />
								</div>

								<div>
									<label className="block mb-2 text-sm font-semibold">
										{t('email_address')} <span className="text-red-500">*</span>
									</label>
									<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('email_placeholder')} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20" />
								</div>
							</div>

							{/* Country & Currency */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block mb-2 text-sm font-semibold">
										{t('country')} <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<select required value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20">
											<option value="" disabled>
												{t('select_your_country')}
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
										{t('preferred_currency')} <span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<select required value={currency} onChange={(e) => setCurrency(e.target.value as any)} className="w-full rounded-lg border border-border bg-surface px-4 py-3 focus:border-primary focus:outline-none focus:ring-primary/20">
											<option value="" disabled>
												{t('select_currency')}
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
									{t('password')} <span className="text-red-500">*</span>
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
											<span className="text-xs font-semibold text-text-muted">{t('password_strength').toUpperCase()}</span>
											<span className={`text-xs font-bold ${strengthLabel === t('strong') ? "text-green-600" : strengthLabel === t('medium') ? "text-amber-600" : "text-red-600"}`}>{strengthLabel}</span>
										</div>

										<div className="flex gap-1.5 mb-4">
											{[1, 2, 3, 4, 5].map((i) => (
												<div key={i} className={`h-1.5 flex-1 rounded-full ${strengthScore >= i ? "bg-primary" : "bg-border"}`} />
											))}
										</div>

										<ul className="space-y-1 text-sm">
											<li className={rules.length ? "text-primary" : "text-text-muted"}>✓ {t('min_8_chars')}</li>
											<li className={rules.upper ? "text-primary" : "text-text-muted"}>✓ {t('at_least_1_uppercase')}</li>
											<li className={rules.lower ? "text-primary" : "text-text-muted"}>✓ {t('at_least_1_lowercase')}</li>
											<li className={rules.number ? "text-primary" : "text-text-muted"}>✓ {t('at_least_1_number')}</li>
											<li className={rules.special ? "text-primary" : "text-text-muted"}>✓ {t('at_least_1_special_char')}</li>
										</ul>
									</div>
								)}
							</div>

							{/* Confirm Password */}
							{password.length > 0 && (
								<div>
									<label className="block mb-2 text-sm font-semibold">
										{t('confirm_password')} <span className="text-red-500">*</span>
									</label>

									<div className="relative">
										<input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" className="w-full rounded-lg border border-border bg-surface px-4 py-3 pr-12 focus:border-primary focus:outline-none focus:ring-primary/20" />
										<button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted">
											<i className={`fa-regular ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`} />
										</button>
									</div>

									{confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-500">{t('passwords_do_not_match')}</p>}
									{confirmPassword && password === confirmPassword && <p className="mt-1 text-xs text-green-500">{t('passwords_match')}</p>}
								</div>
							)}

							{/* Parent Consent for Players */}
							{accountType === "player" && (
								<div className="flex items-start gap-3 bg-bg p-4 rounded-lg border border-border">
									<input type="checkbox" checked={parentConsent} onChange={(e) => setParentConsent(e.target.checked)} className="h-5 w-5 accent-primary mt-0.5" />
									<p className="text-sm text-text">{t('parent_consent_text')}</p>
								</div>
							)}

							{/* Terms */}
							<div className="flex items-start gap-3 bg-bg p-4 rounded-lg border border-border">
								<input type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="h-5 w-5 accent-primary mt-0.5" />
								<p className="text-sm text-text">
									{t('agree_to_the')}{" "}
									<Link href="/terms" className="text-primary font-semibold">
										{t('terms_of_service')}
									</Link>{" "}
									{t('and')}{" "}
									<Link href="/privacy" className="text-primary font-semibold">
										{t('privacy_policy')}
									</Link>
								</p>
							</div>

							{/* Submit */}
							<button type="submit" disabled={!canSubmit} className="w-full rounded-lg bg-primary py-4 font-bold text-white transition disabled:opacity-50 disabled:cursor-not-allowed hover:bg-secondary">
								{isSubmitting ? (
									<span className="flex items-center justify-center gap-2">
										<i className="fa-solid fa-spinner fa-spin" />
										{t('creating_account')}
									</span>
								) : (
									t('create_account_button')
								)}
							</button>

							<p className="text-center text-sm text-text-muted">
								{t('already_have_account')}{" "}
								<Link href="/auth/login" className="text-primary font-semibold hover:underline">
									{t('sign_in_here')}
								</Link>
							</p>
						</form>
					)}
				</div>
			</div>
		</main>
	);
}
