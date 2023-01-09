// const {connectToMoralis} = require("./Prices/Moralis.js")
// const {getCurrentEthPrice} = require("./Prices/priceEth.js")
// const {getCurrentBtcPrice} = require("./Prices/priceWBtc.js")
import express from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { registerValidation } from "./validations.js";
import { loginValidation } from "./validations.js";
import User from "./User.js";
import cors from "cors";

const PORT = 3005;
const app = express();
app.use(express.json());
app.use(cors())

const DB ="mongodb+srv://admin13:admin13@cluster0.nt7f3aa.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(DB)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

// app.get("/api", async (req, res) => {
//   const ethPrice = await getCurrentEthPrice(); 
//   const BtcPrice = await getCurrentBtcPrice(); 
//   res.json({message: [BtcPrice, ethPrice]});
// })

app.get("/", (req, res) => {
  res.send("это мы вернем клиенту");
});

app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new User({
      name: req.body.name,
      occupation: req.body.occupation,
      email: req.body.email,
      password: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      { _id: user._id },
      "secretKey123", 
      { expiresIn: "30d" } 
    );

    res.json({ ...user._doc, token });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

app.post("/auth/login", loginValidation, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.password);
    if (!isValidPass) {
      return res.status(400).json({
        message: "Неверный логин или пароль",
      });
    }

    const token = jwt.sign(
      { _id: user._id }, 
      "secretKey123", 
      {expiresIn: "30d"}
      );

    res.json({ ...user._doc, token });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
});

app.patch("/auth/patch", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
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
      message: "Не удалось обновить персональные данные",
    });
  }
});


app.get('/auth/all', async (req, res) => {
  try {
    const allUsers = await User.find()
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось получить список пользователей',
    });
  }
});

async function startApp() {
    try {
        // await connectToMoralis()
        app.listen(PORT, () => console.log("Server is working on port " + PORT));
    } catch (error) {
        console.log(error);
    }
}

startApp();