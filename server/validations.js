import { body } from "express-validator";

export const loginValidation = [
  body("email", "Неверный формат почты").isEmail(),
];

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("name", "Укажите имя").isLength({ min: 3 }),
];
