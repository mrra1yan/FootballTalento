"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n";

export default function Footer() {
	const { t } = useTranslation();
	return (
		<footer className="bg-primary border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
				{/* Top */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center">
								<i className="fa-regular fa-futbol text-primary text-xl" />
							</div>
							<span className="text-2xl font-bold text-surface">FootballTalento</span>
						</Link>

						<p className="text-surface leading-relaxed mb-6 max-w-md">{t('footer_desc')}</p>

						<div className="flex gap-3">
							{["facebook-f", "twitter", "instagram", "youtube", "linkedin-in"].map((icon) => (
								<a key={icon} href="#" className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-surface hover:bg-surface hover:text-primary transition">
									<i className={`fab fa-${icon}`} />
								</a>
							))}
						</div>
					</div>

					{/* Platform */}
					<div>
						<h3 className="font-semibold text-surface mb-4">{t('footer_platform')}</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/#players" className="footer-link text-surface/90 hover:text-surface transition">
									{t('explore_players')}
								</Link>
							</li>
							<li>
								<Link href="/#rankings" className="footer-link text-surface/90 hover:text-surface transition">
									{t('rankings')}
								</Link>
							</li>
							<li>
								<Link href="/#stories" className="footer-link text-surface/90 hover:text-surface transition">
									{t('stories')}
								</Link>
							</li>
							<li>
								<Link href="/#how-it-works" className="footer-link text-surface/90 hover:text-surface transition">
									{t('how_it_works')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Register */}
					<div>
						<h3 className="font-semibold text-surface mb-4">{t('footer_register')}</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/register/player" className="footer-link text-surface/90 hover:text-surface transition">
									{t('player_reg')}
								</Link>
							</li>
							<li>
								<Link href="/register/club" className="footer-link text-surface/90 hover:text-surface transition">
									{t('club_reg')}
								</Link>
							</li>
							<li>
								<Link href="/register/scout" className="footer-link text-surface/90 hover:text-surface transition">
									{t('scout_reg')}
								</Link>
							</li>
							<li>
								<Link href="/register/parent" className="footer-link text-surface/90 hover:text-surface transition">
									{t('parent_account')}
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="font-semibold text-surface mb-4">{t('footer_legal')}</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/privacy-policy" className="footer-link text-surface/90 hover:text-surface transition">
									{t('privacy_policy')}
								</Link>
							</li>
							<li>
								<Link href="/terms" className="footer-link text-surface/90 hover:text-surface transition">
									{t('terms_of_service')}
								</Link>
							</li>
							<li>
								<Link href="/child-safety" className="footer-link text-surface/90 hover:text-surface transition">
									{t('child_safety')}
								</Link>
							</li>
							<li>
								<Link href="/cookies" className="footer-link text-surface/90 hover:text-surface transition">
									{t('cookie_policy')}
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom */}
			<div className="mt-16 pt-8 border-t border-surface/25">
				<p className="text-sm text-center text-text-muted">{t('all_rights_reserved', { year: new Date().getFullYear().toString() })}</p>
			</div>
		</footer>
	);
}
