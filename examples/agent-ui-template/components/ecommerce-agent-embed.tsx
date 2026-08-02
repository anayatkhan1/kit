"use client";

import { Message } from "@/components/message";
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/ui/prompt-input";
import { agentProfiles } from "@/lib/agent-profiles";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Square } from "lucide-react";
import React, { useState } from "react";

const agentId = "ecommerce-agent" as const;
const profile = agentProfiles[agentId];

export function EcommerceAgentEmbed() {
	const [input, setInput] = useState(profile.starterPrompt);
	const { messages, sendMessage, status } = useChat();

	const isLoading = status === "submitted" || status === "streaming";
	const isEmpty = messages.length === 0;

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input?.trim();
		if (!text) return;

		await sendMessage(
			{ parts: [{ type: "text", text }] },
			{ body: { agentId } } as any,
		);
		setInput("");
	};

	return (
		<main className="flex h-full min-h-[400px] flex-col bg-background text-foreground">
			<div
				className={cn(
					"mx-auto flex h-full w-full max-w-2xl flex-col px-3 py-3",
					isEmpty ? "justify-center gap-4" : "justify-between gap-2",
				)}
			>
				{isEmpty && (
					<header className="space-y-2 px-1 text-left">
						<p className="text-muted-foreground text-xs uppercase tracking-[0.2em]">
							E-commerce Agent
						</p>
						<p className="text-muted-foreground text-xs">
							Catalogs save under{" "}
							<code className="text-foreground">
								data/ecommerce-agent.local/
							</code>
							. Needs{" "}
							<code className="text-foreground">FIRECRAWL_API_KEY</code> +{" "}
							<code className="text-foreground">ANTHROPIC_API_KEY</code>. Try a
							public store URL (Shopify demos work well).
						</p>
					</header>
				)}

				{!isEmpty && (
					<section
						aria-live="polite"
						className="min-h-0 flex-1 overflow-y-auto py-2"
					>
						<div className="space-y-3">
							{messages.map((message) => (
								<Message
									key={message.id}
									role={message.role}
									parts={message.parts}
								/>
							))}
						</div>
					</section>
				)}

				<section className="w-full shrink-0">
					<form onSubmit={handleSubmit}>
						<PromptInput
							value={input}
							onValueChange={setInput}
							isLoading={isLoading}
							className="border-border bg-card w-full shadow-sm"
						>
							<PromptInputTextarea
								placeholder="Ask to map a store or extract product data..."
								className="text-foreground placeholder:text-muted-foreground text-sm"
							/>
							<PromptInputActions className="flex items-center justify-end gap-2 pt-2">
								<PromptInputAction
									tooltip={isLoading ? "Stop generation" : "Send message"}
									side="left"
								>
									<button
										type="submit"
										disabled={isLoading || input.trim().length === 0}
										className={cn(
											"flex h-8 w-8 items-center justify-center rounded-full text-white transition",
											isLoading
												? "bg-destructive hover:bg-destructive/90"
												: "bg-primary hover:bg-primary/90",
										)}
										aria-label={isLoading ? "Stop generation" : "Send message"}
									>
										{isLoading ? (
											<Square className="h-4 w-4" />
										) : (
											<ArrowUp className="h-4 w-4" />
										)}
									</button>
								</PromptInputAction>
							</PromptInputActions>
						</PromptInput>
					</form>
				</section>
			</div>
		</main>
	);
}
