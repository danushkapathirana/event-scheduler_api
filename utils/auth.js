import { sign, verify } from "jsonwebtoken";
import { compare } from "bcryptjs";

import { NotAuthError } from "./error.js";

const KEY = "GciOiJIUzI";

export const createToken = (email) => {
  return sign({ email }, KEY, { expiresIn: "1h" });
};

export const validateToken = (token) => {
  return verify(token, KEY);
};

export const isValidPassword = (password, storedPassword) => {
  return compare(password, storedPassword);
};

export const checkAuthMiddleware = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  if (!req.headers.authorization) {
    return next(new NotAuthError("Not authenticated."));
  }

  const authFragments = req.headers.authorization.split(" ");
  if (authFragments.length !== 2) {
    return next(new NotAuthError("Not authenticated."));
  }

  const authToken = authFragments[1];
  try {
    const validatedToken = validateToken(authToken);
    req.token = validatedToken;
  } catch (error) {
    return next(new NotAuthError("Not authenticated."));
  }
  next();
};
