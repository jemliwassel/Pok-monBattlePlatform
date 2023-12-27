import * as mongoDB from "mongodb";
import { Game } from "../models/game";

export const collections: { games?: mongoDB.Collection<Game> } = {};

export async function connectToDatabase() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING || ""
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.DB_NAME);

  await applySchemaValidationToDB(db);

  const gamesCollection = db.collection<Game>(
    process.env.GAMES_COLLECTION_NAME || ""
  );

  collections.games = gamesCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collection: ${gamesCollection.collectionName}`
  );
}

async function applySchemaValidationToDB(db: mongoDB.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "idFirstPlayer",
        "matchStatus",
        "startDate",
        "winner",
        "rounds",
      ],
      additionalProperties: false,
      properties: {
        _id: {},
        idFirstPlayer: {
          bsonType: "number",
          description: "'idFirstPlayer' is required and is a number",
        },
        idSecondPlayer: {
          bsonType: "number",
          description: "'idSecondPlayer' is a number",
        },
        matchStatus: {
          bsonType: "string",
          enum: [
            process.env.GAME_STATE_IN_PROGRESS,
            process.env.GAME_STATE_WAITING,
            process.env.GAME_STATE_FINISHED,
            process.env.GAME_STATE_CANCELED,
          ],
          description: "'matchStatus' is a string",
        },
        currentRound: {
          bsonType: "number",
          description: "'currentRound' is a number",
        },
        winner: {
          bsonType: "number",
          description: "'winner' is a number",
        },
        startDate: {
          bsonType: "string",
          description: "'startDate' is a string",
        },
        endDate: {
          bsonType: "string",
          description: "'endDate' is a string",
        },
        rounds: {
          bsonType: ["array"],
          items: {
            bsonType: ["object"],
            additionalProperties: false,
            properties: {
              pokemonIdOfFirstPlayer: {
                bsonType: "number",
                description: "'pokemonIdOfFirstPlayer' is a number",
              },
              pokemonIdOfSecondPlayer: {
                bsonType: "number",
                description: "'pokemonIdOfSecondPlayer' is a number",
              },
              roundStatus: {
                bsonType: "string",
                enum: [
                  process.env.ROUND_STATE_IN_PROGRESS,
                  process.env.ROUND_STATE_FINISHED,
                ],
                description: "'roundStatus' is a string",
              },
              roundWinner: {
                bsonType: "number",
                description: "'roundWinner' is a number",
              },
            },
          },
        },
      },
    },
  };

  await db
    .command({
      collMod: process.env.GAMES_COLLECTION_NAME,
      validator: jsonSchema,
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.GAMES_COLLECTION_NAME || "", {
          validator: jsonSchema,
        });
      }
    });
}
