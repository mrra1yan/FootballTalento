"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const slides = [
	{
		id: 1,
		image: "/images/Hero Image 1.png",
		title: "Discover Football Talent.",
		highlight: ["Verified.", "Ranked.", "Global."],
		description: "A global platform where players showcase skills and get discovered by clubs and scouts worldwide.",
	},
	{
		id: 2,
		image: "/images/Hero Image 2.jpg",
		title: "Find the Next Generation.",
		highlight: ["Trusted.", "Data-Driven.", "Worldwide."],
		description: "Clubs and academies access verified player profiles, rankings, and performance insights.",
	},
	{
		id: 3,
		image: "/images/Hero Image 3.webp",
		title: "Scout Smarter.",
		highlight: ["Verified.", "Transparent.", "Efficient."],
		description: "Professional scouts discover talent faster with real performance data and video analysis.",
	},
];

export default function HeroSection() {
	const [active, setActive] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    
    const handleNext = () => {
		setActive((prev) => (prev + 1) % slides.length);
	};

	const handlePrev = () => {
		setActive((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
	};



	
	useEffect(() => {
		if (isPaused) return;

		const interval = setInterval(() => {
			setActive((prev) => (prev + 1) % slides.length);
		}, 7000);

		return () => clearInterval(interval);
	}, [isPaused, slides.length]);

	useEffect(() => {
		if (!isPaused) return;

		const resumeTimer = setTimeout(() => {
			setIsPaused(false);
		}, 10000); // resume autoplay after 10s

		return () => clearTimeout(resumeTimer);
	}, [isPaused]);



	const slide = slides[active];

	return (
		<section className="relative overflow-hidden bg-black">
			<div className="absolute inset-0">
				{slides.map((s, i) => (
					<div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === active ? "opacity-100" : "opacity-0"}`}>
						<Image src={s.image} alt={s.title} fill sizes="100vw" priority={i === 0} className="object-cover scale-105" />
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
					{slides.map((_, i) => (
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
							<Badge icon="fa-shield-halved" text="Verified Platform" />
							<Badge icon="fa-globe" text="Global Network" />
							<Badge icon="fa-child-reaching" text="Youth Safe" />
						</div>

						{/* Heading */}
						<h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-4 sm:mb-6">
							{slide.title}
							<br />
							<span className="text-accent mr-2">{slide.highlight[0]}</span>
							<span className="text-secondary mr-2">{slide.highlight[1]}</span>
							<span>{slide.highlight[2]}</span>
						</h1>

						{/* Description */}
						<p className="text-sm sm:text-lg text-white/80 max-w-2xl mb-6 sm:mb-10">{slide.description}</p>

						{/* CTA */}
						<div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-12">
							<button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-accent text-white font-bold hover:opacity-90 transition">
								<i className="fa-solid fa-user-plus mr-2" />
								Create Player Profile
							</button>
							<button className="px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-white/10 border border-white/20 text-white font-bold hover:bg-white/20 transition">
								<i className="fa-solid fa-compass mr-2" />
								Explore Players
							</button>
						</div>

						{/* Trust Grid */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl">
							<TrustItem icon="fa-certificate" title="Verified Profiles" value="100% Secure" />
							<TrustItem icon="fa-ranking-star" title="Global Rankings" value="Live Updates" />
							<TrustItem icon="fa-shield-heart" title="Youth Protection" value="Parent Control" />
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