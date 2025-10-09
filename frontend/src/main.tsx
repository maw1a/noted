import { render } from "preact";
import { App } from "./app";

import "@fontsource-variable/geist-mono";
import "./style.css";

render(<App />, document.getElementById("app")!);
