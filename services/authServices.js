import bcrypt from "bcrypt";
import { User } from "../models/user.js";

export const findUserByEmail = (filter) => User.findOne(filter);
export const signUp = async (data) => {
  const hashPassword = await bcrypt.hash(data.password, 10);
  console.log(hashPassword);

  return User.create({ ...data, password: hashPassword });
};

export const validatePassword = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);
