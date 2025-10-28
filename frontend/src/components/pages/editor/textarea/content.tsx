import { FC, useCallback, useEffect, useEffectEvent, useState } from "react";
import { type LoaderFunctionArgs, useLoaderData } from "react-router";

import { commands } from "@/command";
import { useStore } from "@/components/store";
import { FileInfo, FileService } from "@/services/file";
import { Editor } from "./editor";

import logoAltIcon from "@/assets/images/logo-alt-icon.svg";

const EmptyContent = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="flex flex-col items-center gap-12 mb-16">
      <svg className="h-36 text-dark/70" viewBox="0 0 36 36">
        <use href={`${logoAltIcon}#logo-icon`} />
      </svg>
      <div className="mt-8 text-sm space-y-4 flex flex-col items-start text-text-muted">
        {commands.editorCommandPalette.Node()}
        {commands.editorNotespaceFileOpen.Node()}
        {commands.editorNotespaceFind.Node()}
        {commands.editorSettings.Node()}
      </div>
    </div>
  </div>
);

const EditorContent: FC<{
  info: FileInfo;
  content: string;
  setContent: (value: string) => void;
}> = ({ info, content, setContent }) => {
  return (
    <div className="w-full h-full">
      <Editor
        colorMode="dark"
        info={info}
        value={content}
        onChange={setContent}
        minHeight={220}
        style={{ overflow: "visible", paddingTop: "1.5rem" }}
      />
    </div>
  );
};

const Content = () => {
  const {
    root,
    path,
    content: defaultContent,
    type,
  }: LoaderData<typeof Content.loader> = useLoaderData();
  const [state, setState] = useStore();

  const handleSelect = useEffectEvent((id: string) => {
    const activeIdx = state.active_tab
      ? state.tabs.indexOf(state.active_tab.path)
      : -1;
    const includes = state.tabs.includes(id);
    let tabs = [...state.tabs];

    if (!includes) tabs.splice(activeIdx + 1, 0, id);

    setState({
      active_tab: {
        path: id,
        content: defaultContent || "",
        defaultContent: defaultContent || "",
      },
      tabs,
    });
  });

  useEffect(() => {
    if (path) handleSelect(path);
  }, [path, defaultContent]);

  if (type === "empty") return <EmptyContent />;

  return (
    <EditorContent
      info={FileService.getFileInfo(root, path)}
      content={state.active_tab?.content || ""}
      setContent={(v) =>
        setState({
          active_tab: state.active_tab
            ? { ...state.active_tab, content: v }
            : null,
        })
      }
    />
  );
};

type LoaderResponse = { root: string } & (
  | { type: "empty"; path: null; content: null }
  | { type: "new" | "exists"; path: string; content: string }
);

Content.loader = async ({
  request,
}: LoaderFunctionArgs): Promise<LoaderResponse> => {
  const url = new URL(request.url);
  const root = url.searchParams.get("root");
  const filepath = url.searchParams.get("file");

  if (!root) throw new Error("Failed to open editor. No notespace selected.");

  if (!filepath) return { root, path: null, content: null, type: "empty" };

  if (filepath === root) return { root, path: root, content: "", type: "new" };

  const files = new FileService(root);
  const content = await files.getFileContent(filepath);

  return { root, path: filepath, content, type: "exists" };
};

Content.Fallback = () => <div>Loading..</div>;

export { Content };
