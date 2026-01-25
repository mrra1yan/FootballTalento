"use client";

import { useState } from "react";

type Testimonial = {
	id: number;
	role: "player" | "parent" | "scout";
	title: string;
	location: string;
	message: string;
	badge: string;
};

const testimonials: Testimonial[] = [
	{
		id: 1,
		role: "player",
		title: "U17 Midfielder",
		location: "Italy",
		message: "FootballTalento helped me get noticed by academies outside my region. Within a few months, I received invitations to multiple trials.",
		badge: "Academy Trial Secured",
	},
	{
		id: 2,
		role: "parent",
		title: "Parent of U15 Player",
		location: "Brazil",
		message: "As a parent, safety was my top priority. The platform allows me to control who contacts my child and monitor all interactions.",
		badge: "Verified Parent Account",
	},
	{
		id: 3,
		role: "scout",
		title: "Academy Scout",
		location: "Germany",
		message: "The verification and filtering save us significant time. We now focus only on players who truly match our development standards.",
		badge: "Verified Football Professional",
	},
	{
		id: 4,
		role: "player",
		title: "U19 Centre Back",
		location: "France",
		message: "The performance analytics and video tools helped me understand my weaknesses better. I improved my positioning and gained interest from semi-professional clubs.",
		badge: "Performance Profile Completed",
	},
	{
		id: 5,
		role: "parent",
		title: "Parent of U13 Player",
		location: "Netherlands",
		message: "Having transparency over who views my child’s profile gave me peace of mind. The platform feels structured and safe compared to social media exposure.",
		badge: "Parental Controls Enabled",
	},
	{
		id: 6,
		role: "player",
		title: "U18 Winger",
		location: "Nigeria",
		message: "I don’t have access to big academies locally, but FootballTalento allowed me to showcase my skills globally and connect with licensed scouts.",
		badge: "International Visibility Achieved",
	},
	{
		id: 7,
		role: "scout",
		title: "Youth Recruitment Manager",
		location: "Portugal",
		message: "Player data is clear, verified, and easy to filter. It reduces scouting time and helps us focus on players who fit our development model.",
		badge: "Verified Scout Account",
	},
	{
		id: 8,
		role: "player",
		title: "U16 Goalkeeper",
		location: "Poland",
		message: "Uploading match clips and tracking progress over time helped me stay motivated. Coaches could see my improvement, not just highlights.",
		badge: "Match Footage Verified",
	},
];


export default function Testimonials() {
	const [index, setIndex] = useState(0);

	const total = testimonials.length;
	const maxIndex = total - 3;

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
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">Success Stories</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">Real journeys from players, parents, and football professionals using FootballTalento.</p>
				</div>

				{/* Carousel */}
				<div className="relative overflow-hidden">
					<div
						className="flex transition-transform duration-700 ease-in-out"
						style={{
							transform: `translateX(-${index * (100 / 3)}%)`,
						}}
					>
						{testimonials.map((item) => (
							<div key={item.id} className="w-full md:w-1/2 lg:w-1/3 shrink-0 px-3">
								<div className="h-full bg-surface border border-border rounded-2xl p-6 transition hover:border-primary">
									<div className="flex items-center gap-4 mb-4">
										<div className="w-14 h-14 rounded-full bg-border flex items-center justify-center text-primary">
											<i className="fa-solid fa-user" />
										</div>
										<div>
											<div className="font-semibold text-text">{item.title}</div>
											<div className="text-sm text-text-secondary">{item.location}</div>
										</div>
									</div>

									<div className="flex text-primary mb-3">
										{Array.from({ length: 5 }).map((_, i) => (
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
							<button key={i} onClick={() => setIndex(i)} className={`w-2.5 h-2.5 rounded-full transition ${index === i ? "bg-primary" : "bg-border"}`} aria-label={`Go to slide ${i + 1}`} />
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
