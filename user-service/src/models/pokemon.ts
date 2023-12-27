import { ObjectId } from "mongodb";

export interface Pokemon {
  _id: ObjectId;
  id: number;
  name: string;
  attack: number;
  defense: number;
  speed: number;
  price: number;
}
