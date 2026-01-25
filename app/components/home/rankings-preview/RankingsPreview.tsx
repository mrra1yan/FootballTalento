"use client";

import { useState } from "react";
import PlayersRankings from "./PlayersRankings";
import ClubsRankings from "./ClubsRankings";
import { useTranslation } from "@/lib/i18n";

export default function RankingsPreview() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<"players" | "clubs">("players");

	return (
		<section id="rankings-preview" className="py-5 sm:py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="text-center mb-5">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">{t('rankings_preview_title')}</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">{t('rankings_preview_desc')}</p>
				</header>

				<div className="bg-surface border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
					<div className="flex gap-8 border-b border-border mb-6">
						<button onClick={() => setActiveTab("players")} className={`pb-4 font-semibold border-b-2 transition ${activeTab === "players" ? "text-primary border-primary" : "text-text-secondary border-transparent hover:text-text"}`}>
							<i className="fa-solid fa-user mr-2" />
							{t('players')}
						</button>

						<button onClick={() => setActiveTab("clubs")} className={`pb-4 font-semibold border-b-2 transition ${activeTab === "clubs" ? "text-primary border-primary" : "text-text-secondary border-transparent hover:text-text"}`}>
							<i className="fa-solid fa-building mr-2" />
							{t('clubs')}
						</button>
					</div>

					{activeTab === "players" ? <PlayersRankings /> : <ClubsRankings />}
				</div>
			</div>
		</section>
	);
}
