import express from "express";
import bcrypt from "bcrypt";

export default function (upload) {
  const router = express.Router();

  router.post("/login", upload.none(), async (req, res) => {
    const db = req.db;
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid Email or Password" });

    res.json({ message: "Login successful" });
  });

  return router;
}
