type Testimonial = {
	id: number;
	role: "player" | "parent" | "scout";
	title: string;
	location: string;
	message: string;
	badge: string;
	icon: string;
};

const testimonials: Testimonial[] = [
	{
		id: 1,
		role: "player",
		title: "U17 Midfielder",
		location: "Italy",
		message: "FootballTalento helped me get noticed by academies outside my region. Within a few months, I received invitations to multiple trials.",
		badge: "Academy Trial Secured",
		icon: "fa-user",
	},
	{
		id: 2,
		role: "parent",
		title: "Parent of U15 Player",
		location: "Brazil",
		message: "As a parent, safety was my top priority. The platform allows me to control who contacts my child and monitor all interactions.",
		badge: "Verified Parent Account",
		icon: "fa-shield-heart",
	},
	{
		id: 3,
		role: "scout",
		title: "Academy Scout",
		location: "Germany",
		message: "The verification and filtering save us significant time. We now focus only on players who truly match our development standards.",
		badge: "Verified Football Professional",
		icon: "fa-building-columns",
	},
];

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-20 sm:py-24 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-14">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">Success Stories</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">Real journeys from players, parents, and football professionals using FootballTalento.</p>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{testimonials.map((item) => (
						<div key={item.id} className="bg-surface border border-border rounded-2xl p-6 transition hover:border-primary">
							<div className="flex items-center gap-4 mb-4">
								<div className="w-14 h-14 rounded-full bg-border flex items-center justify-center text-primary">
									<i className={`fa-solid ${item.icon}`} />
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
					))}
				</div>
			</div>
		</section>
	);
}
