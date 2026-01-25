import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

type Player = {
	id: number;
	name: string;
	age: number;
	position: string;
	country: string;
	club: string;
	image: string;
};

const players: Player[] = [
	{
		id: 1,
		name: "Jude Bellingham",
		age: 20,
		position: "Midfielder",
		country: "England",
		club: "Real Madrid",
		image: "/images/players-images/Jude Bellingham.webp",
	},
	{
		id: 2,
		name: "Jamal Musiala",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		club: "Bayern Munich",
		image: "/images/players-images/Jamal Musiala.jpg",
	},
	{
		id: 3,
		name: "Pedri",
		age: 21,
		position: "Midfielder",
		country: "Spain",
		club: "FC Barcelona",
		image: "/images/players-images/Pedri.webp",
	},
	{
		id: 4,
		name: "Gavi",
		age: 20,
		position: "Central Midfielder",
		country: "Spain",
		club: "FC Barcelona",
		image: "/images/players-images/Gavi.jpg",
	},
	{
		id: 5,
		name: "Bukayo Saka",
		age: 22,
		position: "Winger",
		country: "England",
		club: "Arsenal FC",
		image: "/images/players-images/Bukayo Saka.webp",
	},
	{
		id: 6,
		name: "Florian Wirtz",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		club: "Bayer Leverkusen",
		image: "/images/players-images/Florian Wirtz.webp",
	},
];

export default function PlayersRankings() {
	const { t } = useTranslation();
	return (
		<div className="space-y-3">
			{players.map((player, index) => (
				<div key={player.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-bg border border-border rounded-xl p-4 hover:shadow-sm transition">
					<div className="flex items-center gap-4 min-w-0">
						<div className="hidden sm:block w-8 text-xl font-black text-primary shrink-0">{index + 1}</div>

						<div className="w-14 h-14 rounded-full overflow-hidden bg-border shrink-0">
							<Image src={player.image} alt={player.name} width={56} height={56} className="object-cover w-full h-full" />
						</div>

						<div className="min-w-0">
							<div className="font-semibold text-text truncate">{player.name}</div>
							<div className="text-sm text-text-secondary">
								{t(player.position.toLowerCase().replace(/ /g, '_') as any)} • {player.age} {t('years')}
							</div>
						</div>
					</div>

					<div className="hidden sm:flex flex-col items-end text-sm gap-1 text-text-secondary">
						<div className="flex items-center gap-2">
							<i className="fa-solid fa-location-dot text-primary text-xs" />
							<span>{player.country}</span>
						</div>
						<div className="flex items-center gap-2">
							<i className="fa-solid fa-shield-halved text-primary text-xs" />
							<span>{player.club}</span>
						</div>
					</div>

					<div className="sm:hidden pt-3 border-t border-border flex items-center justify-between text-sm text-text-secondary">
						<div className="flex items-center gap-2">
							<i className="fa-solid fa-location-dot text-primary text-xs" />
							<span>{player.country}</span>
						</div>
						<div className="flex items-center gap-2">
							<i className="fa-solid fa-shield-halved text-primary text-xs" />
							<span>{player.club}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
