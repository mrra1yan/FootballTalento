export default function SafetyTrust() {
	return (
		<section id="safety-trust" className="py-10 sm:py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<header className="text-center mb-12">
					<h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-text mb-4">Safety & Trust</h2>
					<p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-3xl mx-auto">Built to protect young athletes while helping them grow in a secure and verified environment.</p>
				</header>

				{/* ===== MOBILE STRUCTURE ===== */}
				<div className="space-y-6 lg:hidden">
					{/* Commitment */}
					<div className="bg-surface border border-border rounded-3xl p-6">
						<div className="text-primary text-3xl mb-4">
							<i className="fa-solid fa-heart" />
						</div>
						<h3 className="text-xl font-bold text-text mb-3">Our Commitment to Young Athletes</h3>
						<p className="text-sm text-text-secondary leading-relaxed">FootballTalento is designed with the safety and well-being of young players at its core. We align with international child protection standards, work with safeguarding organizations, and enforce a zero-tolerance policy for inappropriate behavior.</p>
					</div>

					{/* Safeguards list */}
					<div className="bg-surface border border-border rounded-2xl divide-y divide-border">
						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-user-shield text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">Parent-Controlled Profiles</h4>
								<p className="text-sm text-text-secondary">Parents retain full control over minor profiles, including visibility settings, connection approvals, and activity monitoring.</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-id-card text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">Verified Identities & KYC</h4>
								<p className="text-sm text-text-secondary">All users undergo identity verification. Clubs and scouts complete KYC checks to ensure accountability and trust.</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-robot text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">Anti-Fake AI Detection</h4>
								<p className="text-sm text-text-secondary">AI systems detect fake profiles, manipulated media, and fraudulent activity to maintain platform integrity.</p>
							</div>
						</div>

						<div className="flex gap-4 p-5">
							<i className="fa-solid fa-shield-halved text-primary text-lg mt-1" />
							<div>
								<h4 className="font-semibold text-text mb-1">GDPR & Child Protection</h4>
								<p className="text-sm text-text-secondary">Fully GDPR-compliant with enhanced protections for minors, including consent management and right-to-erasure controls.</p>
							</div>
						</div>
					</div>
				</div>

				<div className="hidden lg:grid grid-cols-5 gap-8">
					<div className="col-span-2 bg-surface border border-border rounded-3xl p-10">
						<div className="text-primary text-4xl mb-6">
							<i className="fa-solid fa-heart" />
						</div>
						<h3 className="text-2xl font-bold text-text mb-4">Our Commitment to Young Athletes</h3>
						<p className="text-base text-text-secondary leading-relaxed">FootballTalento is designed with the safety and well-being of young players at its core. We align with international child protection standards, work with safeguarding organizations, and enforce a zero-tolerance policy for inappropriate behavior.</p>
					</div>

					<div className="col-span-3 grid grid-cols-2 gap-6">
						{[
							["fa-user-shield", "Parent-Controlled Profiles", "Parents retain full control over minor profiles, including visibility settings, connection approvals, and activity monitoring."],
							["fa-id-card", "Verified Identities & KYC", "All users undergo identity verification. Clubs and scouts complete KYC checks to ensure accountability and trust."],
							["fa-robot", "Anti-Fake AI Detection", "AI systems detect fake profiles, manipulated media, and fraudulent activity to maintain platform integrity."],
							["fa-shield-halved", "GDPR & Child Protection", "Fully GDPR-compliant with enhanced protections for minors, including consent management and right-to-erasure controls."],
						].map(([icon, title, text]) => (
							<div key={title} className="bg-surface border border-border rounded-2xl p-6">
								<div className="flex gap-4">
									<div className="w-12 h-12 bg-bg border border-border rounded-xl flex items-center justify-center text-primary text-xl">
										<i className={`fa-solid ${icon}`} />
									</div>
									<div>
										<h4 className="font-semibold text-text mb-2">{title}</h4>
										<p className="text-sm text-text-secondary leading-relaxed">{text}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
