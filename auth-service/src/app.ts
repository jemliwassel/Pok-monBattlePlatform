import express from "express";
import * as routes from "./routes/authRoute";
var cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
routes.register(app);

export { app };
