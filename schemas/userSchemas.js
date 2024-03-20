import Joi from "joi";
import { subscription } from "../constants/subscription.js";

export const createUserSignUpSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const createUserSignInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const createUsersUpdateSubscription = Joi.object({
  subscription: Joi.string()
    .valid(...subscription)
    .required(),
});
