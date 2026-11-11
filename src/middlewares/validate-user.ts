import { validateSchema } from "./validateSchema.js";
import { createUserSchema, loginSchema } from "../schemas/user.schema.js";

export const validateCreateUser = validateSchema(createUserSchema);
export const validateLogin = validateSchema(loginSchema);