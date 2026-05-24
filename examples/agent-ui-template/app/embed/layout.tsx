import type { ReactNode } from "react";

export default function EmbedLayout({ children }: { children: ReactNode }) {
	return (
		<div className="dark h-full min-h-[400px] bg-background text-foreground">
			{children}
		</div>
	);
}
