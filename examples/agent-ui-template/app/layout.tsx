import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { QueryProvider } from "@/components/providers/query-client-provider";
import { Suspense } from "react";
import React from "react";

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
	title: "nextjs-template",
	description: "Your Next.js 16 SaaS Boilerplate",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<QueryProvider>
						{/* <header className="flex h-16 items-center justify-end gap-4 p-4">
								<SignedOut>
									<SignInButton />
									<SignUpButton>
										<button className="h-10 cursor-pointer rounded-full bg-[#6c47ff] px-4 font-medium text-sm text-white sm:h-12 sm:px-5 sm:text-base">
											Sign Up
										</button>
									</SignUpButton>
								</SignedOut>
								<SignedIn>
									<UserButton />
								</SignedIn>
							</header> */}
						{children}
					</QueryProvider>
				</body>
			</html>
			{/* <ClerkProvider>
				
			</ClerkProvider> */}
		</Suspense>
	);
}
