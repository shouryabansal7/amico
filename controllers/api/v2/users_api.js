const User = require("../../../models/users");

const jwt = require("jsonwebtoken");

module.exports.edit = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      return res.status(422).json({
        message: "Passwords entered do not match",
      });
    }
    let user = await User.findById(req.body.id);
    user.name = req.body.name;
    user.password = req.body.password;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "User Updated!!",
      data: {
        token: jwt.sign(user.toJSON(), "amico", {
          expiresIn: "10000000",
        }),
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
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

module.exports.profile = async function (req, res) {
  try {
    let user = await User.findById(req.params.id);

    if (user) {
      return res.status(200).json({
        message: "Found the User",
        success: true,
        data: {
          user: {
            _id: user.id,
            name: user.name,
            email: user.email,
          },
        },
      });
    }
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

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
      success: true,
      data: {
        user: {
          name: user.name,
          email: user.email,
          _id: user._id,
        },
        token: jwt.sign(user.toJSON(), "amico", {
          expiresIn: "10000000",
        }),
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
        success: true,
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
