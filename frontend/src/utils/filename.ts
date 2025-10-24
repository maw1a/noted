export function fileInfo(
	root: string,
	path: string,
	ext?: string,
): {
	filename: string;
	parent: string | null;
	rel: string;
	path: string;
	ext: string | undefined;
} {
	let parts = path.split("/");

	const abs = parts.pop()!;
	ext = ext ?? abs.split(".").pop();

	let rel = parts.join("/");
	rel = rel.replace(root, "");

	const parent = rel === "" ? null : parts.pop() || null;

	if (ext === "md") {
		const filename = abs.split(".").slice(0, -1).join(".");
		return { filename, rel, parent, path, ext };
	}
	return { filename: abs, rel, parent, path, ext };
}
