import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthProvider } from "./components/providers/AuthProvider";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { GeoInitializer } from "./components/utils/GeoInitializer";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "FootballTalento",
	description: "Discover Football Talent Worldwide",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={geistSans.variable}>
			<head>
				<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css" />
			</head>
			<body className="antialiased bg-background text-text-primary">
				<AuthProvider>
					<GeoInitializer />
					<Header />
					{children}
					<Footer />
				</AuthProvider>
			</body>
		</html>
	);
}