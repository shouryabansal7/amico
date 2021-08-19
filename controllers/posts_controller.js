const Post = require('../models/posts');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.create = async function(req,res){
    try{
        let post = await Post.create({
            content : req.body.content,
            user : req.user._id
        });

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post:post
                },
                message: "POST IS CREATED!"
            });
        }

        return res.redirect('back');
    }catch(err){
        console.log('error in creating the post');
        return res.redirect('back');
    }
}

module.exports.destroy =  async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        
        if(post.user==req.user.id){

            //delete all the associated likes of post and comment
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            await Like.deleteMany({_id: {$in: post.comments}});
            
            post.remove();

            await Comment.deleteMany({post:req.params.id});

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "POST IS DELETED!"
                });
            }

            return res.redirect('back');
        }else{
            console.log('post cannot be delted by you');
            return res.redirect('back');
        }
    }catch(err){
        return res.redirect('back');
    }
    //without async await
    /*//before deleting a post, find whether the post exist or not
    Post.findById(req.params.id,function(err,post){
        //if the user authorised to delete the post
        //.id means converting the object id to string
        if(post.user==req.user.id){
            post.remove();
            Comment.deleteMany({post:req.params.id},function(err){
                return res.redirect('back');
            });
        }else{
            return res.redirect('back');
        }
    });*/
}