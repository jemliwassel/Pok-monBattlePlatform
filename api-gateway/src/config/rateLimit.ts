import * as express from "express";
import rateLimit from "express-rate-limit";
import { Route } from "../models/route";

const setupRateLimit = (app: express.Express, routes: Route[]) => {
  routes.forEach((r) => {
    if (r.rateLimit) {
      app.use(r.url, rateLimit(r.rateLimit));
    }
  });
};

export { setupRateLimit };
