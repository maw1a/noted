import type { Config } from "../../../bindings/noted";
import type { NotespaceService } from "../../services/notespace";

export type State = {
	loading: boolean;

	sidebar: boolean;

	dialog:
		| "cmd-palette"
		| "search-notespace"
		| "settings"
		| "settings-notespace"
		| null;

	root: string;
	config: Config | null;
	notespaces: Array<{ path: string; config: Config }>;
};

export type Services = {
	notespace?: NotespaceService;
};
