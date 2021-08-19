{
    //method to submit new form data using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                //to serialize the data enterred in the form and convert it into json format
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = createNewPostDom(data.data.post);
                    //append to the list
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button',newPost));
                    //add th function of the toggle like to all the new posts
                    new ToggleLike($(' .toggle-like-button',newPost));
                },error: function(error) {
                    console.log(error.responseText);
                }
            });
        });
    }

    //method to create a post in DOM
    let createNewPostDom = function(post){
        return $(`<li id="post-${ post._id }">
                    <p>
                        
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${ post._id }">X</a>
                        </small>
                    </p>
                    <P>
                        ${ post.content }
                        <br>
                        <small>
                            ${ post.user.name }
                        </small>
                        <br>
                        <small>
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ post._id }&type=Post">
                                0 Likes
                            </a>
                        </small>
                    </P>
                    <div class="post-comment">
                    <form action="/comments/create" method="POST">
                        <input type="text" name="content" placeholder="Type Comment Here..." required>                            
                        <input type="hidden" name="post" value="${ post._id }">
                        <input type="submit" value="Add Comment">
                    </form>
                    </div>
                    <div class="post-comment-list">
                        <ul class="post-comment-${ post._id }">
                        </ul>
                    </div>
                </li>`);
    }

    //method to delete a post from DOM
    let deletePost = function(deletelink){
        $(deletelink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deletelink).prop('href'),
                success: function(data){
                    $(`post-${ data.data.post_id }`).remove();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    createPost();
}