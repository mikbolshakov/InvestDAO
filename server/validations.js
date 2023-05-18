import { body } from "express-validator";

export const loginValidation = [body("email", "Invalid mail format").isEmail()];

export const registerValidation = [
  body("email", "Invalid mail format").isEmail(),
  body("name", "Enter a name").isLength({ min: 3 }),
];
