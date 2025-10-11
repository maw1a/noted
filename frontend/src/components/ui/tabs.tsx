import { ComponentProps, h } from "preact";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "../../utils/cn";

function Tabs({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
	return (
		<TabsPrimitive.Root
			data-slot="tabs"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		/>
	);
}

function TabsList({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.List>) {
	return (
		<TabsPrimitive.List
			data-slot="tabs-list"
			className={cn(
				"bg-transparent text-neutral-200 inline-flex w-fit items-center justify-center gap-2",
				className,
			)}
			{...props}
		/>
	);
}

function TabsTrigger({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
	return (
		<TabsPrimitive.Trigger
			data-slot="tabs-trigger"
			className={cn(
				"data-[state=active]:bg-neutral-900/75 hover:bg-neutral-900/75 bg-transparent text-neutral-200 cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg h-9 px-3 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:text-neutral-400 hover:[&_svg]:text-neutral-200 data-[state=active]:[&_svg]:text-neutral-200 disabled:[&_svg]:text-neutral-400",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({
	className,
	...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
	return (
		<TabsPrimitive.Content
			data-slot="tabs-content"
			className={cn("flex-1 outline-none", className)}
			{...props}
		/>
	);
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
