export enum Key {
	Notespaces = "notespaces",
}

export interface ISafeKeyStorage<T> {
	readonly key: Key;
	get: () => T | null;
	set: (value: T) => void;
}

const safeStorage = {
	get(key: Key): string | null {
		try {
			return typeof window !== "undefined" && "localStorage" in window
				? window.localStorage.getItem(key)
				: null;
		} catch {
			return null;
		}
	},
	set(key: Key, value: string) {
		try {
			if (typeof window !== "undefined" && "localStorage" in window) {
				window.localStorage.setItem(key, value);
			}
		} catch {
			// ignore
		}
	},
};

export function safeKeyStorage<T>(key: Key): ISafeKeyStorage<T> {
	return {
		get key() {
			return key;
		},
		get: () => {
			const raw = safeStorage.get(key);
			return raw ? JSON.parse(raw) : null;
		},
		set: (value: T) => {
			safeStorage.set(key, JSON.stringify(value));
		},
	};
}
