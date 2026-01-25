"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLanguageStore, useTranslation, type Language } from "@/lib/i18n";
import toast from "react-hot-toast";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
	{ code: 'en', label: 'English', flag: '🇬🇧' },
	{ code: 'ar', label: 'العربية', flag: '🇸🇦' },
	{ code: 'fr', label: 'Français', flag: '🇫🇷' },
	{ code: 'it', label: 'Italiano', flag: '🇮🇹' },
	{ code: 'de', label: 'Deutsch', flag: '🇩🇪' },
	{ code: 'es', label: 'Español', flag: '🇪🇸' },
	{ code: 'pt', label: 'Português', flag: '🇵🇹' },
	{ code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
];
const CURRENCIES = ["USD", "EUR", "MAD", "AED", "TRY", "CHF"] as const;
type Currency = (typeof CURRENCIES)[number];

export default function Header() {
	const router = useRouter();
	const { user, isAuthenticated, logout } = useAuthStore();

	const [menuOpen, setMenuOpen] = useState(false);
	const [langOpen, setLangOpen] = useState(false);
	const [currencyOpen, setCurrencyOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);

	const { setLanguage, currency, setCurrency } = useLanguageStore();
	const { t, language } = useTranslation();

	const langRef = useRef<HTMLDivElement>(null);
	const currencyRef = useRef<HTMLDivElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);

	/* Close dropdowns on outside click */
	useEffect(() => {
		function handleClick(e: MouseEvent) {
			if (langRef.current && !langRef.current.contains(e.target as Node)) {
				setLangOpen(false);
			}
			if (currencyRef.current && !currencyRef.current.contains(e.target as Node)) {
				setCurrencyOpen(false);
			}
			if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
				setUserMenuOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, []);

	const handleLogout = async () => {
		try {
			await logout();
			toast.success("Logged out successfully");
			setUserMenuOpen(false);
			setMenuOpen(false);
			router.push("/");
		} catch (error) {
			toast.error("Logout failed");
		}
	};

	return (
		<header className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-360">
				<div className="h-16 sm:h-18 flex items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2">
						<div className="w-9 h-9 sm:w-10 sm:h-10 bg-surface rounded-lg flex items-center justify-center">
							<i className="fas fa-futbol text-primary text-sm sm:text-base" />
						</div>
						<span className="text-base sm:text-lg font-semibold text-surface">FootballTalento</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-6 xl:gap-8">
						<Link href="/#players" className="text-surface/80 hover:text-surface">
							{t('explore_players')}
						</Link>
						<Link href="/#rankings" className="text-surface/80 hover:text-surface">
							{t('rankings')}
						</Link>
						<Link href="/#stories" className="text-surface/80 hover:text-surface">
							{t('stories')}
						</Link>
						<Link href="/#how-it-works" className="text-surface/80 hover:text-surface">
							{t('how_it_works')}
						</Link>
					</nav>

					{/* Desktop Actions */}
					<div className="hidden lg:flex items-center gap-3 xl:gap-4">
						{/* Language */}
						<div ref={langRef} className="relative">
							<button
								onClick={() => {
									setLangOpen(!langOpen);
									setCurrencyOpen(false);
									setUserMenuOpen(false);
								}}
								className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-surface"
							>
								<i className="fas fa-globe text-sm" />
								<span className="text-sm text-surface">{language}</span>
								<i className="fas fa-chevron-down text-xs" />
							</button>

							{langOpen && (
								<div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg overflow-hidden py-1">
									{LANGUAGES.map((l) => (
										<button
											key={l.code}
											onClick={() => {
												setLanguage(l.code);
												setLangOpen(false);
											}}
											className={`flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm transition ${l.code === language
												? "bg-primary text-surface"
												: "text-text-secondary hover:bg-primary hover:text-surface"
												}`}
										>
											<span>{l.flag}</span>
											<span className="font-medium">{l.label}</span>
										</button>
									))}
								</div>
							)}
						</div>

						{/* Currency */}
						<div ref={currencyRef} className="relative">
							<button
								onClick={() => {
									setCurrencyOpen(!currencyOpen);
									setLangOpen(false);
									setUserMenuOpen(false);
								}}
								className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-surface"
							>
								<i className="fas fa-coins text-sm" />
								<span className="text-sm">{currency}</span>
								<i className="fas fa-chevron-down text-xs" />
							</button>

							{currencyOpen && (
								<div className="absolute right-0 mt-2 w-32 bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
									{CURRENCIES.map((c) => (
										<button
											key={c}
											onClick={() => {
												setCurrency(c);
												setCurrencyOpen(false);
											}}
											className={`block w-full text-left px-3 py-2 text-sm ${c === currency
												? "bg-primary text-surface"
												: "text-text-secondary hover:bg-primary hover:text-surface"
												}`}
										>
											{c}
										</button>
									))}
								</div>
							)}
						</div>

						{/* Auth Section - Conditional Rendering */}
						{isAuthenticated ? (
							<>
								{/* User Menu - No separate Dashboard link */}
								<div ref={userMenuRef} className="relative">
									<button
										onClick={() => {
											setUserMenuOpen(!userMenuOpen);
											setLangOpen(false);
											setCurrencyOpen(false);
										}}
										className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg text-surface hover:bg-surface/10"
									>
										<div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center">
											<span className="text-primary text-sm font-semibold">
												{user?.display_name?.[0]?.toUpperCase() || 'U'}
											</span>
										</div>
										<span className="text-sm text-surface max-w-24 truncate">
											{user?.display_name}
										</span>
										<i className="fas fa-chevron-down text-xs" />
									</button>

									{userMenuOpen && (
										<div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
											{/* User Info */}
											<div className="px-4 py-3 border-b border-border bg-bg">
												<p className="font-semibold text-text text-sm truncate">
													{user?.display_name}
												</p>
												<p className="text-xs text-text-secondary truncate">
													{user?.email}
												</p>
												<p className="text-xs text-text-muted mt-1 capitalize">
													{user?.account_type}
												</p>
											</div>

											{/* Menu Items */}
											<div className="py-2">
												<Link
													href="/dashboard"
													className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg hover:text-text"
													onClick={() => setUserMenuOpen(false)}
												>
													<i className="fas fa-gauge w-4 text-primary" />
													<span className="text-sm">{t('dashboard')}</span>
												</Link>
												<Link
													href="/profile"
													className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg hover:text-text"
													onClick={() => setUserMenuOpen(false)}
												>
													<i className="fas fa-user w-4 text-primary" />
													<span className="text-sm">{t('profile')}</span>
												</Link>
												<Link
													href="/settings"
													className="flex items-center gap-3 px-4 py-2 text-text-secondary hover:bg-bg hover:text-text"
													onClick={() => setUserMenuOpen(false)}
												>
													<i className="fas fa-cog w-4 text-primary" />
													<span className="text-sm">{t('settings')}</span>
												</Link>
											</div>

											{/* Logout */}
											<div className="border-t border-border">
												<button
													onClick={handleLogout}
													className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50"
												>
													<i className="fas fa-sign-out w-4" />
													<span className="text-sm font-medium">{t('logout')}</span>
												</button>
											</div>
										</div>
									)}
								</div>
							</>
						) : (
							<>
								{/* Login & Register - Show when NOT logged in */}
								<Link
									href="/auth/login"
									className="text-surface/80 hover:text-surface"
								>
									{t('login')}
								</Link>

								<Link
									href="/auth/register"
									className="px-4 py-2 bg-surface text-primary rounded-lg hover:bg-surface/90"
								>
									{t('signup')}
								</Link>
							</>
						)}
					</div>

					{/* Mobile Menu Button */}
					<button
						onClick={() => setMenuOpen(!menuOpen)}
						className="lg:hidden w-10 h-10 flex items-center justify-center text-surface"
						aria-label="Toggle menu"
					>
						<i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-xl`} />
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<nav className="lg:hidden bg-surface border-t border-border">
					<div className="px-4 sm:px-6 py-5 space-y-4">
						<Link
							href="/#players"
							className="block text-text font-medium"
							onClick={() => setMenuOpen(false)}
						>
							{t('explore_players')}
						</Link>
						<Link
							href="/#rankings"
							className="block text-text font-medium"
							onClick={() => setMenuOpen(false)}
						>
							{t('rankings')}
						</Link>
						<Link
							href="/#stories"
							className="block text-text font-medium"
							onClick={() => setMenuOpen(false)}
						>
							{t('stories')}
						</Link>
						<Link
							href="/#how-it-works"
							className="block text-text font-medium"
							onClick={() => setMenuOpen(false)}
						>
							{t('how_it_works')}
						</Link>

						<div className="pt-4 border-t border-border">
							<p className="text-xs font-semibold text-text-muted uppercase mb-3 px-1">{t('select_language')}</p>
							<div className="grid grid-cols-2 gap-2">
								{LANGUAGES.map((l) => (
									<button
										key={l.code}
										onClick={() => setLanguage(l.code)}
										className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition ${l.code === language
											? "bg-primary text-surface border-primary"
											: "border-border text-text-secondary bg-white shadow-sm"
											}`}
									>
										<span>{l.flag}</span>
										<span className="font-medium">{l.label}</span>
									</button>
								))}
							</div>
						</div>

						{/* Currency */}
						<div className="flex flex-wrap gap-2">
							{CURRENCIES.map((c) => (
								<button
									key={c}
									onClick={() => setCurrency(c)}
									className={`px-3 py-2 rounded-lg border text-sm ${c === currency
										? "bg-primary text-surface border-primary"
										: "border-border text-text-secondary"
										}`}
								>
									{c}
								</button>
							))}
						</div>

						{/* Mobile Auth Section - Conditional */}
						{isAuthenticated ? (
							<>
								{/* User Info in Mobile */}
								<div className="pt-4 border-t border-border">
									<div className="flex items-center gap-3 p-3 bg-bg rounded-lg mb-3">
										<div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
											<span className="text-surface font-semibold">
												{user?.display_name?.[0]?.toUpperCase() || 'U'}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="font-semibold text-text text-sm truncate">
												{user?.display_name}
											</p>
											<p className="text-xs text-text-secondary truncate">
												{user?.email}
											</p>
										</div>
									</div>

									{/* Mobile Menu Links */}
									<div className="space-y-2">
										<Link
											href="/dashboard"
											className="flex items-center gap-3 px-3 py-2 text-text-secondary rounded-lg hover:bg-bg"
											onClick={() => setMenuOpen(false)}
										>
											<i className="fas fa-gauge w-4" />
											<span className="text-sm">{t('dashboard')}</span>
										</Link>
										<Link
											href="/profile"
											className="flex items-center gap-3 px-3 py-2 text-text-secondary rounded-lg hover:bg-bg"
											onClick={() => setMenuOpen(false)}
										>
											<i className="fas fa-user w-4" />
											<span className="text-sm">{t('profile')}</span>
										</Link>
										<Link
											href="/settings"
											className="flex items-center gap-3 px-3 py-2 text-text-secondary rounded-lg hover:bg-bg"
											onClick={() => setMenuOpen(false)}
										>
											<i className="fas fa-cog w-4" />
											<span className="text-sm">{t('settings')}</span>
										</Link>
									</div>

									{/* Mobile Logout */}
									<button
										onClick={handleLogout}
										className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-red-500 text-white hover:bg-red-600"
									>
										<i className="fas fa-sign-out" />
										<span className="font-medium">{t('logout')}</span>
									</button>
								</div>
							</>
						) : (
							<>
								{/* Mobile Login & Register - Show when NOT logged in */}
								<div className="pt-4 border-t border-border flex gap-3">
									<Link
										href="/auth/login"
										className="flex-1 text-center py-2 rounded-lg border border-primary text-primary hover:bg-primary hover:text-surface"
										onClick={() => setMenuOpen(false)}
									>
										{t('signin')}
									</Link>
									<Link
										href="/auth/register"
										className="flex-1 text-center py-2 rounded-lg bg-primary text-surface hover:bg-secondary"
										onClick={() => setMenuOpen(false)}
									>
										{t('signup')}
									</Link>
								</div>
							</>
						)}
					</div>
				</nav>
			)}
		</header>
	);
}