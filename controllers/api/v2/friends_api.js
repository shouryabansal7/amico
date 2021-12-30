const Friendship = require("../../../models/friendship");
const User = require("../../../models/users");

module.exports.index = async function (req, res) {
  try {
    let friendships = await Friendship.find({
      from_user: req.user.id,
    }).populate("to_user");
    return res.status(200).json({
      message: "Friends List of user!" + req.user.id,
      friends: friendships,
    });
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.remove = async function (req, res) {
  try {
    let user1 = await User.findById(req.query.user_id);
    let user2 = await User.findById(req.user._id);

    //checking whether friendship already exists or not
    let existingFriendship1 = await Friendship.findOne({
      from_user: user1.id,
      to_user: user2.id,
    });

    let existingFriendship2 = await Friendship.findOne({
      from_user: user2.id,
      to_user: user1.id,
    });
    user1.friendships.pull(existingFriendship1._id);
    user1.save();
    existingFriendship1.remove();
    user2.friendships.pull(existingFriendship2._id);
    user2.save();
    existingFriendship2.remove();
    return res.status(200).json({
      message: "friendship removed",
      success: true,
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
    let user1 = await User.findById(req.query.user_id);
    let user2 = await User.findById(req.user._id);

    let newFriendship1 = await Friendship.create({
      from_user: user2.id,
      to_user: user1.id,
    });

    let newFriendship2 = await Friendship.create({
      from_user: user1.id,
      to_user: user2.id,
    });

    user1.friendships.push(newFriendship2._id);
    user1.save();
    user2.friendships.push(newFriendship1._id);
    user2.save();

    return res.status(200).json({
      success: true,
      message: `Now you are friends with ${user1.name}`,
      data: {
        friendship: {
          to_user: {
            name: user1.name,
            id: user1.id,
            email: user1.email,
          },
          from_user: {
            name: user2.name,
            id: user2.id,
            email: user2.email,
          },
        },
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
