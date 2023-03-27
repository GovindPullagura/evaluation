const express = require("express");
const { UserModel } = require("../models/user.model");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password, age, city, is_married } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      res.status(400).send({ msg: "User already exist, please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        const addUser = new UserModel({
          name,
          email,
          gender,
          password: hash,
          age,
          city,
          is_married,
        });
        await addUser.save();
        res.send({ msg: "New user has been added." });
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    bcrypt.compare(password, user.password, async (err, result) => {
      if (user) {
        const token = jwt.sign({ userID: user._id }, "eval");
        res.send({ msg: "Login Success", token });
      } else {
        res.status(400).send({ msg: "Login Failed" });
      }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = { userRouter };
