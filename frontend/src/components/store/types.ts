import type { Config, Node } from "../../../bindings/noted";
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

	rootNode: Node | null;
	tabs: Array<string>;
	active_tab: string | null;

	bookmarks: Array<string>;
};

export type Services = {
	notespace?: NotespaceService;
};
