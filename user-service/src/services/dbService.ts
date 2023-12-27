import * as mongoDB from "mongodb";
import { User } from "../models/user";
import { Pokemon } from "../models/pokemon";
import dotenv from "dotenv";

export const collections: {
  users?: mongoDB.Collection<User>;
  pokemons?: mongoDB.Collection<Pokemon>;
} = {};

export async function connectToDatabase() {
  dotenv.config();
  const client = new mongoDB.MongoClient(process.env.DB_CONN_STRING || "");

  await client.connect();

  const db = client.db(process.env.DB_NAME);

  await applySchemaValidation(db);

  const usersCollection = db.collection<User>(
    process.env.USER_COLLECTION_NAME || ""
  );

  const pokemonsCollection = db.collection<Pokemon>(
    process.env.POKEMON_COLLECTION_NAME || ""
  );

  collections.users = usersCollection;

  collections.pokemons = pokemonsCollection;

  console.log(
    `Successfully connected to database: ${db.databaseName} and collections: ${usersCollection.collectionName}, and ${pokemonsCollection.collectionName}`
  );
}

async function applySchemaValidation(db: mongoDB.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["badges", "credit", "pokemons", "score", "pseudo"],
      additionalProperties: true,
      properties: {
        _id: {
          bsonType: "objectId",
        },
        pseudo: {
          bsonType: "string",
          description: "'pseudo' is required and is a string",
        },

        badges: {
          bsonType: ["array"],
          description: "'badges' is required and is a array of strings",
          items: {
            bsonType: "string",
          },
        },
        credit: {
          bsonType: "number",
          description: "'credit' is required and is a number",
        },
        pokemons: {
          bsonType: ["array"],
          description: "'pokemons' is required and is a array of strings",
          items: {
            bsonType: "string",
          },
        },
        score: {
          bsonType: "number",
          description: "'score' is required and is a number",
        },
        creationDate: {
          bsonType: "string",
          description: "must be a string",
        },
      },
    },
  };

  await db
    .createCollection(process.env.USER_COLLECTION_NAME || "", {
      validator: { $jsonSchema: jsonSchema },
    })
    .catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection(process.env.USER_COLLECTION_NAME || "", {
          validator: jsonSchema,
        });
      }
    });
}
