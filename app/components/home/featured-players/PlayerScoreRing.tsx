export default function PlayerScoreRing({ value }: { value: number }) {
	const radius = 28;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference - (value / 100) * circumference;

	return (
		<div className="relative w-14 h-14 sm:w-16 sm:h-16">
			<svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
				<circle cx="32" cy="32" r={radius} fill="none" stroke="#e4e8f0" strokeWidth="4" />
				<circle cx="32" cy="32" r={radius} fill="none" stroke="#045694" strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" />
			</svg>

			<div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-text">{value}%</div>
		</div>
	);
}
