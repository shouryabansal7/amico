const Friendship = require("../../../models/friendship");
const User = require("../../../models/users");

module.exports.index = async function (req, res) {
  try {
    let user = await User.findById(req.user.id);

    user = await user
      .populate({
        path: "friendships",
        populate: {
          path: "to_user",
          select: { name: 1, email: 1, _id: 1 },
        },
      })
      .execPopulate();
    return res.status(200).json({
      message: "Friends List of user!" + req.user.id + " email - " + user.email,
      friends: user.friendships,
    });
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
