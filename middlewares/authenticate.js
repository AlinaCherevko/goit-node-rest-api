import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import HttpError from "../helpers/HttpError.js";
import { findUserByEmail } from "../services/authServices.js";

dotenv.config();
const { JWT_SECRET } = process.env;

export const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }
  const [bearer, token] = authorization.split(" ");
  if (bearer !== "Bearer") {
    return next(HttpError(401, "Bearer not found"));
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await findUserByEmail({ _id: id });
    if (!user) {
      return next(HttpError(401, "User not found"));
    }
    if (!user.token) {
      return next(HttpError(401, "User already logout"));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
