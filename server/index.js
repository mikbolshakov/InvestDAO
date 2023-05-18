import { connectToMoralis } from "./Prices/Moralis.mjs";
import { getCurrentEthPrice } from "./Prices/priceEth.mjs";
import { getCurrentBtcPrice } from "./Prices/priceWBtc.mjs";
import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { registerValidation } from "./validations.js";
import { loginValidation } from "./validations.js";
import User from "./User.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const PORT = 3005;
const app = express();
app.use(express.json());
app.use(cors());

const DB = `mongodb+srv://admin13:${process.env.DB_PASSWORD}@cluster0.nt7f3aa.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(DB)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

app.get("/api", async (req, res) => {
  const ethPrice = await getCurrentEthPrice();
  const BtcPrice = await getCurrentBtcPrice();
  res.json({ message: [BtcPrice, ethPrice] });
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new User({
      name: req.body.name,
      occupation: req.body.occupation,
      email: req.body.email,
    });

    const user = await doc.save();

    const token = jwt.sign({ _id: user._id }, "secretKey123", {
      expiresIn: "1d",
    });

    res.json({ ...user._doc, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to register",
    });
  }
});

app.post("/auth/login", loginValidation, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      console.log("not registered");
      return res.status(404).json({
        message: "User is not found",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secretKey123", {
      expiresIn: "1d",
    });

    res.json({ ...user._doc, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to authorization",
    });
  }
});

app.patch("/auth/patch", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "User is not found",
      });
    }

    await User.updateOne({
      name: req.body.name,
      occupation: req.body.occupation,
    });

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to update personal data",
    });
  }
});

app.get("/auth/all", async (req, res) => {
  try {
    const allUsers = await User.find();
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to get list of users",
    });
  }
});

async function startApp() {
  try {
    await connectToMoralis();
    app.listen(PORT, () => console.log("Server is working on port " + PORT));
  } catch (error) {
    console.log(error);
  }
}

startApp();
