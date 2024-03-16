import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import {
  createUserSignUpSchema,
  createUserSignInSchema,
} from "../schemas/userSchemas.js";
import * as authController from "../controllers/authControllers.js";

const authRouter = express.Router();
import { authenticate } from "../middlewares/authenticate.js";

authRouter.post(
  "/signup",
  validateBody(createUserSignUpSchema),
  authController.signUp
);

authRouter.post(
  "/signin",
  validateBody(createUserSignInSchema),
  authController.signIn
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);
export default authRouter;
