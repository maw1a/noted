import { ComponentChildren, h, Fragment } from "preact";
import { useState } from "preact/hooks";

import { IconButton } from "../../ui/button";
import type { IconName } from "../../../utils/icon";
import { cn } from "../../../utils/cn";
import { withTooltip } from "../../ui/tooltip";

type TabButtonProps = {
	"tooltip-title"?: string;
	id: string;
	value: string;
	icon: IconName;
	handler: (arg1: string) => void;
};

export const TabButton = withTooltip<TabButtonProps>(
	({ id, icon, value, handler, ...props }) => {
		return (
			<IconButton
				{...props}
				tooltip-position="bottom"
				class={cn(
					"text-text-muted hover:[&_svg]:text-text",
					value === id
						? "[&_svg]:text-text bg-surface"
						: "[&_svg]:text-text-muted",
				)}
				icon={icon}
				onClick={() => {
					if (value !== id) handler(id);
				}}
			/>
		);
	},
);

const Content: Record<string, ComponentChildren> = {
	files: <div>Files</div>,
	grep: <div>Grep</div>,
	saved: <div>Saved</div>,
	plugins: <div>Plugins</div>,
};

export const TabList = ({ defaultValue }: { defaultValue: string }) => {
	const [value, setValue] = useState<string>(defaultValue);
	return (
		<>
			<div className="flex w-full justify-start px-4 gap-3">
				<TabButton
					icon="FolderClosed"
					id="files"
					title="Files"
					value={value}
					handler={setValue}
				/>
				<TabButton
					icon="Search"
					title="Search in Files"
					id="grep"
					value={value}
					handler={setValue}
				/>
				<TabButton
					icon="Bookmark"
					id="saved"
					title="Saved Notes"
					value={value}
					handler={setValue}
				/>
				<TabButton
					icon="Puzzle"
					id="plugins"
					title="Extensions for Noted"
					value={value}
					handler={setValue}
				/>
			</div>
			<div class="flex-1 w-full">{Content[value]}</div>
		</>
	);
};
