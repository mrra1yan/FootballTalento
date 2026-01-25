"use client";

import { useTranslation } from "@/lib/i18n";

export default function HowItWorksSection() {
	const { t } = useTranslation();

	const steps = [
		{
			id: "01",
			icon: "fa-user-plus",
			title: t('step_1_title'),
			description: t('step_1_desc'),
		},
		{
			id: "02",
			icon: "fa-magnifying-glass",
			title: t('step_2_title'),
			description: t('step_2_desc'),
		},
		{
			id: "03",
			icon: "fa-comments",
			title: t('step_3_title'),
			description: t('step_3_desc'),
		},
	];

	return (
		<section id="how-it-works" className="py-5 sm:py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mx-auto mb-8">
					<h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-text mb-3 sm:mb-4">{t('how_it_works_title')}</h2>

					<p className="text-sm sm:text-base lg:text-lg text-text-secondary">{t('how_it_works_desc')}</p>
				</div>

				{/* Steps */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
					{steps.map((step) => (
						<div key={step.id} className="relative group bg-surface border border-border rounded-2xl px-4 py-8 sm:px-6 sm:py-10 lg:px-6 lg:py-10 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
							<span className="pointer-events-none absolute right-0 top-[5%] -translate-y-1/2 text-[72px] sm:text-[88px] lg:text-[96px] font-black text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 select-none">{step.id}</span>

							{/* Content */}
							<div className="relative z-10">
								<div className="mb-4 sm:mb-5">
									<div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-xl bg-primary border border-border flex items-center justify-center">
										<i className={`fa-solid ${step.icon} text-white text-2xl sm:text-3xl lg:text-4xl`} />
									</div>
								</div>

								<h3 className="text-base sm:text-lg font-bold text-text mb-2">{step.title}</h3>

								<p className="text-sm sm:text-base text-text-secondary">{step.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
