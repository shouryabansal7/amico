const Post = require('../models/posts');
const Comment = require('../models/comment');

module.exports.create = async function(req,res){
    try{
        await Post.create({
            content : req.body.content,
            user : req.user._id
        });

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
            post.remove();

            await Comment.deleteMany({post:req.params.id});

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