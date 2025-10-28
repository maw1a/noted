import { ComponentProps, useMemo } from "react";
import type { Node } from "@go/noted";
import { Icon } from "@/components/icon";
import { useStore } from "@/components/store";
import { Tree, File, Folder } from "@/components/ui/file-tree";
import { FileService } from "@/services/file";

enum NodeType {
  File = "file",
  Dir = "dir",
  Symlink = "symlink",
}

const nodesFilter = (node: Node) => node.name === ".noted" || !node.isHidden;

const Symlink = (props: ComponentProps<typeof Folder>) => {
  return (
    <Folder
      {...props}
      element={
        <>
          {props.element} <Icon name="ArrowUpRight" size={16} />
        </>
      }
    />
  );
};

const FileNode = ({ root, node }: { root: string; node: Node }) => {
  const children = useMemo(
    () =>
      node.children
        ?.filter(nodesFilter)
        .map((child) => <FileNode key={child.path} root={root} node={child} />),
    [node],
  );

  const fileinfo = useMemo(() => {
    return FileService.getFileInfo(root, node.path, node.extension);
  }, [root, node.path, node.extension]);

  if (node.type === NodeType.File)
    return (
      <File
        id={node.path}
        value={node.path}
        to={{
          pathname: `/editor`,
          search: `?root=${root}&file=${node.path}`,
        }}
        prefetch="intent"
      >
        {fileinfo.filename}
      </File>
    );

  if (node.type === NodeType.Symlink)
    return (
      <Symlink value={node.path} id={node.path} element={fileinfo.filename}>
        {children}
      </Symlink>
    );

  return (
    <Folder value={node.path} id={node.path} element={fileinfo.filename}>
      {children}
    </Folder>
  );
};

export const Files = () => {
  const [state] = useStore();
  const expandedItems = useMemo(() => {
    if (!state.root) return [];
    if (state.active_tab) {
      const rel = state.active_tab.path.replace(state.root, "");
      let paths: Array<string> = [];
      const parts = rel.split("/");
      for (let i = 1; i < parts.length; i++) {
        paths.push(state.root + parts.slice(0, i).join("/"));
      }
      return paths;
    } else return [state.root];
  }, [state.root, state.active_tab]);

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
        <Tree
          className="flex-1"
          initialExpandedItems={expandedItems}
          defaultValue={state.active_tab?.path || undefined}
        >
          <FileNode root={state.root} node={state.rootNode} />
        </Tree>
      ) : (
        <p>No notespace open</p>
      )}
    </div>
  );
};
