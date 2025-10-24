import { GetFileTree, GetFileData } from "@go/noted/scanner";

export class ScannerService {
	constructor(private readonly root: string) {}

	public async getFileTree() {
		const rootNode = await GetFileTree(this.root);
		return rootNode;
	}

	public async getFileContent(path: string) {
		const content = await GetFileData(path);
		return content;
	}
}
