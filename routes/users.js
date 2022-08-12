const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        // status code 500 (internal server error)
        res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("account updated successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    // status code 403 (the server understands the request but refuses to authorize it)
    res.status(403).json("you only update your account");
  }
});

module.exports = router;
