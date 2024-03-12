import express from "express";
import { validateBody } from "../helpers/validateBody.js";
import { createUserSignUpSchema } from "../schemas/userSchemas.js";
import * as authController from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validateBody(createUserSignUpSchema),
  authController.signUp
);

export default authRouter;
