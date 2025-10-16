import type { Config } from "../../../bindings/noted";
import type { NotespaceService } from "../../services/notespace";

export type State = {
	loading: boolean;

	sidebar: boolean;
	sidebar_tab: "files" | "grep" | "saved" | "plugins";

	dialog:
		| "cmd-palette"
		| "search-notespace"
		| "settings"
		| "settings-notespace"
		| null;

	root: string;
	config: Config | null;
	notespaces: Array<{ path: string; config: Config }>;

	tabs: Array<string>;
	active_tab: string | null;

	bookmarks: Array<string>;
};

export type Services = {
	notespace?: NotespaceService;
};
