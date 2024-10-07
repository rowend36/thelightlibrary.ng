import ReactDOMServer from "react-dom/server";
import {
  createStaticHandler,
  createStaticRouter,
  StaticHandlerContext,
  StaticRouterProvider,
} from "react-router-dom/server";
import React from "react";
import routes from "../src/routes";

const handler = createStaticHandler(routes);
export async function SSRRender(url: string) {
  const request = new Request(
    new URL(url, "http://thelightlibrary.vercel.app/")
  );
  console.log(request.url);
  let context = await handler.query(request);
  if (context instanceof Request) {
    context = await handler.query(request);
    if (context instanceof Request) {
      throw Error(`Infinite Redirect for url ${url}!!!`);
    }
  }
  return ReactDOMServer.renderToString(
    <StaticRouterProvider
      router={createStaticRouter(routes, context as StaticHandlerContext)}
      context={context as StaticHandlerContext}
    />
  );
}

globalThis.__rollup_no_tree_shaking = { SSRRender };
