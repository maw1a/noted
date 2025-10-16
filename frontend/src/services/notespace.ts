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
			let notespacePaths = [];
			const unparsed = local.notespaces.get();

			if (!unparsed) notespacePaths = [this.root];
			else {
				// Get JSON parsed notespaces including non-existing ones
				const parsed = notespacePathsSchema.parse(unparsed);
				// Filter the exisiting notespaces
				notespacePaths = Array.from(new Set([...parsed, this.root]));
			}

			const notespaces = await GetNotespaceFromPaths(notespacePaths);

			const recents = notespaces.filter(
				(notespace): notespace is Notespace => notespace.config !== null,
			);

			// Update cache if there are non-existing notespaces
			if (recents.length != notespacePaths.length)
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
