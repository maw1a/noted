import { ReactNode, useMemo } from "react";
import { useStore } from "../store";
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "../ui/command";
import { commandList } from "../../command";
import { KeyIcon } from "../icon";
import { useMatch } from "react-router-dom";

export function CommandPalette({ children }: { children: ReactNode }) {
	const [state, setState] = useStore();

	const open = state.dialog === "cmd-palette";
	const setOpen = (value: boolean) => {
		setState("dialog", value ? "cmd-palette" : null);
	};

	const commands = useMemo(
		() => commandList.filter((cmd) => cmd.isAvailable && cmd.isVisible),
		[],
	);

	return (
		<CommandDialog modal trigger={children} open={open} onOpenChange={setOpen}>
			<CommandInput placeholder="Run a command..." />
			<CommandEmpty>No matches</CommandEmpty>
			<CommandList>
				<CommandGroup>
					{commands.map((command) => (
						<CommandItem key={command.id}>
							<span>{command.label}</span>
							<CommandShortcut>
								{command.shortcut.map((key) => (
									<KeyIcon key={key} name={key} />
								))}
							</CommandShortcut>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
