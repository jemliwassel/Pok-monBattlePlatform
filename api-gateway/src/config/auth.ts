import * as express from "express";
import session from "express-session";
import { Route } from "../models/route";

const setupAuth = (app: express.Express, routes: Route[]) => {};

export { setupAuth };
