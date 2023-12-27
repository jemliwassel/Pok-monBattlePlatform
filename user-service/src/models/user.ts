import { ObjectId } from "mongodb";

export interface User {
  _id: ObjectId;
  pseudo: string;
  credit: number;
  badges: string[];
  pokemons: string[];
  score: number;
  creationDate: string;
}
