import express from "express";

import { add, get, getAll, remove, replace } from "../data/event.js";
import {
  isValidDate,
  isValidImageUrl,
  isValidText,
} from "../utils/validation.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const events = await getAll();
    res.json({ events: events });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const event = await get(req.params.id);
    res.json({ event: event });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  let errors = {};
  const data = req.body;

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Event addition was unsuccessful due to validation constraints.",
      errors,
    });
  }

  try {
    await add(data);
    res
      .status(201)
      .json({ message: "Event addition successful.", event: data });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  let errors = {};
  const data = req.body;

  if (!isValidText(data.title)) {
    errors.title = "Invalid title.";
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = "Invalid image.";
  }

  if (!isValidDate(data.date)) {
    errors.date = "Invalid date.";
  }

  if (!isValidText(data.description)) {
    errors.description = "Invalid description.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: "Event update was unsuccessful due to validation constraints.",
      errors,
    });
  }

  try {
    await replace(req.params.id, data);
    res.status(201).json({ message: "Event update successful.", event: data });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await remove(req.params.id);
    res.status(201).json({ message: "Event deletion successful." });
  } catch (error) {
    next(error);
  }
});

export default router;
