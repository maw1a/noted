import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Toaster } from "./components/ui/sonner";

import { Repo } from "./components/pages/repo";
import { Editor } from "./components/pages/editor";

export function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Repo />} />
					<Route path="/editor" element={<Editor />} />
				</Routes>
			</Router>
			<Toaster />
		</>
	);
}
