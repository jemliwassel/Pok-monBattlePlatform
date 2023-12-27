import express from "express";
import { setupRateLimit } from "./config/rateLimit";
import { setupAuth } from "./config/auth";
import { setupProxies } from "./config/proxy";
import { ROUTES } from "./routes/apiGatewayRoutes";

const app = express();
app.use(express.json());
setupRateLimit(app, ROUTES);
setupAuth(app, ROUTES);
setupProxies(app, ROUTES);

export { app };
