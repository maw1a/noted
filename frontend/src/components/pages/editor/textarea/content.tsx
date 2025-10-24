import { useEffect, useEffectEvent, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";

import { ScannerService } from "@/services/scanner";
import { commands } from "@/command";
import { useStore } from "@/components/store";

import logoAltIcon from "@/assets/images/logo-alt-icon.svg";
import { fileInfo } from "@/utils/filename";

const Content = () => {
	const {
		root,
		path,
		content: defaultContent,
		type,
	}: LoaderData<typeof Content.loader> = useLoaderData();
	const [state, setState] = useStore();
	const [content, setContent] = useState(defaultContent || "");

	const handleSelect = useEffectEvent((id: string) => {
		const activeIdx = state.active_tab
			? state.tabs.indexOf(state.active_tab)
			: -1;
		const includes = state.tabs.includes(id);
		let tabs = [...state.tabs];

		if (!includes) tabs.splice(activeIdx + 1, 0, id);

		setState({ active_tab: id, tabs });
	});

	useEffect(() => {
		if (path) handleSelect(path);
	}, [path]);

	if (type === "empty")
		return (
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

	const info = fileInfo(root, path);

	return (
		<div className="w-full h-full">
			<CodeEditor
				className="text-edit! bg-transparent!"
				value={content}
				language={info.ext}
				onChange={(evn) => setContent(evn.target.value)}
				rehypePlugins={[
					[rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
				]}
			/>
		</div>
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

	const scanner = new ScannerService(root);
	const content = await scanner.getFileContent(filepath);

	return { root, path: filepath, content, type: "exists" };
};

export { Content };
