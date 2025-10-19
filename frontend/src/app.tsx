import React from "react";

import { Toaster } from "./components/ui/sonner";

import { Root } from "./components/pages/root";
import { Repo } from "./components/pages/repo";
import { Editor } from "./components/pages/editor";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
	{
		path: "/",
		Component: Root,
		children: [
			{ index: true, loader: Repo.loader, Component: Repo },
			{ path: "/editor", Component: Editor },
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
