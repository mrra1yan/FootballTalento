import Image from "next/image";
import { useTranslation } from "@/lib/i18n";

type Club = {
	id: number;
	name: string;
	country: string;
	rank: number;
	score: number;
	logo: string;
};

const clubs: Club[] = [
	{
		id: 1,
		name: "Real Madrid CF",
		country: "Spain",
		rank: 1,
		score: 98,
		logo: "/images/clubs-images/Real Madrid CF.jpg",
	},
	{
		id: 2,
		name: "FC Bayern Munich",
		country: "Germany",
		rank: 2,
		score: 97,
		logo: "/images/clubs-images/FC Bayern Munich.svg",
	},
	{
		id: 3,
		name: "FC Barcelona",
		country: "Spain",
		rank: 3,
		score: 96,
		logo: "/images/clubs-images/FC Barcelona.png",
	},
];

export default function ClubsRankings() {
	const { t } = useTranslation();
	return (
		<div className="space-y-3">
			{clubs.map((club) => (
				<div key={club.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-bg border border-border rounded-xl p-4 sm:p-6 hover:shadow-sm transition">
					<div className="flex items-center gap-4 min-w-0">
						<div className="hidden sm:block w-8 text-xl font-black text-primary shrink-0">{club.rank}</div>

						<div className="w-12 h-12 rounded bg-border flex items-center justify-center shrink-0">
							<Image src={club.logo} alt={club.name} width={40} height={40} className="object-contain" />
						</div>

						<div className="min-w-0">
							<div className="font-semibold text-text truncate">{club.name}</div>
							<div className="text-sm text-text-secondary">{club.country}</div>
						</div>
					</div>

					<div className="hidden sm:block text-right">
						<div className="text-xs text-text-muted mb-1">{t('club_score')}</div>
						<div className="text-2xl font-black text-primary">{club.score}</div>
					</div>

					<div className="sm:hidden pt-3 border-t border-border flex items-center justify-between text-sm">
						<span className="text-text-secondary">{t('club_score')}</span>
						<span className="text-xl font-black text-primary">{club.score}</span>
					</div>
				</div>
			))}
		</div>
	);
}
