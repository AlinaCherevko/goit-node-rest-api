import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import {
  createUserSignUpSchema,
  createUserSignInSchema,
  createUsersUpdateSubscription,
} from "../schemas/userSchemas.js";
import * as authController from "../controllers/authControllers.js";

const authRouter = express.Router();
import { authenticate } from "../middlewares/authenticate.js";

authRouter.post(
  "/register",
  validateBody(createUserSignUpSchema),
  authController.signUp
);

authRouter.post(
  "/login",
  validateBody(createUserSignInSchema),
  authController.signIn
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

authRouter.patch(
  "/users",

  validateBody(createUsersUpdateSubscription),
  authenticate,
  authController.updateSubscription
);

export default authRouter;
