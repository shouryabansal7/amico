const Comment = require('../models/comment');
const Like = require('../models/like');
const Post = require('../models/posts');

module.exports.create = async function(req,res){
    try{
        let post = await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                    content : req.body.content,
                    post : req.body.post,
                    user : req.user._id
            });

            post.comments.push(comment);
            post.save();
            return res.redirect('/');
        }
    }catch(err){
        console.log('error in creating a comment');
        return res.redirect('/');
    }
}

module.exports.destroy =  async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();
            await Post.findByIdAndUpdate(postId,{$pull : {comments : req.params.id }});

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});
                    
            return res.redirect('back');

        }else{
            return res.redirect('back');
        }
    }catch(err){
        console.log(err);
        return;
    }
}