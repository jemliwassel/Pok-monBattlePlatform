import { app } from "./app";
import { AddressInfo } from "net";
import { connectToDatabase } from "./services/dbService";

connectToDatabase().then(() => {
  const server = app.listen(5003, "0.0.0.0", () => {
    const { port, address } = server.address() as AddressInfo;
    console.log("Server listening on:", "http://" + address + ":" + port);
  });
});
