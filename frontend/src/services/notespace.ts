import z from "zod";
import type { Config } from "@go/noted";
import { GetCurrentNotespace, GetNotespaceFromPaths } from "@go/noted/editor";
import { local } from "@/utils/localstorage";

const notespacePathsSchema = z.array(z.string());

type Notespace = { config: Config; path: string };

export class NotespaceService {
	private root: string | undefined = undefined;

	constructor(root?: string) {
		if (root) this.addRoot(root);
	}

	public async getRecentNotespaces(): Promise<Array<Notespace>> {
		try {
			let notespacePaths: Array<string> = [];
			const unparsed = local.notespaces.get();

			if (!unparsed) notespacePaths = this.root ? [this.root] : [];
			else {
				// Get JSON parsed notespaces including non-existing ones
				const parsed = notespacePathsSchema.parse(unparsed);
				// Filter the exisiting notespaces
				notespacePaths = Array.from(
					new Set(this.root ? [...parsed, this.root] : [...parsed]),
				);
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
				local.notespaces.set(this.root ? [this.root] : []);
				return [current] as Array<Notespace>;
			}

			local.notespaces.set([]);
			return [];
		}
	}

	public async getCurrentNotespace() {
		const { config, path } = await GetCurrentNotespace();
		return { config, path };
	}

	public addRoot(root: string) {
		this.root = root;
	}
}
