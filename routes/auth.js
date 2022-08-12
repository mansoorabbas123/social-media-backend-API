const router = require("express").Router();
const { request } = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { user_name, email, password } = req.body;

  try {
    //   create salt
    const salt = await bcrypt.genSalt(10);
    // hash password with salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      user_name,
      email,
      password: hashedPassword,
    });

    // create new user
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //   find user in db
    const user = await User.findOne({ email });
    !user && res.status(404).json("user not found");
    console.log("=========================================================");

    //   validate user password
    const validPassword = await bcrypt.compare(password, user.password);
    !validPassword && res.status(400).json("wrong password");

    res.status(200).json(user);
  } catch (error) {
    // throw new Error(error);
    res.status(500).json({ error });
  }
});

module.exports = router;
