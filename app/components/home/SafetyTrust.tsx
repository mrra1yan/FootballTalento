"use client";

import { useTranslation } from "@/lib/i18n";

export default function SafetyTrust() {
	const { t } = useTranslation();
	return (
		<section id="safety-trust" className="py-10 sm:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="text-center mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">{t('safety_trust_title')}</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">{t('safety_trust_desc')}</p>
				</header>

				{/* ===== MOBILE STRUCTURE ===== */}
				<div className="space-y-6 lg:hidden">
					{/* Commitment */}
					<div className="bg-surface border border-border rounded-3xl p-6">
						<div className="text-primary text-3xl mb-4">
							<i className="fa-solid fa-heart" />
						</div>
						<h3 className="text-xl font-bold text-text mb-3">{t('our_commitment')}</h3>
						<p className="text-sm text-text-secondary leading-relaxed">{t('commitment_desc')}</p>
					</div>

					{/* Safeguards list */}
					<div className="bg-surface border border-border rounded-2xl divide-y divide-border">
						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-user-shield text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">{t('parent_controlled_title')}</h4>
								<p className="text-sm text-text-secondary">{t('parent_controlled_desc')}</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-id-card text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">{t('verified_identities_title')}</h4>
								<p className="text-sm text-text-secondary">{t('verified_identities_desc')}</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-robot text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">{t('anti_fake_title')}</h4>
								<p className="text-sm text-text-secondary">{t('anti_fake_desc')}</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-shield-halved text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">{t('gdpr_title')}</h4>
								<p className="text-sm text-text-secondary">{t('gdpr_desc')}</p>
							</div>
						</div>
					</div>
				</div>

				<div className="hidden lg:grid grid-cols-5 gap-8">
					<div className="col-span-2 bg-surface border border-border rounded-3xl p-10">
						<div className="text-primary text-4xl mb-6">
							<i className="fa-solid fa-heart" />
						</div>
						<h3 className="text-2xl font-bold text-text mb-4">{t('our_commitment')}</h3>
						<p className="text-base text-text-secondary leading-relaxed">{t('commitment_desc')}</p>
					</div>

					<div className="col-span-3 grid grid-cols-2 gap-6">
						{[
							["fa-user-shield", t('parent_controlled_title'), t('parent_controlled_desc')],
							["fa-id-card", t('verified_identities_title'), t('verified_identities_desc')],
							["fa-robot", t('anti_fake_title'), t('anti_fake_desc')],
							["fa-shield-halved", t('gdpr_title'), t('gdpr_desc')],
						].map(([icon, title, text]) => (
							<div key={title} className="bg-surface border border-border rounded-2xl p-6">
								<div className="flex gap-4">
									<div className="w-12 h-12 bg-bg border border-border rounded-xl flex items-center justify-center text-primary text-xl">
										<i className={`fa-solid ${icon}`} />
									</div>
									<div>
										<h4 className="font-semibold text-text mb-2">{title}</h4>
										<p className="text-sm text-text-secondary leading-relaxed">{text}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
