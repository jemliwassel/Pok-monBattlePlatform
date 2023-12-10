import UserRepository from "../repositories/userRepository";
import { Token } from "./../models/token";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const userRepository = new UserRepository(process.env.DB_PATH);

//Authenticate aa user and create a JWT Token
const authenticateUser = (email: string, password: string) => {
  const userAdded = userRepository.authenticateUser(email, password);
  if (userAdded.status == "SUCCESS") {
    const user = userAdded.message;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return { status: "SUCCESS", message: token };
  } else {
    return { status: "ERROR", message: "User was not found !" };
  }
};

//Add user to DB
const addUser = async (id: string, email: string, password: string) => {
  const createdUser = userRepository.createUser(id, email, password);
  if (createdUser.status == "SUCCESS") {
    return { status: "success", message: createdUser.message };
  } else {
    return { status: "ERROR", message: "User was not created !" };
  }
};

export { authenticateUser, addUser };
