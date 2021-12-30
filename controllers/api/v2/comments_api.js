const Post = require("./../../../models/posts");
const Comment = require("./../../../models/comment");
const Like = require("./../../../models/like");

const jwt = require("jsonwebtoken");

module.exports.list = async function (req, res) {
  try {
    let comments = await Comment.find({ post: req.query.post_id })
      .populate("user")
      .populate("likes");

    return res.status(200).json({
      message: `List of Comments of post_id=${req.query.post_id}`,
      data: {
        comments: comments,
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
    let post = await Post.findById(req.body.post_id);

    if (post) {
      let comment = await Comment.create({
        content: req.body.content,
        post: req.body.post_id,
        user: req.user._id,
      });

      post.comments.push(comment);
      post.save();

      comment = await comment
        .populate({
          path: "user",
          select: { name: 1, email: 1, _id: 1 },
        })
        .execPopulate();

      return res.status(200).json({
        success: true,
        data: {
          comment: comment,
        },
        message: "Comment IS CREATED!",
      });
    }
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    let comment = await Comment.findById(req.query.comment_id);

    if (comment.user === req.user.id) {
      let postId = comment.post;
      comment.remove();

      await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.query.comment_id },
      });

      await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

      return res.status(200).json({
        message: "Comment deleted successfully!!",
      });
    } else {
      return res.status(401).json({
        message: "You cannot delete this comment",
      });
    }
  } catch (err) {
    console.log("****", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
