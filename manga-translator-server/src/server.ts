import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import translateRoutes from "./routes/translate";

console.log("TEST:", process.env.OPENAI_API_KEY);

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/translate", translateRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
