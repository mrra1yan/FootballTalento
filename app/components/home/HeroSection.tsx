"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "@/lib/i18n";
import { getHomeContent, type HomeContent } from "@/lib/api/content";

export default function HeroSection() {
	const { t, language } = useTranslation();
	const [slides, setSlides] = useState<HomeContent['slides']>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const data = await getHomeContent(language);
				if (data.slides && data.slides.length > 0) {
					setSlides(data.slides);
				}
			} catch {
				// Silently fail - will use fallback slides
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, [language]);

	const [active, setActive] = useState(0);
	const [isPaused, setIsPaused] = useState(false);

	// Fallback slides if none returned from API
	const effectiveSlides = slides.length > 0 ? slides : [
		{
			id: 1,
			image: "/images/Hero Image 1.png",
			title: t('hero_title_1'),
			badges: [t('hero_badge_verified'), t('hero_badge_global'), t('hero_badge_youth')],
			description: t('hero_desc_1'),
			highlights: [t('hero_badge_verified'), t('hero_badge_global'), t('hero_badge_youth')],
			cta1: { text: t('hero_cta_create'), link: '/auth/register' },
			cta2: { text: t('hero_cta_explore'), link: '/#players' }
		},
		{
			id: 2,
			image: "/images/Hero Image 2.jpg",
			title: t('hero_title_2'),
			badges: [t('hero_badge_verified'), t('hero_badge_global'), t('hero_badge_youth')],
			description: t('hero_desc_2'),
			highlights: [t('hero_badge_verified'), t('hero_badge_global'), t('hero_badge_youth')],
			cta1: { text: t('hero_cta_create'), link: '/auth/register' },
			cta2: { text: t('hero_cta_explore'), link: '/#players' }
		}
	];

	const totalSlides = effectiveSlides.length;

	const handleNext = () => {
		setActive((prev) => (prev + 1) % totalSlides);
	};

	const handlePrev = () => {
		setActive((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
	};

	useEffect(() => {
		if (isPaused || totalSlides <= 1) return;

		const interval = setInterval(() => {
			setActive((prev) => (prev + 1) % totalSlides);
		}, 7000);

		return () => clearInterval(interval);
	}, [isPaused, totalSlides]);

	useEffect(() => {
		if (!isPaused) return;

		const resumeTimer = setTimeout(() => {
			setIsPaused(false);
		}, 10000); // resume autoplay after 10s

		return () => clearTimeout(resumeTimer);
	}, [isPaused]);

	const slide = effectiveSlides[active];

	return (
		<section className="relative overflow-hidden bg-black">
			<div className="absolute inset-0">
				{effectiveSlides.map((s, i) => (
					<div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}>
						{s.image && <Image src={s.image} alt={s.title} fill sizes="100vw" priority={i === 0} className="object-cover scale-105" />}
					</div>
				))}
				<div className="absolute inset-0 bg-black/80" />
			</div>

			<div
				className="
					absolute z-20
					bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4
					sm:bottom-auto sm:left-auto sm:right-6 sm:top-1/2 sm:-translate-y-1/2 sm:translate-x-0 sm:flex-col
				"
			>
				<button
					onClick={() => {
						setIsPaused(true);
						handlePrev();
					}}
					aria-label="Previous slide"
					className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center"
				>
					<i className="fa-solid fa-chevron-up -rotate-90 sm:rotate-0 text-sm transition-transform" />
				</button>

				<div className="flex gap-3 sm:flex-col">
					{effectiveSlides.map((_, i) => (
						<button
							key={i}
							onClick={() => {
								setIsPaused(true);
								setActive(i);
							}}
							aria-label={`Go to slide ${i + 1}`}
							className={`w-2.5 h-2.5 rounded-full transition-all ${active === i ? "bg-accent scale-125" : "bg-white/40 hover:bg-white"}`}
						/>
					))}
				</div>

				<button
					onClick={() => {
						setIsPaused(true);
						handleNext();
					}}
					aria-label="Next slide"
					className="w-8 h-8 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition flex items-center justify-center"
				>
					<i className="fa-solid fa-chevron-down -rotate-90 sm:rotate-0 text-sm transition-transform" />
				</button>
			</div>

			<div className="relative z-10 min-h-[90vh] sm:min-h-screen flex items-center">
				<div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 sm:pt-0">
					<div key={slide.id} className="max-w-xl lg:max-w-4xl animate-slide-up">
						{/* Badges */}
						<div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
							{slide.badges?.map((badge, idx) => (
								<Badge key={idx} icon={idx === 0 ? "fa-shield-halved" : idx === 1 ? "fa-globe" : "fa-child-reaching"} text={badge} />
							))}
						</div>

						{/* Heading */}
						<h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
							{slide.title}
							<br />
							{slide.highlights?.map((hl, idx) => (
								<span key={idx} className={`${idx === 0 ? "text-accent" : idx === 1 ? "text-secondary" : ""} mr-2`}>{hl}</span>
							))}
						</h1>

						{/* Description */}
						<p className="text-sm sm:text-lg text-white/80 max-w-2xl mb-6 sm:mb-10">{slide.description}</p>

						{/* CTA */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
							{slide.cta1?.text && (
								<a href={slide.cta1.link} className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition flex items-center justify-center">
									<i className="fa-solid fa-user-plus mr-2" />
									{slide.cta1.text}
								</a>
							)}
							{slide.cta2?.text && (
								<a href={slide.cta2.link} className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition flex items-center justify-center">
									<i className="fa-solid fa-compass mr-2" />
									{slide.cta2.text}
								</a>
							)}
						</div>

						{/* Trust Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
							<TrustItem icon="fa-certificate" title={t('trust_profiles')} value={t('trust_profiles_val')} />
							<TrustItem icon="fa-ranking-star" title={t('trust_rankings')} value={t('trust_rankings_val')} />
							<TrustItem icon="fa-shield-heart" title={t('trust_youth')} value={t('trust_youth_val')} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

function Badge({ icon, text }: { icon: string; text: string }) {
	return (
		<span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/20 text-xs sm:text-sm text-white font-semibold">
			<i className={`fa-solid ${icon}`} />
			{text}
		</span>
	);
}

function TrustItem({ icon, title, value }: { icon: string; title: string; value: string }) {
	return (
		<div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20 text-white">
			<i className={`fa-solid ${icon} text-accent`} />
			<div>
				<div className="text-xs sm:text-sm text-white/70">{title}</div>
				<div className="font-bold">{value}</div>
			</div>
		</div>
	);
}