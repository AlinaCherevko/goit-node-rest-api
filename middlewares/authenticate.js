import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { findUserByEmail } from "../services/authServices.js";

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
    next();
  } catch (error) {
    next(HttpError(401));
  }
};
