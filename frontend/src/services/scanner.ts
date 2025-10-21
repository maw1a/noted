import { GetFileTree } from "../../bindings/noted/scanner";

export class ScannerService {
	constructor(private readonly root: string) {}

	public async getFileTree() {
		const rootNode = await GetFileTree(this.root);
		return rootNode;
	}
}
