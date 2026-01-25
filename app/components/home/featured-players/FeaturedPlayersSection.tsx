"use client";

import PlayerCard from "./PlayerCard";
import { useTranslation } from "@/lib/i18n";

const players = [
	{
		name: "Manuel Neuer",
		age: 38,
		position: "Goalkeeper",
		country: "Germany",
		image: "/images/players-images/Manuel Neuer.jpg",
		verified: true,
	},
	{
		name: "Joshua Kimmich",
		age: 29,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Joshua Kimmich.jpg",
		verified: true,
	},
	{
		name: "Toni Kroos",
		age: 34,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Toni Kroos.webp",
		verified: true,
	},
	{
		name: "Thomas Müller",
		age: 34,
		position: "Attacking Midfielder",
		country: "Germany",
		image: "/images/players-images/Thomas Müller.jpg",
		verified: true,
	},
	{
		name: "Ilkay Gündogan",
		age: 33,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Ilkay Gündogan.jpg",
		verified: true,
	},
	{
		name: "Jamal Musiala",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		image: "/images/players-images/Jamal Musiala.jpg",
		verified: false,
	},
	{
		name: "Kai Havertz",
		age: 24,
		position: "Forward",
		country: "Germany",
		image: "/images/players-images/Kai Havertz.webp",
		verified: true,
	},
	{
		name: "Antonio Rüdiger",
		age: 31,
		position: "Defender",
		country: "Germany",
		image: "/images/players-images/Antonio Rüdiger.jpg",
		verified: true,
	},
];




export default function FeaturedPlayersSection() {
	const { t } = useTranslation();
	return (
		<section id="featured-players" className="pt-10 pb-6 sm:pt-16 sm:pb-8 lg:pt-16 lg:pb-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-5">
					<div>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text mb-2">{t('featured_players')}</h2>
						<p className="text-text-secondary text-sm sm:text-base lg:text-lg">{t('featured_players_desc')}</p>
					</div>

					<button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-accent text-white font-semibold hover:bg-primary hover:text-white transition">
						{t('view_full_rankings')}
						<i className="fa-solid fa-arrow-right text-sm" />
					</button>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
					{players.map((player) => (
						<PlayerCard key={player.name} player={player} />
					))}
				</div>
			</div>
		</section>
	);
}
