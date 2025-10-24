import { Key, safeKeyStorage } from "./safeStorage";

// WARN: this can throw errors use in try_catch
export const local = {
	notespaces: safeKeyStorage<Array<string>>(Key.Notespaces),
};
