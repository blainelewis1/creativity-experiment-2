import React from "react";

import App from "./App";
import "./index.css";
import "@blainelewis1/menus/dist/style.css";

import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
