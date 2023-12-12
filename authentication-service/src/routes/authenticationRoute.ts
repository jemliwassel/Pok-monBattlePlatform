import * as express from "express";
import * as UserController from "../controllers/userController";

//initialize usercontroller

export const register = (app: express.Application) => {
  app.post("/auth/authenticate", async (req, res) => {
    try {
      const userResult = UserController.authenticateUser(
        req.body.email,
        req.body.password
      );
      console.log(userResult);
      if (userResult.status == "success")
        return res.status(200).json(userResult);
      else return res.status(404).json(userResult);
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ status: "error", message: "something went wrong" });
    }
  });

  // get all users
  // app.get("/user-context", (req, res) => {
  //   const decodingResult = UserController.getUserContext(
  //     req.query.token.toString()
  //   );
  //   if (decodingResult.status == "success")
  //     return res.status(200).json(decodingResult.result);
  //   else return res.status(400).json(decodingResult);
  // });
  // add user

  app.post("/auth/users", async (req, res) => {
    try {
      const newUser = req.body;
      const result = UserController.addUser(
        newUser.id,
        newUser.email,
        newUser.password
      );
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });
};
