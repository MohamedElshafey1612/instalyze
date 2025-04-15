import express from "express";
import { MongoClient } from "mongodb";
import { config } from "dotenv";
import cors from "cors";
import multer from "multer";

import loginRoute from "./routes/login.js";
import registerRoute from "./routes/register.js";

config();

const app = express();
const upload = multer();
app.use(express.json());
app.use(cors());

const client = new MongoClient(process.env.MONGO_URI);
let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("userDatabase");
    console.log("MongoDB Connected");

    // Inject DB into requests
    app.use((req, res, next) => {
      req.db = db;
      next();
    });

    // Routes
    app.use("/", loginRoute(upload));
    app.use("/", registerRoute(upload));

    // Optional root route
    app.get("/", (req, res) => {
      res.send("Instalyze API is running");
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
};

connectDB();
