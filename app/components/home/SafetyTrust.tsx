export default function SafetyTrust() {
	return (
		<section id="safety-trust" className="py-20 sm:py-24 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<header className="text-center mb-14">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">Safety & Trust</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">Built to protect young athletes while helping them grow in a secure and verified environment.</p>
				</header>

				{/* Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Card 1 */}
					<div className="bg-surface border border-border rounded-2xl p-6 text-center transition hover:shadow-sm">
						<div className="w-16 h-16 mx-auto mb-5 bg-background border border-border rounded-xl flex items-center justify-center text-primary text-2xl">
							<i className="fa-solid fa-user-shield" />
						</div>
						<h3 className="text-lg font-semibold text-text mb-3">Parent-Controlled Profiles</h3>
						<p className="text-sm text-text-secondary leading-relaxed">Parents retain full control over minor profiles, including visibility settings, connection approvals, and activity monitoring.</p>
					</div>

					{/* Card 2 */}
					<div className="bg-surface border border-border rounded-2xl p-6 text-center transition hover:shadow-sm">
						<div className="w-16 h-16 mx-auto mb-5 bg-background border border-border rounded-xl flex items-center justify-center text-primary text-2xl">
							<i className="fa-solid fa-id-card" />
						</div>
						<h3 className="text-lg font-semibold text-text mb-3">Verified Identities & KYC</h3>
						<p className="text-sm text-text-secondary leading-relaxed">All users undergo identity verification. Clubs and scouts complete KYC checks to ensure accountability and trust.</p>
					</div>

					{/* Card 3 */}
					<div className="bg-surface border border-border rounded-2xl p-6 text-center transition hover:shadow-sm">
						<div className="w-16 h-16 mx-auto mb-5 bg-background border border-border rounded-xl flex items-center justify-center text-primary text-2xl">
							<i className="fa-solid fa-robot" />
						</div>
						<h3 className="text-lg font-semibold text-text mb-3">Anti-Fake AI Detection</h3>
						<p className="text-sm text-text-secondary leading-relaxed">AI systems detect fake profiles, manipulated media, and fraudulent activity to maintain platform integrity.</p>
					</div>

					{/* Card 4 */}
					<div className="bg-surface border border-border rounded-2xl p-6 text-center transition hover:shadow-sm">
						<div className="w-16 h-16 mx-auto mb-5 bg-background border border-border rounded-xl flex items-center justify-center text-primary text-2xl">
							<i className="fa-solid fa-shield-halved" />
						</div>
						<h3 className="text-lg font-semibold text-text mb-3">GDPR & Child Protection</h3>
						<p className="text-sm text-text-secondary leading-relaxed">Fully GDPR-compliant with enhanced protections for minors, including consent management and right-to-erasure controls.</p>
					</div>
				</div>

				{/* Commitment Block */}
				<div className="mt-16 bg-surface border border-border rounded-3xl p-8 sm:p-10 lg:p-12 text-center">
					<div className="max-w-3xl mx-auto">
						<div className="text-primary text-4xl mb-5">
							<i className="fa-solid fa-heart" />
						</div>
						<h3 className="text-2xl sm:text-3xl font-bold text-text mb-4">Our Commitment to Young Athletes</h3>
						<p className="text-sm sm:text-base md:text-lg text-text-secondary leading-relaxed">FootballTalento is designed with the safety and well-being of young players at its core. We align with international child protection standards, work with safeguarding organizations, and enforce a zero-tolerance policy for inappropriate behavior.</p>
					</div>
				</div>
			</div>
		</section>
	);
}
