import type { SetState, State } from "../components/store/types";

export interface ICommand {
  label: string;
  id: string;
  shortcut: Array<string>;
  handler: <T = {}>(args: { state: State; setState: SetState } & T) => void;
  isAvailable?: boolean;
  isVisible?: boolean;
}
