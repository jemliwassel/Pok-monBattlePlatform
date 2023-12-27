import { User } from "../models/user";
import { Pokemon } from "../models/pokemon";
import { ObjectId } from "mongodb";
import { collections } from "../services/dbService";
// import axios
import axios from "axios";

async function createNewUser(
  firstName: string,
  lastName: string,
  pseudo: string,
  email: string,
  password: string
) {
  const newUser: User = {
    _id: new ObjectId(),
    pseudo,
    credit: 0,
    badges: [""],
    pokemons: [""],
    score: 0,
    creationDate: new Date().toString(),
  };
  try {
    const insertedUserToDB = await collections.users?.insertOne(newUser);
    console.log(insertedUserToDB);
    if (insertedUserToDB) {
      const authResult = await axios.post(
        "http://authentification-service:5001/auth/users",
        //"http://0.0.0.0:5001/auth/users",
        {
          id: newUser._id,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (authResult) {
        return {
          status: "success",
          userIdCreated: insertedUserToDB.insertedId,
        };
      }
    }
    throw new Error("Failed to create a new user : something went wrong");
  } catch (error) {
    console.error(error);
  }
}

// define a function to update user
async function updateUser(
  email: string,
  password?: string,
  firstName?: string,
  lastName?: string,
  pseudo?: string
) {
  const updatedUser = await collections.users?.updateOne(
    { email },
    {
      $set: {
        password,
        firstName,
        lastName,
        pseudo,
      },
    }
  );
  if (updatedUser)
    return { status: "success", userIdUpdated: updatedUser.upsertedId };
  throw new Error("Failed to update the user : something went wrong");
}

async function deleteUser(email: string) {
  const deletedUser = await collections.users?.deleteOne({ email });
  if (deletedUser)
    return { status: "success", userIdDeleted: deletedUser.deletedCount };
  throw new Error("Failed to delete the user : something went wrong");
}

async function getAllUsers() {
  const allUsers = await collections.users?.find().toArray();
  if (allUsers) return allUsers;
  throw new Error("Failed to get all users : something went wrong");
}

async function getUserById(id: string) {
  const user = await collections.users?.findOne({ _id: new ObjectId(id) });
  if (user) return user;
  throw new Error(`Failed to get the user with id ${id}`);
}

async function buyNewPokemon(userId: string, pokemonId: string) {
  const user = await collections.users?.findOne({ _id: new ObjectId(userId) });
  const pokemon = await collections.pokemons?.findOne({
    _id: new ObjectId(pokemonId),
  });
  if (user && pokemon) {
    if (user.credit >= pokemon.price) {
      const result = await collections.users?.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            credit: user.credit - pokemon.price,
            pokemon: user.pokemons.concat(pokemonId),
          },
        }
      );
      if (result)
        return { status: "success", userIdUpdated: result.upsertedId };
      throw new Error("Failed to update the user with new informations");
    } else {
      throw new Error("You have not enough credit to buy a new Pokemon");
    }
  }
  throw new Error("Failed to get the user or the specified pokemon");
}

async function incrementScoreBy1(userId: string) {
  const user = await collections.users?.findOne({ _id: new ObjectId(userId) });
  if (user) {
    const result = await collections.users?.updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          score: user.score + 1,
        },
      }
    );
    if (result) return { status: "success", userIdUpdated: result.upsertedId };
    throw new Error("Failed to increment the score by 1");
  }
  throw new Error("Failed to get the user");
}

export {
  createNewUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  buyNewPokemon,
  incrementScoreBy1,
};
