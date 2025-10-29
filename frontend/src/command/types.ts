import type { StoreContextType } from "../components/store/types";

export interface ICommand {
  label: string;
  id: string;
  shortcut: Array<string>;
  handler: <T = {}>(args: StoreContextType & T) => void | Promise<void>;
  isAvailable?: boolean;
  isVisible?: boolean;
}
