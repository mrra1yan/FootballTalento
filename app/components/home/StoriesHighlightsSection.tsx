"use client";

import { useRef } from "react";

type Story = {
	id: number;
	title: string;
	author: string;
	time: string;
	image: string;
	watched: boolean;
};

export default function StoriesHighlightsSection() {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const isDown = useRef(false);
	const startX = useRef(0);
	const scrollLeft = useRef(0);
	const velocity = useRef(0);
	const rafId = useRef<number | null>(null);

	const onMouseDown = (e: React.MouseEvent) => {
		if (!containerRef.current) return;
		isDown.current = true;
		startX.current = e.pageX;
		scrollLeft.current = containerRef.current.scrollLeft;
		velocity.current = 0;

		if (rafId.current) cancelAnimationFrame(rafId.current);
	};

	const onMouseMove = (e: React.MouseEvent) => {
		if (!isDown.current || !containerRef.current) return;
		e.preventDefault();

		const x = e.pageX;
		const walk = (x - startX.current) * 1.2;
		const prevScroll = containerRef.current.scrollLeft;

		containerRef.current.scrollLeft = scrollLeft.current - walk;
		velocity.current = containerRef.current.scrollLeft - prevScroll;
	};

	const stopDrag = () => {
		if (!containerRef.current) return;
		isDown.current = false;
		startMomentum();
	};

	const startMomentum = () => {
		if (!containerRef.current) return;
		const decay = 0.94;

		const step = () => {
			if (!containerRef.current) return;

			velocity.current *= decay;
			if (Math.abs(velocity.current) < 0.5) return;

			containerRef.current.scrollLeft += velocity.current;
			rafId.current = requestAnimationFrame(step);
		};

		rafId.current = requestAnimationFrame(step);
	};

	return (
		<section id="stories-highlights" className="py-5 sm:py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-5">
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text mb-3">Stories & Highlights</h2>
					<p className="text-base sm:text-lg text-text-secondary">Watch the latest player performances and training sessions</p>
				</div>

				{/* Stories Row */}
				<div ref={containerRef} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={stopDrag} onMouseLeave={stopDrag} className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none scrollbar-hide">
					{stories.map((story) => (
						<div key={story.id} className="shrink-0 min-w-24 sm:min-w-28 lg:min-w-32 text-center">
							<div className="relative mb-3">
								{/* OUTER RING */}
								<div className={`rounded-full p-0.75 ${story.watched ? "bg-border" : "bg-accent"}`}>
									{/* INNER RING */}
									<div className="rounded-full p-0.75 bg-bg">
										<div className="relative rounded-full overflow-hidden">
											<img src={story.image} alt={story.title} className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-cover" />

											{/* Play Overlay */}
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="bg-black/50 backdrop-blur-sm rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
													<i className="fa-solid fa-play text-white text-sm sm:text-base" />
												</div>
											</div>

											{/* Time Badge */}
											<div className="absolute bottom-1 right-1 bg-accent text-white text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-bold">{story.time}</div>
										</div>
									</div>
								</div>
							</div>

							<div>
								<div className="font-semibold text-sm text-text">{story.title}</div>
								<div className="text-xs text-text-muted">{story.author}</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

const stories: Story[] = [
	{
		id: 1,
		title: "Speed",
		author: "Carlos M.",
		time: "24h",
		watched: false,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/bcc5e8763a-62358f5ff2bc82a869b8.png",
	},
	{
		id: 2,
		title: "Dribbling",
		author: "Ana S.",
		time: "18h",
		watched: false,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/8a7654a8c1-d9432448f9aaf0085d3d.png",
	},
	{
		id: 3,
		title: "Training",
		author: "Pierre D.",
		time: "12h",
		watched: true,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/276d8aa975-a973e74a51d18ad833d9.png",
	},
	{
		id: 4,
		title: "Mentality",
		author: "Diego M.",
		time: "8h",
		watched: true,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/da6aa7429c-46023a87a9d900c55e86.png",
	},
	{
		id: 5,
		title: "Saves",
		author: "Emmanuel O.",
		time: "6h",
		watched: false,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/2c154900cc-ea8c5f85d84421dc95c9.png",
	},
	{
		id: 6,
		title: "Shooting",
		author: "Yuki T.",
		time: "4h",
		watched: true,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/691f2c8d60-f989afcc2310e74d86aa.png",
	},
	{
		id: 7,
		title: "Passing",
		author: "Sophie M.",
		time: "2h",
		watched: false,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/848b050459-91912682230fa0639346.png",
	},
	{
		id: 8,
		title: "Victory",
		author: "James W.",
		time: "1h",
		watched: true,
		image: "https://storage.googleapis.com/uxpilot-auth.appspot.com/62d135636a-3048e1f54982e91e894e.png",
	},
];
