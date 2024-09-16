import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import * as R from "../dist/.server/entry-server.js";

const render = globalThis.__rollup_no_tree_shaking.SSRRender;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute("../dist/index.html"), "utf-8");
// const render = (await import("../dist/server/server.js")).SSRRender;

// determine routes to pre-render from src/pages
const routesToPrerender = fs
  .readdirSync(toAbsolute("../src/pages"))
  .map((file) => {
    const name = file.replace(/\.tsx$/, "").toLowerCase();
    return name === "home" ? `/` : `/${name}`;
  });

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    let appHtml = "";
    try {
      appHtml = render(url).replaceAll("&#x27;", "'");
    } catch (e) {
      console.log(e);
    }
    const html = template.replace(
      `<div id="root">`,
      `<div id="root">` + appHtml
    );

    const filePath = `../dist/${url === "/" ? "/index" : url}.html`;
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
