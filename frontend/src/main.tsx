import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";

import "@fontsource-variable/geist-mono";
import "./style.css";

const container = document.body;
const root = createRoot(container);
root.render(<App />);
