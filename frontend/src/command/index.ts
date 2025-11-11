import * as cmds from "./commands";
export * from "./types";

export const commands = { ...cmds };

export const commandList = Object.values(commands);
