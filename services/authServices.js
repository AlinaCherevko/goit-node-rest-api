import { User } from "../models/user.js";

export const findUserByEmail = (filter) => User.findOne(filter);
export const signUp = (data) => User.create(data);
