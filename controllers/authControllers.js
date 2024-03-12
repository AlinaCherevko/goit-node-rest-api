import * as authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import { controllersWrapper } from "../decorators/controllersWrapper.js";

export const signUp = controllersWrapper(async (req, res, next) => {
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
