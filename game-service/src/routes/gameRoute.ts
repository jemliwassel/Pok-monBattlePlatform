import * as express from "express";
import * as GameController from "../controllers/gameController";

export const register = (app: express.Application) => {
  app.get("/games", async (req, res) => {
    try {
      res.status(200).json(await GameController.getGames());
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/game/create", async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await GameController.createNewGame(
            Number(req.query.idFirstPlayer),
            Number(req.query.idSecondPlayer)
          )
        );
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/game/get", async (req, res) => {
    try {
      res
        .status(200)
        .json(await GameController.getGame(req.query.idGame.toString()));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/game/join", async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await GameController.joinGame(
            req.query.gameId.toString(),
            Number(req.query.playerId)
          )
        );
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.put("/game/send-pokemon_to_the_arena", async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await GameController.sendPokemonToTheArena(
            req.query.gameId.toString(),
            Number(req.query.pokemonId),
            Number(req.query.playerId)
          )
        );
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/game/get-round", async (req, res) => {
    try {
      res
        .status(200)
        .json(
          await GameController.getRound(
            req.query.gameId.toString(),
            Number(req.query.roundNumber)
          )
        );
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/game/delete", async (req, res) => {
    try {
      res
        .status(200)
        .json(await GameController.deleteGame(req.query.gameId.toString()));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
};
