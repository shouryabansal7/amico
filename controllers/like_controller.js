const Like = require("../models/like");
const Comment = require('../models/comment');
const Post = require('../models/posts');

module.exports.toggleLike = async function(req,res){
    try{
        //likes/toggle/?id=abcef&type=Post
        let likeable;
        let deleted = false;
        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exist 
        let existingLike = await Like.findOne({
            likeable : req.query.id,
            onModel : req.query.type,
            user: req.user._id
        });

        //if a like already exists then delete it
        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            //else make a new like
            let newLike  = await Like.create({
                user: req.user._id,
                onModel: req.query.type,
                likeable: req.query.id,
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.json(200,{
            message: "Request successful",
            data:{
                deleted: deleted
            }
        });
        
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}