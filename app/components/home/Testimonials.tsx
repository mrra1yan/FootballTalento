"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n";
import { getHomeContent, type HomeContent } from "@/lib/api/content";

export default function Testimonials() {
	const { t, language } = useTranslation();
	const [reviews, setReviews] = useState<HomeContent['reviews']>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const data = await getHomeContent(language);
				if (data.reviews && data.reviews.length > 0) {
					setReviews(data.reviews);
				}
			} catch (error) {
				console.error("Failed to load reviews:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, [language]);

	const [index, setIndex] = useState(0);

	// Fallback if no dynamic reviews
	const effectiveReviews = reviews.length > 0 ? reviews : [
		{
			id: 1,
			name: "U17 Midfielder",
			role: "player",
			location: "Italy",
			message: "FootballTalento helped me get noticed by academies outside my region. Within a few months, I received invitations to multiple trials.",
			badge: "Academy Trial Secured",
			rating: 5
		},
		{
			id: 2,
			name: "Parent of U15 Player",
			role: "parent",
			location: "Brazil",
			message: "As a parent, safety was my top priority. The platform allows me to control who contacts my child and monitor all interactions.",
			badge: "Verified Parent Account",
			rating: 5
		},
		{
			id: 3,
			name: "Academy Scout",
			role: "scout",
			location: "Germany",
			message: "The verification and filtering save us significant time. We now focus only on players who truly match our development standards.",
			badge: "Verified Football Professional",
			rating: 5
		}
	];

	const total = effectiveReviews.length;
	// Show up to 3 items at once, so max index is total - 3 (or 0 if less than 3)
	const maxIndex = Math.max(0, total - 3);

	const next = () => {
		setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
	};

	const prev = () => {
		setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
	};

	return (
		<section id="testimonials" className="py-10 sm:py-18 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-8">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">{t('success_stories_title')}</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">{t('success_stories_desc')}</p>
				</div>

				{/* Carousel */}
				<div className="relative overflow-hidden">
					<div
						className="flex transition-transform duration-700 ease-in-out"
						style={{
							transform: `translateX(-${index * (total > 0 ? (100 / Math.min(total, 3)) : 0)}%)`,
						}}
					>
						{effectiveReviews.map((item) => (
							<div key={item.id} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3">
								<div className="h-full bg-surface border border-border rounded-2xl p-6 transition hover:border-primary">
									<div className="flex items-center gap-4 mb-4">
										<div className="w-14 h-14 rounded-full bg-border flex items-center justify-center text-primary">
											<i className="fa-solid fa-user" />
										</div>
										<div>
											<div className="font-semibold text-text">{item.name}</div>
											<div className="text-sm text-text-secondary">{item.location}</div>
										</div>
									</div>

									<div className="flex text-primary mb-3">
										{Array.from({ length: item.rating || 5 }).map((_, i) => (
											<i key={i} className="fa-solid fa-star" />
										))}
									</div>

									<p className="text-sm text-text-secondary leading-relaxed mb-4">{item.message}</p>

									<div className="flex items-center gap-2 text-sm text-primary">
										<i className="fa-solid fa-circle-check" />
										<span>{item.badge}</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Controls */}
				<div className="mt-6 flex items-center justify-center gap-6">
					<button onClick={prev} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:border-primary transition" aria-label="Previous">
						<i className="fa-solid fa-chevron-left" />
					</button>

					<div className="flex items-center gap-2">
						{Array.from({ length: maxIndex + 1 }).map((_, i) => (
							<button
								key={i}
								onClick={() => setIndex(i)}
								className={`w-2.5 h-2.5 rounded-full transition ${index === i ? "bg-primary" : "bg-border"}`}
								aria-label={`Go to slide ${i + 1}`}
							/>
						))}
					</div>

					<button onClick={next} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-primary hover:border-primary transition" aria-label="Next">
						<i className="fa-solid fa-chevron-right" />
					</button>
				</div>
			</div>
		</section>
	);
}
