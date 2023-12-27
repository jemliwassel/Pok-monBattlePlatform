import { Game, Round } from "../models/game";
import { ObjectId } from "mongodb";
import { collections } from "../services/dbService";

async function getGames() {
  return await collections.games?.find({}).toArray();
}

async function createNewGame(
  idFirstPlayer: number,
  idSecondPlayer: number | undefined
) {
  const newGame: Game = {
    idFirstPlayer,
    idSecondPlayer,
    matchStatus: idSecondPlayer
      ? process.env.GAME_STATE_IN_PROGRESS
      : process.env.GAME_STATE_WAITING,
    startDate: new Date().toISOString(),
    winner: 0,
    rounds: [],
  };
  if (idSecondPlayer) newGame.idSecondPlayer = idSecondPlayer;
  const insertedGame = await collections.games?.insertOne(newGame);
  if (insertedGame)
    return `A new game was successfully created. New game id : ${insertedGame.insertedId}`;
  throw new Error("Failed to create a new game : something went wrong");
}

async function getGame(gameId: string) {
  const game = await collections.games?.findOne({ _id: new ObjectId(gameId) });
  if (game) return game;
  throw new Error(`Game with id ${gameId} was not found`);
}

async function joinGame(gameId: string, playerId: number) {
  const result = await collections.games?.updateOne(
    { _id: new ObjectId(gameId) },
    {
      $set: {
        idSecondPlayer: playerId,
        matchStatus: process.env.GAME_STATE_IN_PROGRESS,
      },
    }
  );
  if (result.acknowledged)
    return `The player with id ${playerId} has successfully joined the game with id ${gameId}`;
  throw new Error("Failed to join the game");
}

async function sendPokemonToTheArena(
  gameId: string,
  pokemonId: number,
  playerId: number
) {
  const currentGame = await getGame(gameId);
  if (currentGame.matchStatus != process.env.GAME_STATE_IN_PROGRESS) {
    throw new Error("Failed : The current game is not in progress");
  }
  launchPokemon(playerId, pokemonId, currentGame);
  let updatedData: Partial<Game> = {
    rounds: currentGame.rounds,
    currentRound: currentGame.rounds.length,
  };
  if (
    currentGame.rounds.filter(
      (round) =>
        round.roundWinner ===
        currentGame.rounds[currentGame.rounds.length - 1].roundWinner
    ).length === 3 // There are 2 players and 5 rounds, so the player who wants to win, has to win 3 rounds at least.
  ) {
    updatedData.winner =
      currentGame.rounds[currentGame.rounds.length - 1].roundWinner;
    updatedData.matchStatus = process.env.GAME_STATE_FINISHED;
  }

  const updateGame = await collections.games?.updateOne(
    { _id: new ObjectId(gameId) },
    { $set: updatedData }
  );
  if (updateGame.acknowledged)
    return `The pokemon with id ${pokemonId} was successfully sent to the Arena`;
  throw new Error("Failed to sent the pokemon : something went wrong");
}

function launchPokemon(playerId: number, pokemonId: number, game: Game) {
  let currentRound;

  if (game.rounds.length === 0) {
    if (game.idFirstPlayer === playerId) {
      currentRound = {
        pokemonIdOfFirstPlayer: pokemonId,
        roundWinner: 0,
      };
    } else {
      currentRound = {
        pokemonIdOfSecondPlayer: pokemonId,
        roundWinner: 0,
      };
    }
    game.rounds.push({
      ...currentRound,
      roundStatus: process.env.ROUND_STATE_IN_PROGRESS,
    });
  } else {
    const currentRoundInTheGame = game.rounds[game.rounds.length - 1];

    if (!currentRoundInTheGame.pokemonIdOfFirstPlayer) {
      currentRoundInTheGame.pokemonIdOfFirstPlayer = pokemonId;
    } else if (!currentRoundInTheGame.pokemonIdOfSecondPlayer) {
      currentRoundInTheGame.pokemonIdOfSecondPlayer = pokemonId;

      const winnerId = getWinnerId(
        currentRoundInTheGame,
        game.idFirstPlayer,
        game.idSecondPlayer
      );

      currentRoundInTheGame.roundWinner = winnerId;
      currentRoundInTheGame.roundStatus = process.env.ROUND_STATE_FINISHED;
      if (game.rounds.length < 5) {
        const newRound = {
          pokemonIdOfFirstPlayer: undefined,
          pokemonIdOfSecondPlayer: undefined,
          roundWinner: 0,
          roundStatus: process.env.ROUND_STATE_IN_PROGRESS,
        };
        game.rounds.push(newRound);
      } else {
        game.matchStatus = process.env.GAME_STATE_FINISHED;
      }
    }
  }
}

function getWinnerId(
  currentRound: Round,
  idFirstPlayer: number,
  idSecondPlayer: number
) {
  const damage1 = getPokemonDamage(currentRound.pokemonIdOfFirstPlayer);
  const damage2 = getPokemonDamage(currentRound.pokemonIdOfSecondPlayer);
  if (damage1 >= damage2) return idFirstPlayer;
  else return idSecondPlayer;
}
function getPokemonDamage(pokemonId) {
  return Math.floor(Math.random() * pokemonId);
}

async function getRound(gameId: string, roundNumber: number) {
  const game = await getGame(gameId);
  if (roundNumber <= game.rounds.length) return game.rounds[roundNumber - 1];
  throw new Error(`Round ${roundNumber} was not found`);
}

async function deleteGame(gameId: string) {
  const result = await collections.games?.deleteOne({
    _id: new ObjectId(gameId),
  });
  if (result) return `The game with id ${gameId} was successfully deleted `;
  throw new Error(`Failed to delete the game ${gameId}`);
}

export {
  getGames,
  createNewGame,
  getGame,
  joinGame,
  sendPokemonToTheArena,
  getRound,
  deleteGame,
};
