const User = require("../../../models/users");

const jwt = require("jsonwebtoken");

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({
      email: req.body.email,
    });

    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid username or password",
      });
    }

    return res.status(200).json({
      message: "Sign in successful, here is your token, keep it safe",
      data: {
        token: jwt.sign(user.toJSON(), "amico", {
          expiresIn: "10000000",
        }),
        data: {
          user: {
            name: user.name,
            email: user.email,
            _id: user._id,
          },
        },
      },
    });
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.status(422).json({
        message: "Passwords entered do not match",
      });
    }
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      user = User.create(req.body);
      return res.status(200).json({
        message: "Sign up successful, here is your user, keep it safe",
        data: {
          user: {
            name: user.name,
            email: user.email,
            _id: user._id,
          },
        },
      });
    } else {
      return res.status(422).json({
        message: "User already exists",
      });
    }
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
