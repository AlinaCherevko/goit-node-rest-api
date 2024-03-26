import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import gravatar from "gravatar";
import jimp from "jimp";
import fs from "fs/promises";
import path from "path";
import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

import { controllersWrapper } from "../decorators/controllersWrapper.js";

dotenv.config();
const { JWT_SECRET } = process.env;
const avatarsPath = path.resolve("public", "avatars");

export const signUp = controllersWrapper(async (req, res) => {
  const { email } = req.body;
  const avatarURL = gravatar.url(email, { protocol: "https" });
  const user = await authService.findUserByEmail({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const newUser = await authService.signUp({ ...req.body, avatarURL });
  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
});

export const signIn = controllersWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findUserByEmail({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparedPassword = await authService.validatePassword(
    password,
    user.password
  );
  if (!comparedPassword) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "48h" });
  res.json({
    token,
    user: { email: user.email, subscription: user.subscription },
  });
  await authService.updateUser({ _id: id }, { token });
});

export const getCurrent = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

export const logout = async (req, res, next) => {
  const { _id } = req.user;
  await authService.updateUser({ _id }, { token: "" });
  res.status(204).json({});
};

export const updateSubscription = controllersWrapper(async (req, res, next) => {
  const { _id } = req.user;
  const { subscription } = req.body;
  if (!subscription) {
    throw HttpError(400, "You don't pass a subscription ");
  }
  const result = await authService.updateUserSubscription(_id, {
    subscription,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
});

export const changeAvatar = controllersWrapper(async (req, res, next) => {
  console.log(req.file);
  const { path: oldPath, originalname, filename } = req.file;
  const extension = originalname.split(".").pop();
  const { _id } = req.user;

  const newPath = path.join(avatarsPath, filename);

  await jimp
    .read(oldPath)
    .then((image) => {
      return image
        .resize(250, 250) // Зміна розміру на 250x250 пікселів
        .quality(100) // Підтримка якості зображення
        .write(oldPath); // Зберігання зображення з новим розміром
    })
    .catch((err) => {
      throw new Error(`Error processing image: ${err}`);
    });
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", filename);
  const user = await authService.updateUserSubscription(_id, { avatarURL });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  res.json({ avatarURL: user.avatarURL });
});
