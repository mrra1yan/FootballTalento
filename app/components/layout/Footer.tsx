import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-primary border-t border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8">
				{/* Top */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
					{/* Brand */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-3 mb-6">
							<div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center">
								<i className="fa-regular fa-futbol text-primary text-xl" />
							</div>
							<span className="text-2xl font-bold text-surface">FootballTalento</span>
						</div>

						<p className="text-surface leading-relaxed mb-6 max-w-md">The global platform where players showcase skills, clubs find talent, and scouts discover the next generation.</p>

						<div className="flex gap-3">
							{["facebook-f", "twitter", "instagram", "youtube", "linkedin-in"].map((icon) => (
								<a key={icon} href="#" className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-surface hover:bg-surface hover:text-primary transition">
									<i className={`fab fa-${icon}`} />
								</a>
							))}
						</div>
					</div>

					{/* Platform */}
					<div>
						<h3 className="font-semibold text-surface mb-4">Platform</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/#players" className="footer-link text-surface/90 hover:text-surface transition">
									Explore Players
								</Link>
							</li>
							<li>
								<Link href="/#rankings" className="footer-link text-surface/90 hover:text-surface transition">
									Rankings
								</Link>
							</li>
							<li>
								<Link href="/#stories" className="footer-link text-surface/90 hover:text-surface transition">
									Stories
								</Link>
							</li>
							<li>
								<Link href="/#how-it-works" className="footer-link text-surface/90 hover:text-surface transition">
									How It Works
								</Link>
							</li>
						</ul>
					</div>

					{/* Register */}
					<div>
						<h3 className="font-semibold text-surface mb-4">Register</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/register/player" className="footer-link text-surface/90 hover:text-surface transition">
									Player Registration
								</Link>
							</li>
							<li>
								<Link href="/register/club" className="footer-link text-surface/90 hover:text-surface transition">
									Club Registration
								</Link>
							</li>
							<li>
								<Link href="/register/scout" className="footer-link text-surface/90 hover:text-surface transition">
									Scout Registration
								</Link>
							</li>
							<li>
								<Link href="/register/parent" className="footer-link text-surface/90 hover:text-surface transition">
									Parent Account
								</Link>
							</li>
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="font-semibold text-surface mb-4">Legal</h3>
						<ul className="space-y-3 text-sm">
							<li>
								<Link href="/privacy-policy" className="footer-link text-surface/90 hover:text-surface transition">
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link href="/terms" className="footer-link text-surface/90 hover:text-surface transition">
									Terms of Service
								</Link>
							</li>
							<li>
								<Link href="/child-safety" className="footer-link text-surface/90 hover:text-surface transition">
									Child Safety Policy
								</Link>
							</li>
							<li>
								<Link href="/cookies" className="footer-link text-surface/90 hover:text-surface transition">
									Cookie Policy
								</Link>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-16 pt-8 border-t border-surface/25">
					<p className="text-sm text-center text-text-muted">© {new Date().getFullYear()} FootballTalento. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
