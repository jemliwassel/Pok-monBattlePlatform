type Route = {
  url: string;
  auth: boolean;
  rateLimit?: object;
  proxy: object;
};

export { Route };
