"use client";

import { useTranslation } from "@/lib/i18n";

type Player = {
	name: string;
	age: number;
	position: string;
	country: string;
	image: string;
	verified: boolean;
};

export default function PlayerCard({ player }: { player: Player }) {
	const { t } = useTranslation();
	return (
		<div className="group bg-surface border border-border rounded-2xl p-3 transition hover:border-primary cursor-pointer flex flex-col">
			{/* Image */}
			<div className="relative mb-4">
				<img src={player.image} alt={player.name} className="w-full h-40 sm:h-60 object-cover rounded-xl" />

				{player.verified && (
					<div className="absolute top-3 right-3 flex items-center gap-1 bg-primary text-white px-1.5 py-1 rounded-full text-xs font-bold">
						<i className="fa-solid fa-circle-check" />
						{t('verified_badge')}
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
					<span>{player.age} {t('years')}</span>
					<span className="hidden sm:inline">•</span>
					<span className="font-semibold text-primary">
						{t(player.position.toLowerCase().replace(/ /g, '_') as any)}
					</span>
				</div>
			</div>
		</div>
	);
}
