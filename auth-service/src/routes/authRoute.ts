import * as express from "express";
import * as UserController from "../controllers/userController";

export const register = async (app: express.Application) => {
  app.post("/auth/login", async (req, res) => {
    try {
      const userAuthenticated = UserController.authenticateUser(
        req.body.email,
        req.body.password
      );
      if (userAuthenticated.status == "SUCCESS") {
        return res.status(200).json(userAuthenticated);
      } else {
        return res.status(404).json(userAuthenticated);
      }
    } catch (error) {
      return res
        .status(500)
        .json({ status: "Error", message: "Something went wrong !" });
    }
  });

  app.post("/auth/user", async (req, res) => {
    try {
      const newUser = req.body;
      const UserAdded = UserController.addUser(
        newUser.id,
        newUser.email,
        newUser.password
      );
      res.send(UserAdded);
    } catch (error) {
      res.status(409).json(error.message);
    }
  });
};
