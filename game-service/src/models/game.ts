import { ObjectId } from "mongodb";

interface Round {
  id?: ObjectId;
  pokemonIdOfFirstPlayer: number;
  pokemonIdOfSecondPlayer: number;
  //creaturesInArena: string[];
  roundStatus:
    | typeof process.env.ROUND_STATE_FINISHED
    | typeof process.env.ROUND_STATE_IN_PROGRESS;
  roundWinner?: number;
}

interface Game {
  id?: ObjectId;
  idFirstPlayer: number;
  idSecondPlayer?: number;
  //players: number[];
  matchStatus:
    | typeof process.env.GAME_STATE_IN_PROGRESS
    | typeof process.env.GAME_STATE_WAITING
    | typeof process.env.GAME_STATE_FINISHED
    | typeof process.env.GAME_STATE_CANCELED;
  currentRound?: number;
  startDate: string;
  endDate?: string;
  winner?: number;
  rounds: Round[];
}

export { Round, Game };
