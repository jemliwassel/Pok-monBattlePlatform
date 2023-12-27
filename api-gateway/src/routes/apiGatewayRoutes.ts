import { Route } from "../models/route";

const ROUTES: Route[] = [
  {
    url: "/auth",
    auth: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: "http://authentication-service:5001/",
      changeOrigin: true,
    },
  },
  {
    url: "/game",
    auth: true,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: "http://game-service:5002/",
      changeOrigin: true,
    },
  },
  {
    url: "/users",
    auth: false,
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 5,
    },
    proxy: {
      target: "http://user-service:5003/",
      changeOrigin: true,
    },
  },
];

export { ROUTES };
