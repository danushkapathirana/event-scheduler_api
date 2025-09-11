import express from "express";

import { isValidEmail, isValidText } from "../utils/validation.js";
import { add, get } from "../data/user.js";
import { createToken, isValidPassword } from "../utils/auth.js";

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  let errors = {};
  const data = req.body;

  if (!isValidEmail(data.email)) {
    errors.email = "Invalid email.";
  } else {
    try {
      const existingUser = await get(data.email);
      if (existingUser) {
        errors.email = "Email already exists.";
      }
    } catch (error) {}
  }

  if (!isValidText(data.password, 6)) {
    errors.password =
      "Invalid password. Password must contain at least 6 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "User signup was unsuccessful due to validation constraints.",
      errors,
    });
  }

  try {
    const createdUser = await add(data);
    const authToken = createToken(createdUser.email);
    res.status(201).json({
      message: "User signup successful.",
      user: createdUser,
      token: authToken,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/signin", async (req, res, next) => {
  let user;
  const email = req.body.email;
  const password = req.body.password;

  try {
    user = await get(email);
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Authentication was unsuccessful." });
  }

  const validatePassword = await isValidPassword(password, user.password);
  if (!validatePassword) {
    return res.status(422).json({
      message: "User signin was unsuccessful due to validation constraints.",
    });
  }

  const token = createToken(email);
  res.json({ token });
});

export default router;
