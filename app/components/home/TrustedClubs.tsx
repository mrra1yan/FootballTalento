import Image from "next/image";

type Club = {
	id: number;
	name: string;
	logo: string;
};

const germanClubs: Club[] = [
	{
		id: 2,
		name: "Borussia Dortmund",
		logo: "https://upload.wikimedia.org/wikipedia/commons/6/67/Borussia_Dortmund_logo.svg",
	},
	{
		id: 3,
		name: "RB Leipzig",
		logo: "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg",
	},
	{
		id: 4,
		name: "Bayer 04 Leverkusen",
		logo: "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg",
	},
];

export default function TrustedGermanClubs() {
	return (
		<section id="trusted-german-clubs" className="py-20 sm:py-24 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="mb-14">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">Trusted by German Clubs & Academies</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">Professional football organizations across Germany trust FootballTalento to identify and evaluate emerging talent.</p>
				</header>

				<div
					className="
						grid
						grid-cols-2
						sm:grid-cols-3
						md:grid-cols-4
						lg:grid-cols-6
						gap-4
						sm:gap-6
						items-center
					"
				>
					{germanClubs.map((club) => (
						<div
							key={club.id}
							className="
								bg-surface
								border border-border
								rounded-xl
								h-24 sm:h-28
								flex items-center justify-center
								transition
								hover:shadow-md
							"
						>
							<Image src={club.logo} alt={`${club.name} logo`} width={120} height={120} className="object-contain max-h-14 sm:max-h-16 opacity-80 hover:opacity-100 transition-opacity" />
						</div>
					))}
				</div>

				<footer className="text-center mt-10 sm:mt-12">
					<p className="text-sm sm:text-base md:text-lg text-text-secondary">
						Join <span className="text-primary font-semibold">500+</span> clubs and academies discovering talent on FootballTalento
					</p>
				</footer>
			</div>
		</section>
	);
}
