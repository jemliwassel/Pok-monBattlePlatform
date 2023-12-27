import * as express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { Route } from "../models/route";

const setupProxies = (app: express.Express, routes: Route[]) => {
  routes.forEach((r: Route) => {
    app.use(r.url, createProxyMiddleware(r.proxy));
  });
};

export { setupProxies };
