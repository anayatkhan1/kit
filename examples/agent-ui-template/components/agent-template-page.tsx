"use client";

import { Message } from "@/components/message";
import {
	PromptInput,
	PromptInputAction,
	PromptInputActions,
	PromptInputTextarea,
} from "@/components/ui/prompt-input";
import {
	type AgentId,
	agentProfiles,
	defaultAgentId,
} from "@/lib/agent-profiles";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import React, { type ChangeEvent, useRef, useState } from "react";

export function AgentTemplatePage() {
	const [agentId, setAgentId] = useState<AgentId>(defaultAgentId);
	const selectedAgent = agentProfiles[agentId];
	const [input, setInput] = useState(selectedAgent.starterPrompt);
	const [files, setFiles] = useState<File[]>([]);
	const uploadInputRef = useRef<HTMLInputElement | null>(null);

	const { messages, sendMessage, status, setMessages } = useChat();

	const isLoading = status === "submitted" || status === "streaming";
	const isEmpty = messages.length === 0;

	const handleAgentChange = (nextAgentId: AgentId) => {
		setAgentId(nextAgentId);
		setInput(agentProfiles[nextAgentId].starterPrompt);
		setMessages([]);
		setFiles([]);
		if (uploadInputRef.current) uploadInputRef.current.value = "";
	};

	const fileToDataURL = (file: File) =>
		new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = () => reject(new Error("Failed to read file"));
			reader.readAsDataURL(file);
		});

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const text = input?.trim();
		if (!text && files.length === 0) return;

		try {
			const parts: Array<any> = [];
			if (text) parts.push({ type: "text", text });

			for (const file of files) {
				const dataUrl = await fileToDataURL(file);
				parts.push({
					type: "file",
					mediaType: file.type,
					filename: file.name,
					url: dataUrl,
				});
			}

			await sendMessage(
				{
					parts,
				},
				{
					body: { agentId },
				} as any,
			);

			setInput("");
			setFiles([]);
			if (uploadInputRef.current) uploadInputRef.current.value = "";
		} catch (err) {
			console.error("Failed to send message with files:", err);
		}
	};

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;
		if (!fileList) return;
		const newFiles = Array.from(fileList);
		setFiles((prev) => [...prev, ...newFiles]);
	};

	const handleRemoveFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
		if (uploadInputRef.current) {
			uploadInputRef.current.value = "";
		}
	};

	return (
		<main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
			<div
				className={cn(
					"mx-auto flex h-screen max-w-3xl flex-col items-center px-4 pb-12",
					isEmpty ? "justify-center gap-12" : "justify-between gap-3",
				)}
			>
				{isEmpty ? (
					<header className="space-y-4 text-center">
						<p className="text-slate-600 text-sm uppercase tracking-[0.3em]">
							Agent Demo • Next.js + Vercel AI SDK
						</p>
						<h1 className="font-semibold text-4xl text-slate-900 sm:text-5xl">
							Try {selectedAgent.label.toLowerCase()} <br />
							in a minimal chat UI
						</h1>
						<div className="flex items-center justify-center gap-2">
							{(Object.keys(agentProfiles) as AgentId[]).map((id) => (
								<button
									key={id}
									type="button"
									onClick={() => handleAgentChange(id)}
									className={cn(
										"rounded-full border px-3 py-1 text-xs transition",
										agentId === id
											? "border-indigo-600 bg-indigo-600 text-white"
											: "border-slate-300 text-slate-600 hover:border-slate-400",
									)}
								>
									{agentProfiles[id].label}
								</button>
							))}
						</div>
						<div className="flex items-center justify-center gap-3 text-slate-600 text-xs">
							<span className="rounded-full border border-slate-300 px-3 py-1">
								Enter ↵ to send, Shift+Enter for newline
							</span>
						</div>
					</header>
				) : (
					<section
						aria-live="polite"
						className="w-full max-w-3xl flex-1 overflow-y-auto py-14"
					>
						<div className="space-y-4">
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

				<section className="w-full max-w-2xl">
					<div className="mb-3 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm">
						<div className="mb-2 flex flex-wrap gap-2">
							{(Object.keys(agentProfiles) as AgentId[]).map((id) => (
								<button
									key={id}
									type="button"
									onClick={() => handleAgentChange(id)}
									className={cn(
										"rounded-full border px-3 py-1 text-xs transition",
										agentId === id
											? "border-indigo-600 bg-indigo-600 text-white"
											: "border-slate-300 text-slate-600 hover:border-slate-400",
									)}
								>
									{agentProfiles[id].label}
								</button>
							))}
						</div>
						<p className="text-slate-600 text-xs">Required env</p>
						<p className="mt-1 text-slate-900 text-xs">
							{selectedAgent.env.join(" • ")}
						</p>
						<p className="mt-1 text-slate-600 text-xs">
							{selectedAgent.description}
						</p>
						{agentId === "extraction-agent" ? (
							<p className="mt-1 text-slate-500 text-xs">
								Workspace: <code>data/extraction-agent.local/</code> — try{" "}
								<code>invoices/acme.pdf</code>, <code>sales/q2.xlsx</code>,{" "}
								<code>receipts/cafe.png</code>
							</p>
						) : null}
					</div>
					<form onSubmit={handleSubmit}>
						<PromptInput
							value={input}
							onValueChange={setInput}
							isLoading={isLoading}
							className="max-w-2xl border border-slate-200 bg-white shadow-sm backdrop-blur-lg"
						>
							{files.length > 0 && (
								<div className="flex flex-wrap gap-2 pb-2">
									{files.map((file, index) => (
										<div
											key={index}
											className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-slate-900 text-sm"
											onClick={(e) => e.stopPropagation()}
										>
											<Paperclip className="h-4 w-4 text-slate-600" />
											<span className="max-w-[160px] truncate">
												{file.name}
											</span>
											<button
												type="button"
												onClick={() => handleRemoveFile(index)}
												className="rounded-full p-1 transition hover:bg-slate-200"
												aria-label={`Remove ${file.name}`}
											>
												<X className="h-4 w-4 text-slate-600" />
											</button>
										</div>
									))}
								</div>
							)}

							<PromptInputTextarea
								placeholder={
									agentId === "extraction-agent"
										? "Ask to extract from a PDF, spreadsheet, or image..."
										: "Try the web agent in this template app..."
								}
								className="text-base text-slate-900 placeholder:text-slate-500 "
							/>

							<PromptInputActions className="flex items-center justify-between gap-2 pt-2">
								<PromptInputAction tooltip="Attach files">
									<label
										htmlFor="file-upload"
										className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-2xl transition hover:bg-slate-100"
										aria-label="Attach files"
									>
										<input
											type="file"
											multiple
											onChange={handleFileChange}
											className="hidden"
											id="file-upload"
											ref={uploadInputRef}
											aria-label="File upload"
										/>
										<Paperclip className="h-5 w-5 text-slate-700" />
									</label>
								</PromptInputAction>

								<PromptInputAction
									tooltip={isLoading ? "Stop generation" : "Send message"}
									side="left"
								>
									<button
										type="submit"
										disabled={
											isLoading ||
											(input.trim().length === 0 && files.length === 0)
										}
										className={`flex h-9 w-9 items-center justify-center rounded-full text-white transition ${
											isLoading
												? "bg-red-500 hover:bg-red-600"
												: "bg-indigo-600 hover:bg-indigo-700"
										}`}
										aria-label={isLoading ? "Stop generation" : "Send message"}
									>
										{isLoading ? (
											<Square className="h-5 w-5" />
										) : (
											<ArrowUp className="h-5 w-5" />
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
