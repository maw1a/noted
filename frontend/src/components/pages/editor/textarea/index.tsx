import { useMemo } from "react";
import { Outlet, useNavigate } from "react-router";
import { useStore } from "@/components/store";
import { cn } from "@/utils/cn";
import { IconButton } from "@/components/ui/button";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
} from "@/components/ui/menubar";
import { KeyIcon } from "@/components/icon";
import { CommandPalette } from "@/components/dialogs/command-palette";
import { Combobox } from "@/components/ui/combobox";
import { Tablist } from "./tablist";

export const Textarea = () => {
	const [state, setState] = useStore();
	const navigate = useNavigate();

	const title = useMemo(
		() => (state.config ? state.config.name : state.root.split("/").pop()),
		[state.config, state.root],
	);

	return (
		<main
			className={cn(
				"text-neutral-200 select-none flex-1 flex flex-col items-center justify-between gap-4 transition-[padding] overscroll-none overflow-hidden duration-300 pt-4 pr-4",
				state.sidebar ? "pl-76" : "pl-4",
			)}
		>
			<header className="w-full flex justify-between items-center">
				<div
					className={cn(
						"flex gap-4 pl-21 items-center justify-end duration-300 transition-[opacity]",
						state.sidebar ? "opacity-0" : "opacity-100",
					)}
				>
					<div className="size-8">
						{!state.sidebar && (
							<IconButton
								tooltip-title="Open Sidebar"
								tooltip-position="bottom"
								icon="PanelLeft"
								variant="ghost"
								className="text-text"
								onClick={() => setState("sidebar", !state.sidebar)}
							/>
						)}
					</div>
				</div>

				<div>
					<Combobox
						items={state.notespaces.map((notespace) => ({
							value: notespace.path,
							label: notespace.config.name,
						}))}
						defaultValue={state.root}
						searchPlaceholder="Search notespaces..."
						notFoundText="No notespace found."
						onSelect={(value) => {
							navigate(`/editor?root=${value}`);
						}}
					/>
				</div>

				<div className="flex gap-4 items-center justify-between">
					<CommandPalette>
						<IconButton
							name="Search"
							icon="Search"
							variant="ghost"
							className="data-[state=open]:bg-dark-tint"
							tooltip-title={`Search in ${title}`}
							tooltip-position="bottom"
						/>
					</CommandPalette>
					<IconButton
						tooltip-title={`Chat with ${title}`}
						tooltip-position="bottom"
						icon="MessageCircle"
						variant="ghost"
					/>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger asChild>
								<IconButton
									icon="ChevronDown"
									className="data-[state=open]:bg-dark-tint transition-colors"
								/>
							</MenubarTrigger>
							<MenubarContent align="end">
								<MenubarItem>
									Settings{" "}
									<MenubarShortcut>
										<KeyIcon name="Meta" />
										<KeyIcon name="," />
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Notespace Settings{" "}
									<MenubarShortcut>
										<KeyIcon name="Meta" />
										<KeyIcon name="Shift" />
										<KeyIcon name="," />
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Key Bindings{" "}
									<MenubarShortcut>
										<KeyIcon name="Meta" />
										<KeyIcon name="k" />
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>Appearance</MenubarItem>
								<MenubarItem>
									Extensions{" "}
									<MenubarShortcut>
										<KeyIcon name="Meta" />
										<KeyIcon name="Shift" />
										<KeyIcon name="x" />
									</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</div>
			</header>
			<Tablist root={state.root} tabs={state.tabs} />
			<section className="w-full flex-1 max-h-full overflow-scroll">
				<Outlet />
			</section>
		</main>
	);
};
