import express from "express";
import { hash } from "bcryptjs";

export default function (upload) {
  const router = express.Router();

  router.post("/register", upload.none(), async (req, res) => {
    const db = req.db;
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await db.collection("users").findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hash(password, 10);
    await db
      .collection("users")
      .insertOne({ fullName, email, phone, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  });

  return router;
}
