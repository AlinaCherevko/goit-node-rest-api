import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

import { controllersWrapper } from "../decorators/controllersWrapper.js";

dotenv.config();
const { JWT_SECRET } = process.env;

export const signUp = controllersWrapper(async (req, res) => {
  const { email } = req.body;
  const user = await authService.findUserByEmail({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authService.signUp(req.body);
  res.status(201).json({
    name: newUser.name,
    email: newUser.email,
  });
});

export const signIn = controllersWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUserByEmail({ email });
  if (!user) {
    throw HttpError(401, "Email or password are not exist");
  }
  const comparedPassword = await authService.validatePassword(
    password,
    user.password
  );
  if (!comparedPassword) {
    throw HttpError(401, "Email or password are not exist");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
  res.json({ token });

  await authService.updateUser({ _id: id }, { token });
});

export const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

export const logout = async (req, res, next) => {
  const { _id } = req.user;
  await authService.updateUser({ _id }, { token: " " });
  res.json({ message: "Logout success" });
};
