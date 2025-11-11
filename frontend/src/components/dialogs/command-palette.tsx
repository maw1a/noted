import { ReactNode, useCallback, useEffect, useMemo } from "react";
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
import { commandList, commands } from "@/command";
import { KeyIcon } from "../icon";

export function CommandPalette({ children }: { children: ReactNode }) {
  const { state, setState } = useStore();

  const open = state.dialog === "cmd-palette";
  const setOpen = (value: boolean) => {
    setState("dialog", value ? "cmd-palette" : null);
  };

  const cmds = useMemo(
    () => commandList.filter((cmd) => cmd.isAvailable && cmd.isVisible),
    [],
  );

  const handler = useCallback(
    () =>
      setState({
        ...state,
        dialog: state.dialog === "cmd-palette" ? null : "cmd-palette",
      }),
    [state],
  );

  useEffect(() => {
    const cmd = commands.editorCommandPalette.subscribe(handler);

    return () => {
      cmd.unsubscribe();
    };
  }, [handler]);

  return (
    <CommandDialog
      className="select-none"
      modal
      trigger={children}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput placeholder="Run a command..." />
      <CommandEmpty>No matches</CommandEmpty>
      <CommandList>
        <CommandGroup>
          {cmds.map((command) => (
            <CommandItem
              key={command.id}
              onSelect={() => {
                setOpen(false);
                setTimeout(() => command.emit());
              }}
            >
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
