import { h, Fragment } from "preact";
import { ErrorBoundary, LocationProvider, Route, Router } from "preact-iso";

import { Toaster } from "./components/ui/sonner";

import { Repo } from "./components/pages/repo";
import { Editor } from "./components/pages/editor";
// import { PollStream, PollTree, StartScan } from "../wailsjs/go/main/App";

export function App() {
	return (
		<>
			<LocationProvider>
				<ErrorBoundary>
					<Router>
						<Route path="/" component={Repo} />
						<Route path="/editor" component={Editor} />
					</Router>
				</ErrorBoundary>
			</LocationProvider>
			<Toaster />
		</>
	);
}
