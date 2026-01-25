"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n";
import { getHomeContent, type HomeContent } from "@/lib/api/content";

export default function TrustedClubs() {
	const { t, language } = useTranslation();
	const [clubs, setClubs] = useState<HomeContent['clubs']>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchContent = async () => {
			try {
				const data = await getHomeContent(language);
				if (data.clubs && data.clubs.length > 0) {
					setClubs(data.clubs);
				}
			} catch (error) {
				console.error("Failed to load trusted clubs:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchContent();
	}, [language]);

	const trackRef = useRef<HTMLDivElement | null>(null);
	const isDragging = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);

	const fallbackClubs = [
		{
			id: 1,
			name: "Borussia Dortmund",
			logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
		},
		{
			id: 2,
			name: "RB Leipzig",
			logo: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
		},
		{
			id: 3,
			name: "Bayer 04 Leverkusen",
			logo: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
		},
	];

	const displayClubs = clubs.length > 0 ? clubs : fallbackClubs;

	const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
		const el = trackRef.current;
		if (!el) return;
		isDragging.current = true;
		startX.current = e.clientX;
		scrollLeft.current = el.scrollLeft;
		el.style.animationPlayState = "paused";
	};

	const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
		const el = trackRef.current;
		if (!el || !isDragging.current) return;
		const dx = e.clientX - startX.current;
		el.scrollLeft = scrollLeft.current - dx;
	};

	const onPointerUp = () => {
		const el = trackRef.current;
		if (!el) return;
		isDragging.current = false;
		el.style.animationPlayState = "running";
	};

	return (
		<section id="trusted-clubs" className="py-5 sm:py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="mb-8 text-center">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">{t('trusted_clubs_title')}</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">{t('trusted_clubs_desc')}</p>
				</header>

				<div className="relative overflow-hidden py-6">
					<div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent z-10" />
					<div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent z-10" />

					<div ref={trackRef} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerUp} className="flex gap-14 w-max cursor-grab active:cursor-grabbing overflow-x-scroll scrollbar-hide animate-partner-scroll">
						{displayClubs.concat(displayClubs).concat(displayClubs).map((club, i) => (
							<div key={`${club.id}-${i}`} className="flex flex-col items-center gap-2 shrink-0">
								{club.logo && (
									<Image src={club.logo} alt={`${club.name} logo`} width={72} height={72} className="object-contain h-10 sm:h-12 opacity-80" />
								)}
								<span className="text-xs text-text-muted whitespace-nowrap">{club.name}</span>
							</div>
						))}
					</div>
				</div>

				<div className="text-center mt-10 sm:mt-12">
					<p className="text-sm sm:text-base md:text-lg text-text-secondary">
						{t('join_500_clubs')}
					</p>
				</div>
			</div>

			<style jsx>{`
				@keyframes partner-scroll {
					from {
						transform: translateX(0);
					}
					to {
						transform: translateX(-33.33%);
					}
				}
				.animate-partner-scroll {
					animation: partner-scroll 40s linear infinite;
				}
			`}</style>
		</section>
	);
}
