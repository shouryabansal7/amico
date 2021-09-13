const User = require('../models/users');
const Friendship = require('../models/friendship');

module.exports.Friends = async function(req, res){
    try{
        console.log("req.params.id-",req.params.id);
        console.log("req.user._id-",req.user._id);
        let user1 = await User.findById(req.params.id);
        let user2 = await User.findById(req.user._id);
        let already = false;

        //checking whether friendship already exists or not
        let existingFriendship1 = await Friendship.findOne({
            from_user : user1.id,
            to_user  : user2.id
        });
        
        let existingFriendship2 = await Friendship.findOne({
            from_user : user2.id,
            to_user  : user1.id
        });

        console.log("existing friendship1-",existingFriendship1);
        console.log("existing friendship2-",existingFriendship2);
        if(existingFriendship1 || existingFriendship2){
            //if yes then remove friendship
            console.log('inside if');
            user1.friendships.pull(existingFriendship1._id);
            user1.save();
            user1.friendships.pull(existingFriendship2._id);
            user1.save();
            user2.friendships.pull(existingFriendship1._id);
            user2.save();
            user2.friendships.pull(existingFriendship2._id);
            user1.save();
            existingFriendship1.remove();
            existingFriendship2.remove();
            already = true;
            req.flash('success','User Unfriended');
        }else{
            //if no then create friendship
            console.log("inside else");
            let newFriendship1 = await Friendship.create({
                from_user : user2.id,
                to_user  : user1.id
            });

            let newFriendship2 = await Friendship.create({
                from_user : user1.id,
                to_user  : user2.id
            });
            console.log('new freindship1- ',newFriendship1);
            console.log('new freindship2- ',newFriendship2);

            user1.friendships.push(newFriendship1._id);
            user1.save();
            user1.friendships.push(newFriendship2._id);
            user1.save();
            user2.friendships.push(newFriendship1._id);
            user2.save();
            user2.friendships.push(newFriendship2._id);
            user2.save();
            req.flash('success','User Friended');
        }

        console.log('friendship created');
        return res.redirect('back');
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}