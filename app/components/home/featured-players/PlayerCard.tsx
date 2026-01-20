import PlayerScoreRing from "./PlayerScoreRing";

type Player = {
	name: string;
	age: number;
	position: string;
	country: string;
	image: string;
	score: number;
	verified: boolean;
};

export default function PlayerCard({ player }: { player: Player }) {
	return (
		<div className="group bg-surface border border-border rounded-2xl p-4 sm:p-5 transition hover:border-primary cursor-pointer flex flex-col">
			{/* Image */}
			<div className="relative mb-4">
				<img src={player.image} alt={player.name} className="w-full h-56 sm:h-60 object-cover rounded-xl" />

				{player.verified && (
					<div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-white px-2 py-1 rounded-full text-xs font-bold">
						<i className="fa-solid fa-certificate" />
						Verified
					</div>
				)}

				<div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
					<i className="fa-solid fa-flag mr-1" />
					{player.country}
				</div>
			</div>

			{/* Info */}
			<div className="mb-4">
				<h3 className="text-lg font-bold text-text mb-1">{player.name}</h3>
				<div className="flex items-center gap-2 text-text-secondary text-sm">
					<span>{player.age} years</span>
					<span>•</span>
					<span className="font-semibold text-primary">{player.position}</span>
				</div>
			</div>

			{/* Score */}
			<div className="mt-auto flex items-center justify-between">
				<div>
					<div className="text-xs text-text-muted mb-1">PlayerScore</div>
					<div className="text-2xl font-black text-primary">{player.score}</div>
				</div>

				<PlayerScoreRing value={player.score} />
			</div>
		</div>
	);
}
