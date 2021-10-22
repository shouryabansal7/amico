const Post = require("../../../models/posts");
const Comment = require("../../../models/comment");
const Like = require("../../../models/like");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate("user")
    .populate({
      //for comment
      path: "comments",
      populate: {
        path: "user",
      },
      populate: {
        path: "likes",
      },
    })
    .populate("likes");

  return res.status(200).json({
    message: "Lists of posts",
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    //delete all the associated likes of post and comment
    await Like.deleteMany({ likeable: post, onModel: "Post" });
    await Like.deleteMany({ _id: { $in: post.comments } });

    post.remove();

    await Comment.deleteMany({ post: req.params.id });
    return res.status(200).json({
      message: "POST IS DELETED!",
    });
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
