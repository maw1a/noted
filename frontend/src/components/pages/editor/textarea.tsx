import React, { useEffect, useMemo } from "react";
import { useStore } from "../../store";
import { cn } from "../../../utils/cn";
import { IconButton } from "../../ui/button";
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarShortcut,
	MenubarTrigger,
} from "../../ui/menubar";
import { Icon } from "../../icon";
import { State } from "../../store/types";

export const Textarea = () => {
	const [state, setState] = useStore();

	const title = useMemo(
		() => (state.config ? state.config.name : state.root.split("/").pop()),
		[state.config, state.root],
	);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			let nd: State["dialog"] = null;

			if (e.key === "p" && e.shiftKey && (e.metaKey || e.ctrlKey))
				nd = "cmd-palette";

			e.preventDefault();
			setState("dialog", state.dialog ? null : nd);
		};

		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [state.dialog, setState]);

	return (
		<main
			className={cn(
				"text-neutral-200 select-none flex-1 flex flex-col items-center justify-between gap-4 transition-[padding] overscroll-none overflow-hidden duration-300 pt-4 px-4",
				state.sidebar && "pl-72",
			)}
		>
			<header className="w-full flex justify-between items-center">
				<div
					className={cn(
						"flex gap-4 items-center justify-end duration-300 transition-[padding,opacity]",
						state.sidebar ? "pl-0 opacity-0" : "pl-21 opacity-100",
					)}
				>
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

				<div>{title}</div>

				<div className="flex gap-4 items-center justify-between">
					<IconButton
						icon="Search"
						variant="ghost"
						tooltip-title={`Search in ${title}`}
						tooltip-position="bottom"
						name="Search"
						onClick={() => setState("dialog", "cmd-palette")}
					/>
					<IconButton
						tooltip-title={`Chat with ${title}`}
						tooltip-position="bottom"
						icon="MessageCircle"
						variant="ghost"
					/>
					<Menubar>
						<MenubarMenu>
							<MenubarTrigger>
								<Icon
									name="ChevronDown"
									size={16}
									strokeWidth={2}
									className="transition-colors"
								/>
							</MenubarTrigger>
							<MenubarContent align="end">
								<MenubarItem>
									Settings{" "}
									<MenubarShortcut>
										<Icon className="inline" name="Command" />
										<span className="w-[1ch]">,</span>
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Notespace Settings{" "}
									<MenubarShortcut>
										<Icon className="inline" name="Command" />
										<Icon className="inline" name="ArrowBigUp" />
										<span className="w-[1ch]">,</span>
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>
									Key Bindings{" "}
									<MenubarShortcut>
										<Icon className="inline" name="Command" />
										<span className="inline">K</span>
									</MenubarShortcut>
								</MenubarItem>
								<MenubarItem>Appearance</MenubarItem>
								<MenubarItem>
									Extensions{" "}
									<MenubarShortcut>
										<Icon className="inline" name="Command" />
										<Icon className="inline" name="ArrowBigUp" />
										<span className="inline">X</span>
									</MenubarShortcut>
								</MenubarItem>
							</MenubarContent>
						</MenubarMenu>
					</Menubar>
				</div>
			</header>
		</main>
	);
};
