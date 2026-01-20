import Image from "next/image";

type Player = {
	id: number;
	name: string;
	age: number;
	position: string;
	country: string;
	score: number;
	image: string;
};

const players: Player[] = [
	{
		id: 1,
		name: "Jude Bellingham",
		age: 20,
		position: "Midfielder",
		country: "England",
		score: 96,
		image: "/images/players-images/Jude Bellingham.webp",
	},
	{
		id: 2,
		name: "Jamal Musiala",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		score: 95,
		image: "/images/players-images/Jamal Musiala.jpg",
	},
	{
		id: 3,
		name: "Pedri",
		age: 21,
		position: "Midfielder",
		country: "Spain",
		score: 94,
		image: "/images/players-images/Pedri.webp",
	},
	{
		id: 4,
		name: "Gavi",
		age: 20,
		position: "Central Midfielder",
		country: "Spain",
		score: 93,
		image: "/images/players-images/Gavi.jpg",
	},
	{
		id: 5,
		name: "Bukayo Saka",
		age: 22,
		position: "Winger",
		country: "England",
		score: 92,
		image: "/images/players-images/Bukayo Saka.webp",
	},
	{
		id: 6,
		name: "Florian Wirtz",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		score: 91,
		image: "/images/players-images/Florian Wirtz.webp",
	},
];

export default function PlayersRankings() {
	return (
		<div className="space-y-3">
			{players.map((player, index) => (
				<div
					key={player.id}
					className="
						flex
						flex-col
						lg:flex-row
						lg:items-center
						lg:justify-between
						gap-4
						bg-background
						border border-border
						rounded-xl
						p-4 sm:p-6
						hover:shadow-sm
						transition
					"
				>
					{/* Left section */}
					<div className="flex items-center gap-4">
						<div className="w-8 text-xl font-black text-primary">{index + 1}</div>

						<div className="w-14 h-14 rounded-full overflow-hidden bg-border">
							<Image src={player.image} alt={player.name} width={56} height={56} className="object-cover w-full h-full" />
						</div>

						<div>
							<div className="font-semibold text-text">{player.name}</div>
							<div className="text-sm text-text-secondary">
								{player.position} • {player.age} years
							</div>
						</div>
					</div>

					{/* Right meta section */}
					<div className="flex justify-between lg:justify-end gap-6 text-center">
						<div>
							<div className="text-xs text-text-muted mb-1">Country</div>
							<div className="font-medium text-text">{player.country}</div>
						</div>

						<div>
							<div className="text-xs text-text-muted mb-1">PlayerScore</div>
							<div className="text-2xl font-black text-primary">{player.score}</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
