import express from "express";
import * as routes from "./routes/authenticationRoute";

const app = express();
app.use(express.json());
routes.register(app);
// app.use(cors);

// const options: cors.CorsOptions = {
//   allowedHeaders: [
//     "Origin",
//     "X-Requested-With",
//     "Content-Type",
//     "Accept",
//     "X-Access-Token",
//   ],
//   credentials: true,
//   methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
//   origin: "*",
//   preflightContinue: false,
// };

// app.use(cors(options));

export { app };
