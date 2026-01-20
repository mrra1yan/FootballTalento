"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";

export default function DashboardPage() {
	const router = useRouter();
	const { user, isAuthenticated, isLoading, logout } = useAuthStore();

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
					<p className="text-text-secondary">Loading...</p>
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
									Welcome back, {user.display_name}! 👋
								</h1>
								<p className="text-text-secondary">
									Manage your FootballTalento profile and activities
								</p>
							</div>
							<button
								onClick={handleLogout}
								className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
							>
								<i className="fa-solid fa-sign-out mr-2" />
								Logout
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
								<h3 className="font-semibold text-text">Profile</h3>
								<p className="text-sm text-text-secondary">Your account details</p>
							</div>
						</div>
						<div className="space-y-2 text-sm">
							<p className="text-text-secondary">
								<span className="font-medium">Email:</span> {user.email}
							</p>
							<p className="text-text-secondary">
								<span className="font-medium">Username:</span> {user.username}
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
								<h3 className="font-semibold text-text">Account Type</h3>
								<p className="text-sm text-text-secondary">Your role</p>
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
								<h3 className="font-semibold text-text">Location</h3>
								<p className="text-sm text-text-secondary">Country & currency</p>
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
					<h2 className="text-xl font-bold text-text mb-6">Quick Actions</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-user-edit text-primary text-2xl mb-2" />
							<p className="font-semibold text-text">Edit Profile</p>
							<p className="text-xs text-text-secondary">Update your information</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-shield-alt text-accent text-2xl mb-2" />
							<p className="font-semibold text-text">Security</p>
							<p className="text-xs text-text-secondary">Manage security settings</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-bell text-secondary text-2xl mb-2" />
							<p className="font-semibold text-text">Notifications</p>
							<p className="text-xs text-text-secondary">Manage preferences</p>
						</button>

						<button className="p-4 rounded-lg border border-border hover:bg-bg transition text-left">
							<i className="fa-solid fa-question-circle text-amber-500 text-2xl mb-2" />
							<p className="font-semibold text-text">Help Center</p>
							<p className="text-xs text-text-secondary">Get support</p>
						</button>
					</div>
				</div>

				{/* Developer Info */}
				<div className="mt-8 bg-surface/50 border border-border rounded-xl p-6">
					<h3 className="text-sm font-semibold text-text-secondary mb-3">
						<i className="fa-solid fa-info-circle mr-2" />
						Authentication Status
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
						<div>
							<p className="text-text-secondary mb-1">User ID:</p>
							<p className="text-accent">{user.user_id}</p>
						</div>
						<div>
							<p className="text-text-secondary mb-1">Auth Status:</p>
							<p className="text-green-500">Authenticated ✓</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
