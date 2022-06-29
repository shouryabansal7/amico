const Post = require("../models/posts");
const User = require("../models/users");

module.exports.home = async function (req, res) {
  // to display posts
  /*Post.find({},function(err,posts){
            return res.render('home',{
            title: 'Amico | Home',
            posts: posts
        });
    });*/

  /* return res.render('home',{
        title: 'Home'
    });*/

  //to display posts along wiht the user's name who made the post
  /*Post.find({}).populate('user').exec(function(err,posts){
            return res.render('home',{
            title: 'Amico | Home',
            posts: posts
        });
    });*/

  //to display posts and comments
  try {
    //for post
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

    let users = await User.find({});
    console.log(posts[0].comments);

    return res.render("home", {
      title: "Amico | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
