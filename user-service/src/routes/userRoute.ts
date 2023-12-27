import * as express from "express";
import * as UserController from "../controllers/userController";
import { User } from "./../models/user";

export const register = (app: express.Application) => {
  app.get("/users", async (req, res) => {
    try {
      const users = await UserController.getAllUsers();
      res.send(users);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.post("/users", async (req, res) => {
    try {
      const newUser = req.body;
      const result = await UserController.createNewUser(
        newUser.email,
        newUser.password,
        newUser.firstName,
        newUser.lastName,
        newUser.pseudo
      );
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.get("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = await UserController.getUserById(id);
      res.send(user);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.put("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.body;
      const result = await UserController.updateUser(id, user);
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.delete("/users/:id", async (req, res) => {
    try {
      const id = req.params.id;
      const result = await UserController.deleteUser(id);
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.post("/users/:userId/:pokemonId", async (req, res) => {
    try {
      const UserId = req.params.userId;
      const pokemonId = req.params.pokemonId;
      const result = await UserController.buyNewPokemon(UserId, pokemonId);
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });

  app.post("/users/:userId/increment-score", async (req, res) => {
    try {
      const UserId = req.params.userId;
      const result = await UserController.incrementScoreBy1(UserId);
      res.send(result);
    } catch (error) {
      res.status;
      res.send;
    }
  });
};
