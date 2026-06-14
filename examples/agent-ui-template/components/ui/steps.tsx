"use client";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";

export type StepsItemProps = ComponentProps<"div">;

export const StepsItem = ({
	children,
	className,
	...props
}: StepsItemProps) => (
	<div className={cn("text-muted-foreground text-sm", className)} {...props}>
		{children}
	</div>
);

export type StepsTriggerProps = ComponentProps<
	typeof CollapsibleTrigger
> & {
	leftIcon?: ReactNode;
	swapIconOnHover?: boolean;
};

export const StepsTrigger = ({
	children,
	className,
	leftIcon,
	swapIconOnHover = true,
	...props
}: StepsTriggerProps) => (
	<CollapsibleTrigger
		className={cn(
			"group flex w-full cursor-pointer items-center justify-start gap-1 text-muted-foreground text-sm transition-colors hover:text-foreground",
			className,
		)}
		{...props}
	>
		<div className="flex items-center gap-2">
			{leftIcon ? (
				<span className="relative inline-flex size-4 items-center justify-center">
					<span
						className={cn(
							"transition-opacity",
							swapIconOnHover && "group-hover:opacity-0",
						)}
					>
						{leftIcon}
					</span>
					{swapIconOnHover && (
						<ChevronDown className="absolute size-4 opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:rotate-180" />
					)}
				</span>
			) : null}
			<span>{children}</span>
		</div>
		{!leftIcon && (
			<ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
		)}
	</CollapsibleTrigger>
);

export type StepsContentProps = ComponentProps<
	typeof CollapsibleContent
> & {
	bar?: ReactNode;
};

export const StepsContent = ({
	children,
	className,
	bar,
	...props
}: StepsContentProps) => {
	return (
		<CollapsibleContent
			className={cn(
				"overflow-hidden text-popover-foreground data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
				className,
			)}
			{...props}
		>
			<div className="mt-3 grid min-w-0 max-w-full grid-cols-[min-content_minmax(0,1fr)] items-start gap-x-3">
				<div className="min-w-0 self-stretch">{bar ?? <StepsBar />}</div>
				<div className="min-w-0 space-y-2">{children}</div>
			</div>
		</CollapsibleContent>
	);
};

export type StepsBarProps = HTMLAttributes<HTMLDivElement>;

export const StepsBar = ({ className, ...props }: StepsBarProps) => (
	<div
		className={cn("h-full w-[2px] bg-muted", className)}
		aria-hidden
		{...props}
	/>
);

export type StepsProps = ComponentProps<typeof Collapsible>;

export function Steps({ defaultOpen = true, className, ...props }: StepsProps) {
	return (
		<Collapsible
			className={cn(className)}
			defaultOpen={defaultOpen}
			{...props}
		/>
	);
}
