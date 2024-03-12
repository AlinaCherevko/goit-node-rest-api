import Joi from "joi";

export const createUserSignUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
export const createUserSignInSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().min(6).required(),
});
