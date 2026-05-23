import type { Metadata } from "next";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import { Suspense } from "react";

import { QueryProvider } from "@/components/providers/query-client-provider";
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Agent UI Template",
	description: "Next.js chat UI for testing kit agents",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Suspense fallback={<div>Loading...</div>}>
					<QueryProvider>{children}</QueryProvider>
				</Suspense>
			</body>
		</html>
	);
}
