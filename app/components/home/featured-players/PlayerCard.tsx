type Player = {
	name: string;
	age: number;
	position: string;
	country: string;
	image: string;
	verified: boolean;
};

export default function PlayerCard({ player }: { player: Player }) {
	return (
		<div className="group bg-surface border border-border rounded-2xl p-3 transition hover:border-primary cursor-pointer flex flex-col">
			{/* Image */}
			<div className="relative mb-4">
				<img src={player.image} alt={player.name} className="w-full h-40 sm:h-60 object-cover rounded-xl" />

				{player.verified && (
					<div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-white px-1.5 py-1 rounded-full text-xs font-bold">
						<i className="fa-solid fa-circle-check" />
						Verified
					</div>
				)}

				<div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white">
					<i className="fa-solid fa-flag mr-1" />
					{player.country}
				</div>
			</div>

			{/* Info */}
			<div className="mb-2 sm:mb-4">
				<h3 className="text-md sm:text-lg font-bold text-text mb-1">{player.name}</h3>
				<div className="flex sm:items-center flex-col sm:flex-row gap-0 sm:gap-2 text-text-secondary text-sm">
					<span>{player.age} years</span>
					<span className="hidden sm:inline">•</span>
					<span className="font-semibold text-primary">{player.position}</span>
				</div>
			</div>
		</div>
	);
}
