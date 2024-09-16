import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import React from "react";
import App from "../src/App";
// import App from "./App";

export function SSRRender(url: string | Partial<Location>) {
  return ReactDOMServer.renderToString(
    <StaticRouter location={url}>{<App />}</StaticRouter>
  );
}

globalThis.__rollup_no_tree_shaking = { SSRRender };
