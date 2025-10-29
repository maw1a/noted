import {
  editorCommandPalette,
  editorSidebarToggle,
  editorSettings,
  editorNotespaceFind,
  editorNotespaceFileNew,
  editorNotespaceFileOpen,
  editorNotespaceFileBookmark,
  editorNotespaceFileSave,
} from "./commands";
import { getKeyCombination } from "@/utils/key-combination";

export const commands = {
  editorCommandPalette,
  editorSidebarToggle,
  editorSettings,
  editorNotespaceFind,
  editorNotespaceFileNew,
  editorNotespaceFileOpen,
  editorNotespaceFileSave,
  editorNotespaceFileBookmark,
};

export const commandList = Object.values(commands);

export const getCommandFromEvent = (e: KeyboardEvent) => {
  const { keyCombination } = getKeyCombination(e);

  const command = commandList.find(
    (cmd) => cmd.keyCombination === keyCombination,
  );

  return command;
};

export const getCommandFromId = (id: string) =>
  commandList.find((cmd) => cmd.id === id);
