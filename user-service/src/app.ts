import express from "express";
import * as routes from "./routes/userRoute";

const app = express();
app.use(express.json());
routes.register(app);

export { app };
