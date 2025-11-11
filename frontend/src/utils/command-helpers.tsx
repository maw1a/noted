import type { Command } from "@/command";
import type { State } from "@/components/store/types";
import { commandList } from "@/command";
import { KeyIcon } from "@/components/icon";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { getKeyCombination } from "./key-combination";

export const getCommandFromEvent = (e: KeyboardEvent) => {
  const { keyCombination } = getKeyCombination(e);

  const command = commandList.find(
    (cmd) => cmd.keyCombination === keyCombination,
  );

  return command;
};

export const getCommandFromId = (id: string) =>
  commandList.find((cmd) => cmd.id === id);

export const getCommandShortcutNode = ({
  className,
  command,
}: {
  className?: string;
  command: Command;
}) => {
  return (
    <KbdGroup className={className}>
      <p className="mr-2 text-end w-44">{command.label}</p>
      {command.shortcut.map((key) => (
        <Kbd key={key} className="[&_svg]:size-3 [&_span]:text-mini">
          <KeyIcon name={key} />
        </Kbd>
      ))}
    </KbdGroup>
  );
};

export const disableWhenDialog = (p: State, n: State) => {
  if (p.dialog || isInvalidDialogStateTransition(p, n)) return p;
  return n;
};

export const isInvalidDialogStateTransition = (prv: State, nxt: State) => {
  const isInvalid =
    typeof prv.dialog === "string" &&
    typeof nxt.dialog === "string" &&
    prv.dialog !== nxt.dialog;
  return isInvalid;
};
