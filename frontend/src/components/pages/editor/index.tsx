import { h } from "preact";
import { IconButton } from "../../ui/button";
import { TabList } from "./tablist";
import { useEffect } from "preact/hooks";

export const Editor = () => {
	return (
		<div class="flex flex-col h-full items-stretch w-full">
			<div class="flex-1 w-full flex gap-4 p-0">
				<aside class="flex flex-col h-full w-2xs py-4 text-text bg-dark-tint rounded-3xl text-display gap-y-4">
					<div className="flex w-full justify-end px-4">
						<IconButton
							tooltip-title="Close Sidebar"
							tooltip-position="bottom"
							icon="PanelLeft"
						/>
					</div>
					<TabList defaultValue="files" />
				</aside>
				<main class="text-neutral-200 select-none flex-1 flex flex-col items-center justify-between gap-4 pt-4">
					<header class="w-full flex justify-between items-center">
						<div />
						<div></div>
						<div class="flex gap-4 items-center justify-between">
							<IconButton
								tooltip-title={`Search in ${""}`}
								tooltip-position="bottom"
								icon="PanelLeft"
							/>
						</div>
					</header>
				</main>
			</div>
		</div>
	);
};
