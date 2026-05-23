import { WebAgentEmbed } from "@/components/web-agent-embed";
import { Suspense } from "react";

export default function WebAgentEmbedPage() {
	return (
		<Suspense fallback={<div className="p-4 text-sm">Loading...</div>}>
			<WebAgentEmbed />
		</Suspense>
	);
}
