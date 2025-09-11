import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";

import eventRoutes from "./routes/event.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(cors());
app.use(authRoutes);
app.use("/events", eventRoutes);
app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message || "Something went wrong.";
  res.status(status).json({ message: message });
});

const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(`server started on http://localhost:${port}`);
});
