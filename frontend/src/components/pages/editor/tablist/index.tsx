import React, { useState, ReactNode, Activity, ComponentProps } from "react";

import { IconButton } from "@/components/ui/button";
import type { IconName } from "@/components/icon";
import { cn } from "@/utils/cn";
import { useStore } from "@/components/store";
import { Files } from "./files";

type TabButtonProps = {
	"tooltip-title"?: string;
	id: string;
	value: string;
	icon: IconName;
	handler: (arg1: string) => void;
} & ComponentProps<"button">;

export const TabButton = ({
	id,
	icon,
	value,
	handler,
	...props
}: TabButtonProps) => {
	return (
		<IconButton
			{...props}
			tooltip-position="bottom"
			className={cn(
				"text-text-muted hover:[&_svg]:text-text disabled:cursor-not-allowed",
				value === id
					? "[&_svg]:text-text bg-surface-muted"
					: "[&_svg]:text-text-muted",
			)}
			icon={icon}
			onClick={() => {
				if (value !== id) handler(id);
			}}
		/>
	);
};

const Content = ({
	selected,
	children,
}: {
	selected: boolean;
	children: ReactNode;
}) => <Activity mode={selected ? "visible" : "hidden"}>{children}</Activity>;

export const TabList = ({ defaultValue }: { defaultValue: string }) => {
	const [state, setState] = useStore();
	const value = state.sidebar_tab;
	const setValue = (v: string) => setState("sidebar_tab", v as typeof value);

	return (
		<>
			<div className="flex w-full justify-start px-4 gap-3">
				<TabButton
					icon="FolderClosed"
					id="files"
					tooltip-title="Files"
					value={value}
					handler={setValue}
				/>
				<TabButton
					icon="Search"
					tooltip-title="Search in Files"
					id="grep"
					value={value}
					handler={setValue}
					disabled
				/>
				<TabButton
					icon="Bookmark"
					id="saved"
					tooltip-title="Saved Notes"
					value={value}
					handler={setValue}
					disabled
				/>
				<TabButton
					icon="Puzzle"
					id="plugins"
					tooltip-title="Extensions for Noted"
					value={value}
					handler={setValue}
					disabled
				/>
			</div>
			<div className="flex-1 w-full text-text">
				<Content selected={value === "files"}>
					<div className="h-full">
						<Files />
					</div>
				</Content>
				<Content selected={value === "grep"}>
					<div>Grep</div>
				</Content>
				<Content selected={value === "saved"}>
					<div>Saved</div>
				</Content>
				<Content selected={value === "plugins"}>
					<div>Plugins</div>
				</Content>
			</div>
		</>
	);
};
