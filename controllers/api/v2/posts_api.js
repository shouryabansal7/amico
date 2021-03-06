const Post = require("../../../models/posts");
const Comment = require("../../../models/comment");
const Like = require("../../../models/like");

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort("-createdAt")
    .populate({
      path: "user",
      select: { name: 1, email: 1, _id: 1 },
    })
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
    success: true,
    message: "Lists of posts",
    data: {
      posts: posts,
    },
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    if (post.user == req.user.id) {
      //delete all the associated likes of post and comment
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });

      post.remove();

      await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
        message: "POST IS DELETED!",
      });
    } else {
      return res.status(401).json({
        message: "You cannot delete this post",
      });
    }
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.create = async function (req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id,
    });
    post = await post
      .populate({
        path: "user",
        select: { name: 1, email: 1, _id: 1 },
      })
      .execPopulate();
    return res.status(200).json({
      success: true,
      data: {
        post: post,
      },
      message: "POST IS CREATED!",
    });
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
