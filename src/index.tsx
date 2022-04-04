import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import "./index.css";

import { ReactFromModule } from "@blainelewis1/menus";
console.log(React === ReactFromModule); //false

ReactDOM.render(<App />, document.getElementById("root"));
