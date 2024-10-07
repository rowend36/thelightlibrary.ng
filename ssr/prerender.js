import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "url";
import "../dist/.server/entry-server.js";

const render = globalThis.__rollup_no_tree_shaking.SSRRender;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute("../dist/index.html"), "utf-8");
// const render = (await import("../dist/server/server.js")).SSRRender;

// determine routes to pre-render from src/pages
const root = toAbsolute("../src/pages");
const routesToPrerender = fs
  .readdirSync(root)
  .map(function map(file) {
    if (fs.statSync(root + "/" + file).isDirectory()) {
      return fs.readdirSync(root + "/" + file).map((e) => map(file + "/" + e));
    }
    const name = file.replace(/\.tsx$/, "").toLowerCase();
    if (name.endsWith("layout.tsx")) return [];
    return name === "home" || name === "index" ? `/` : `/${name}`;
  })
  .flat(10);

(async () => {
  // pre-render each route...
  for (const url of routesToPrerender) {
    let appHtml = "";
    try {
      appHtml = (
        await render(url.replace(/__([a-z]+)/g, "/:$1").replace(/_/g, "-"))
      ).replaceAll("&#x27;", "'");
    } catch (e) {
      console.log(e);
    }
    const html = template.replace(
      `<div id="root">`,
      `<div id="root">` + appHtml
    );

    const filePath = `../dist/${url.endsWith("/") ? url + "/index" : url}.html`;
    fs.mkdirSync(path.dirname(toAbsolute(filePath)), { recursive: true });
    fs.writeFileSync(toAbsolute(filePath), html);
  }
})();
