import z from "zod";
import type { Config } from "../../bindings/noted";
import {
	GetCurrentNotespace,
	GetNotespaceFromPaths,
} from "../../bindings/noted/editor";
import { local } from "../utils/localstorage";

const notespacePathsSchema = z.array(z.string());

type Notespace = { config: Config; path: string };

export class NotespaceService {
	constructor(private readonly root: string) {}

	async getRecentNotespaces(): Promise<Array<Notespace>> {
		try {
			const unparsed = local.notespaces.get();
			if (!unparsed) return [];

			// Get JSON parsed notespaces including non-existing ones
			const parsed = notespacePathsSchema.parse(unparsed);
			// Filter the exisiting notespaces
			const notespacePaths = (
				parsed.findIndex((ns) => ns === this.root) > -1
					? parsed
					: [...parsed, this.root]
			).slice(0, 10);

			const notespaces = await GetNotespaceFromPaths(notespacePaths);

			const recents = notespaces.filter(
				(notespace): notespace is Notespace => notespace.config !== null,
			);

			// Update cache if there are non-existing notespaces
			if (recents.length != parsed.length)
				local.notespaces.set(recents.map(({ path }) => path));

			return recents;
		} catch (error) {
			// Incase of error reset and return only current notespace (if valid)
			const current = await this.getCurrentNotespace();

			if (current.config) {
				local.notespaces.set([this.root]);
				return [current] as Array<Notespace>;
			}

			local.notespaces.set([]);
			return [];
		}
	}

	async getCurrentNotespace() {
		const { config, path } = await GetCurrentNotespace();
		return { config, path };
	}
}
