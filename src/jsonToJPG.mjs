import pkg from "@tldraw/tldraw";

import circle from "./circle.json" assert { type: "json" };

const { TldrawApp } = pkg;

const app = new TldrawApp();
app.loadDocument(circle.document);
// @ts-ignore
console.log(await app.exportImage("jpeg"));
