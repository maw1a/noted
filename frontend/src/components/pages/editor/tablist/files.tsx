import { useMemo } from "react";
import type { Node } from "../../../../../bindings/noted";
import { Icon } from "../../../icon";
import { useStore } from "../../../store";
import { Tree, File, Folder } from "../../../ui/file-tree";

enum NodeType {
	File = "file",
	Dir = "dir",
	Symlik = "symlink",
}

const nodesFilter = (node: Node) => node.name === ".noted" || !node.isHidden;

const FileNode = ({ node }: { node: Node }) => {
	const children = useMemo(
		() => (node.children ? node.children.filter(nodesFilter) : []),
		[node],
	);

	if (node.type === NodeType.File)
		return (
			<File value={node.path} id={node.path}>
				{node.name}
			</File>
		);

	return (
		<Folder value={node.path} id={node.path} element={node.name}>
			{children.map((child) => (
				<FileNode key={child.path} node={child} />
			))}
		</Folder>
	);
};

export const Files = () => {
	const [state] = useStore();
	return (
		<div className="flex flex-col w-full h-full items-stretch gap-0">
			<header className="px-4 bg-surface-muted text-display font-semibold">
				<div className="flex justify-between items-center">
					<p className="py-0.5">Files</p>
					<div className="flex gap-2">
						<button className="p-1 text-text-muted hover:text-text transition-colors">
							<Icon name="FolderPlus" size={16} strokeWidth={2} />
						</button>
						<button className="p-1 text-text-muted hover:text-text transition-colors">
							<Icon name="FilePlus" size={16} strokeWidth={2} />
						</button>
					</div>
				</div>
			</header>
			{state.rootNode ? (
				<Tree className="flex-1" initialExpandedItems={[state.rootNode.path]}>
					<FileNode node={state.rootNode} />
				</Tree>
			) : (
				<p>No notespace open</p>
			)}
		</div>
	);
};
