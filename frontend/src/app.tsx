import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";

import { Toaster } from "./components/ui/sonner";

import { Root } from "./components/pages/root";
import { Repo } from "./components/pages/repo";
import { Recents } from "./components/pages/repo/recents";
import { Editor, EditorContent } from "./components/pages/editor";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{
				path: "",
				Component: Repo,
				children: [
					{
						index: true,
						loader: Recents.loader,
						HydrateFallback: Recents.Fallback,
						Component: Recents,
					},
				],
			},
			{
				path: "/editor",
				Component: Editor,
				children: [
					{
						index: true,
						loader: EditorContent.loader,
						HydrateFallback: EditorContent.Fallback,
						Component: EditorContent,
					},
				],
			},
		],
	},
]);

export function App() {
	return (
		<>
			<RouterProvider router={router} />
			<Toaster />
		</>
	);
}
