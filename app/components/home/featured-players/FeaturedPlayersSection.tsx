"use client";

import PlayerCard from "./PlayerCard";

const players = [
	{
		name: "Manuel Neuer",
		age: 38,
		position: "Goalkeeper",
		country: "Germany",
		image: "/images/players-images/Manuel Neuer.jpg",
		score: 94,
		verified: true,
	},
	{
		name: "Joshua Kimmich",
		age: 29,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Joshua Kimmich.jpg",
		score: 93,
		verified: true,
	},
	{
		name: "Toni Kroos",
		age: 34,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Toni Kroos.webp",
		score: 92,
		verified: true,
	},
	{
		name: "Thomas Müller",
		age: 34,
		position: "Attacking Midfielder",
		country: "Germany",
		image: "/images/players-images/Thomas Müller.jpg",
		score: 91,
		verified: true,
	},
	{
		name: "Ilkay Gündogan",
		age: 33,
		position: "Midfielder",
		country: "Germany",
		image: "/images/players-images/Ilkay Gündogan.jpg",
		score: 90,
		verified: true,
	},
	{
		name: "Jamal Musiala",
		age: 21,
		position: "Attacking Midfielder",
		country: "Germany",
		image: "/images/players-images/Jamal Musiala.jpg",
		score: 91,
		verified: false,
	},
	{
		name: "Kai Havertz",
		age: 24,
		position: "Forward",
		country: "Germany",
		image: "/images/players-images/Kai Havertz.webp",
		score: 89,
		verified: true,
	},
	{
		name: "Antonio Rüdiger",
		age: 31,
		position: "Defender",
		country: "Germany",
		image: "/images/players-images/Antonio Rüdiger.jpg",
		score: 90,
		verified: true,
	},
];




export default function FeaturedPlayersSection() {
	return (
		<section id="featured-players" className="py-16 sm:py-20 lg:py-24 bg-bg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-14">
					<div>
						<h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-text mb-2">Top Rising Players</h2>
						<p className="text-text-secondary text-sm sm:text-base lg:text-lg">Discover the next generation of football stars</p>
					</div>

					<button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-surface text-text font-semibold hover:bg-primary hover:text-white transition">
						View Full Rankings
						<i className="fa-solid fa-arrow-right text-sm" />
					</button>
				</div>

				{/* Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{players.map((player) => (
						<PlayerCard key={player.name} player={player} />
					))}
				</div>
			</div>
		</section>
	);
}
