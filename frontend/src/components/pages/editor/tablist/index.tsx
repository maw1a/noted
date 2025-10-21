import React, { useState, ReactNode } from "react";

import { IconButton } from "../../../ui/button";
import type { IconName } from "../../../icon";
import { cn } from "../../../../utils/cn";
import { useStore } from "../../../store";
import { Files } from "./files";

type TabButtonProps = {
	"tooltip-title"?: string;
	id: string;
	value: string;
	icon: IconName;
	handler: (arg1: string) => void;
};

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
				"text-text-muted hover:[&_svg]:text-text",
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

const Content: Record<string, ReactNode> = {
	files: <Files />,
	grep: <div>Grep</div>,
	saved: <div>Saved</div>,
	plugins: <div>Plugins</div>,
};

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
				/>
				<TabButton
					icon="Bookmark"
					id="saved"
					tooltip-title="Saved Notes"
					value={value}
					handler={setValue}
				/>
				<TabButton
					icon="Puzzle"
					id="plugins"
					tooltip-title="Extensions for Noted"
					value={value}
					handler={setValue}
				/>
			</div>
			<div className="flex-1 w-full text-text">{Content[value]}</div>
		</>
	);
};
