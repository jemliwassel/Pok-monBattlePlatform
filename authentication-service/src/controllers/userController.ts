import UserRepository from "../repositories/userRepository";
import { DecodedToken } from "../models/decodedToken";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();
const userRepository = new UserRepository();

// define a function to generate jwt token
const authenticateUser = (email: string, password: string) => {
  const result = userRepository.authenticateUser(email, password);
  if (result.status === "success") {
    const user: any = result.result;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return { status: "success", result: token };
  } else {
    return { status: "error", message: "user not found" };
  }
};

const getUserContext = (token: string) => {
  let decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

  if (decoded) {
    return {
      status: "success",
      result: { email: decoded.email, role: decoded.role },
    };
  } else return { status: "Invalid Token", result: {} };
};

// add entry to user table
const addUser = async (id: string, email: string, password: string) => {
  const result = userRepository.createUser(id, email, password);
  if (result.status === "success") {
    return { status: "success", result: result.result };
  } else {
    return { status: "error", message: "user not created" };
  }
};

export { addUser, authenticateUser };
