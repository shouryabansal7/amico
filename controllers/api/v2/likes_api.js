const Like = require("./../../../models/like");
const Comment = require("./../../../models/comment");
const Post = require("./../../../models/posts");

module.exports.index = async function (req, res) {
  try {
    let likes = await Like.find({
      likeable: req.query.likeable_id,
      onModel: req.query.likeable_type,
    }).populate({
      path: "user",
      select: { name: 1, email: 1, _id: 1 },
    });

    return res.status(200).json({
      message: `List of likes on ${req.query.likeable_id} :: ${req.query.likeable_type}`,
      data: likes,
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};

module.exports.toggle = async function (req, res) {
  try {
    let likeable;
    let deleted = false;
    if (req.query.likeable_type == "Post") {
      likeable = await Post.findById(req.query.likeable_id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.likeable_id).populate(
        "likes"
      );
    }

    let existingLike = await Like.findOne({
      likeable: req.query.likeable_id,
      onModel: req.query.likeable_type,
      user: req.user._id,
    });

    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    } else {
      //else make a new like
      let newLike = await Like.create({
        user: req.user._id,
        onModel: req.query.likeable_type,
        likeable: req.query.likeable_id,
      });

      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.status(200).json({
      message: "Request successful",
      data: {
        deleted: deleted,
      },
    });
  } catch (err) {
    console.log(err);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
};
