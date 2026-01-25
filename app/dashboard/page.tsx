"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { useTranslation } from "@/lib/i18n";

export default function DashboardPage() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading, logout } = useAuthStore();
	const { t } = useTranslation();

	useEffect(() => {
		if (!isLoading && !isAuthenticated) {
			router.push("/auth/login");
		}
	}, [isAuthenticated, isLoading, router]);

	const handleLogout = async () => {
		try {
			await logout();
			toast.success("Logged out successfully");
			router.push("/auth/login");
		} catch (error) {
			toast.error("Logout failed");
		}
	};

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<i className="fa-solid fa-spinner fa-spin text-4xl text-primary mb-4" />
					<p className="text-text-secondary">{t('loading')}</p>
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<main className="min-h-screen bg-bg px-4 pt-24 pb-16">
			<div className="max-w-6xl mx-auto">
				{/* Header */}
				<header className="mb-8">
					<div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
						<div className="flex items-start justify-between gap-4 flex-wrap">
							<div>
								<h1 className="text-3xl font-bold text-text mb-2">
									{t('welcome_back_name', { name: user.display_name })}
								</h1>
								<p className="text-text-secondary">
									{t('manage_profile_desc')}
								</p>
							</div>
							<button
								onClick={handleLogout}
								className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
							>
								<i className="fa-solid fa-sign-out mr-2" />
								{t('logout')}
							</button>
						</div>
					</div>
				</header>

				{/* User Info Cards */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					{/* Profile Card */}
					<div className="bg-surface border border-border rounded-xl p-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
								<i className="fa-solid fa-user text-white text-xl" />
							</div>
							<div>
								<h3 className="font-semibold text-text">{t('profile')}</h3>
								<p className="text-sm text-text-secondary">{t('update_info')}</p>
							</div>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-text-secondary">
								<span className="font-medium">{t('email_label')}:</span> {user.email}
							</p>
							<p className="text-text-secondary">
								<span className="font-medium">{t('username_label')}:</span> {user.username}
							</p>
						</div>
					</div>

					{/* Account Type Card */}
					<div className="bg-surface border border-border rounded-xl p-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
								<i className="fa-solid fa-id-badge text-white text-xl" />
							</div>
							<div>
								<h3 className="font-semibold text-text">{t('account_type')}</h3>
								<p className="text-sm text-text-secondary">{user.account_type}</p>
							</div>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-text-secondary">
								<span className="font-medium">Type:</span>{" "}
								<span className="capitalize">{user.account_type}</span>
							</p>
						</div>
					</div>

					{/* Location Card */}
					<div className="bg-surface border border-border rounded-xl p-6">
						<div className="flex items-center gap-4 mb-4">
							<div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
								<i className="fa-solid fa-globe text-white text-xl" />
							</div>
							<div>
								<h3 className="font-semibold text-text">{t('country')}</h3>
								<p className="text-sm text-text-secondary">{user.country} & {user.currency}</p>
							</div>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-text-secondary">
								<span className="font-medium">Country:</span> {user.country}
							</p>
							<p className="text-text-secondary">
								<span className="font-medium">Currency:</span> {user.currency}
							</p>
						</div>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="bg-surface border border-border rounded-2xl p-8">
					<h2 className="text-xl font-bold text-text mb-6">{t('quick_actions')}</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-user-edit text-primary text-2xl mb-2" />
							<p className="font-semibold text-text">{t('edit_profile')}</p>
							<p className="text-xs text-text-secondary">{t('update_info')}</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-shield-alt text-accent text-2xl mb-2" />
							<p className="font-semibold text-text">{t('security')}</p>
							<p className="text-xs text-text-secondary">{t('manage_security')}</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-bell text-secondary text-2xl mb-2" />
							<p className="font-semibold text-text">{t('notifications')}</p>
							<p className="text-xs text-text-secondary">{t('manage_prefs')}</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-question-circle text-amber-500 text-2xl mb-2" />
							<p className="font-semibold text-text">{t('help_center')}</p>
							<p className="text-xs text-text-secondary">{t('get_support')}</p>
						</button>
					</div>
				</div>

				{/* Developer Info */}
				<div className="mt-8 bg-surface/50 border border-border rounded-xl p-6">
					<h3 className="text-sm font-semibold text-text-secondary mb-3">
						<i className="fa-solid fa-info-circle mr-2" />
						{t('auth_status')}
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
						<div>
							<p className="text-text-secondary mb-1">{t('user_id_label')}:</p>
							<p className="text-accent">{user.user_id}</p>
						</div>
						<div>
							<p className="text-text-secondary mb-1">{t('auth_status')}:</p>
							<p className="text-green-500">{t('authenticated')}</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
