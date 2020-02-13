const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const wrapAsync = require("../utils/wrapAsync");
const generateRandomId = require("../utils/generateRandomId");
const { protectRoute } = require("../../middlewares/auth");

const createOneUser = async (req, res, next) => {
  const user = new User(req.body);
  await User.init();
  user.id = generateRandomId();
  const newUser = await user.save();
  res.status(201).send(newUser);
};

const getMyUser = async (req, res, next) => {
  req.userId = "754aece9-64bf-42ab-b91c-bb65e2db3a37";
  const user = await User.findOne({ id: req.userId }, "-__v -_id -password");
  res.send(user);
};
router.post("/register", wrapAsync(createOneUser));
router.get("/", protectRoute, wrapAsync(getMyUser));

module.exports = router;