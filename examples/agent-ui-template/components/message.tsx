import { getToolLabel } from "@/lib/tool-labels";
import { cn } from "@/lib/utils";
import { UIMessage } from "ai";
import { Bot, Hammer, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import {
	Steps,
	StepsBar,
	StepsContent,
	StepsItem,
	StepsTrigger,
} from "./ui/steps";

export const Message = ({
	role,
	parts,
}: {
	role: string;
	parts: UIMessage["parts"];
}) => {
	const isUser = role === "user";

	const text = parts
		.map((part) => {
			if (part.type === "text") {
				return part.text;
			}
			return "";
		})
		.join("");

	const toolParts = parts.filter((part) => part.type.startsWith("tool-"));

	return (
		<div
			className={cn(
				"mb-6 flex w-full",
				isUser ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"flex max-w-[80%] flex-col gap-2",
					isUser ? "items-end" : "items-start",
				)}
			>
				<div className="flex items-center gap-2 px-1">
					<div
						className={cn(
							"flex size-6 items-center justify-center rounded-full border shadow-sm",
							isUser ? "bg-white" : "bg-black text-white",
						)}
					>
						{isUser ? <User className="size-3" /> : <Bot className="size-3" />}
					</div>
					<span className="font-medium text-slate-500 text-xs">
						{isUser ? "You" : "AI Agent"}
					</span>
				</div>

				<div
					className={cn(
						"relative rounded-2xl px-5 py-3 text-sm shadow-sm",
						isUser
							? "rounded-tr-none bg-slate-900 text-slate-50"
							: "rounded-tl-none border border-slate-100 bg-white text-slate-800",
					)}
				>
					{text && (
						<div
							className={cn(
								"prose prose-sm max-w-none",
								isUser ? "prose-invert" : "",
							)}
						>
							<ReactMarkdown>{text}</ReactMarkdown>
						</div>
					)}

					{toolParts.length > 0 && (
						<div className={cn("mt-3", isUser ? "opacity-90" : "")}>
							<Steps
								defaultOpen={false}
								className="border-slate-200/20 border-t pt-2"
							>
								<StepsTrigger
									leftIcon={<Hammer className="size-3" />}
									className={cn(
										"text-xs hover:text-current",
										isUser ? "text-slate-300" : "text-slate-500",
									)}
								>
									Tool Activity ({toolParts.length})
								</StepsTrigger>
								<StepsContent
									bar={<StepsBar className="mr-2 ml-1.5 bg-slate-200/20" />}
								>
									<div className="space-y-1 pt-1">
										{toolParts.map((part, index) => {
											const content = getToolLabel(part);
											return (
												<StepsItem
													key={index}
													className={cn(
														"text-xs",
														isUser ? "text-slate-300" : "text-slate-500",
													)}
												>
													{content}
												</StepsItem>
											);
										})}
									</div>
								</StepsContent>
							</Steps>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
