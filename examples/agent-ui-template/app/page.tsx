import { AgentTemplatePage } from "@/components/agent-template-page";
import { Suspense } from "react";

export default function Home() {
	return (
		<Suspense fallback={<div className="p-6">Loading template...</div>}>
			<AgentTemplatePage />
		</Suspense>
	);
}
