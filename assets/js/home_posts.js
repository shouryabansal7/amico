{
  //method to submit new form data using AJAX
  let createPost = function () {
    let newPostForm = $("#new-post-form");

    newPostForm.submit(function (e) {
      e.preventDefault();

      $.ajax({
        type: "post",
        url: "/posts/create",
        //to serialize the data enterred in the form and convert it into json format
        data: newPostForm.serialize(),
        success: function (data) {
          let newPost = createNewPostDom(data.data.post);
          //append to the list
          $("#posts-list-container>ul").prepend(newPost);
          deletePost($(" .delete-post-button", newPost));
          //add the  function of the toggle like to all the new posts
          new ToggleLike($(" .toggle-like-button", newPost));
          new PostComments(data.data.post._id);

          new Noty({
            theme: "relax",
            text: "Post published!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  //method to create a post in DOM
  let createNewPostDom = function (post) {
    return $(`<li id="post-${post._id}">
                    <p class="del">
                        
                        <small>
                            <a class="delete-post-button" href="/posts/destroy/${post._id}"><i class="fa-solid fa-circle-minus fa-xl"></i></a>
                        </small>
                    </p>
                    <P class="content">
                        ${post.content}
                        <br>
                        <small class="name">
                            ${post.user.name}
                        </small>
                        <br>
                        <small class="likes">
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                0 Likes
                            </a>
                        </small>
                    </P>
                    <div class="post-comment">
                    <form id="post-${post._id}-comments-form" action="/comments/create" method="POST" class="com">
                        <input type="text" name="content" placeholder="Type Comment Here..." class="write" required>                            
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Add Comment" class="sub-com">
                    </form>
                    </div>
                    <div class="post-comment-list">
                        <ul id="post-comment-${post._id}" class="post-comment-list-ul">
                        </ul>
                    </div>
                </li>`);
  };

  //method to delete a post from DOM
  let deletePost = function (deletelink) {
    $(deletelink).click(function (e) {
      e.preventDefault();

      $.ajax({
        type: "get",
        url: $(deletelink).prop("href"),
        success: function (data) {
          $(`#post-${data.data.post_id}`).remove();
          new Noty({
            theme: "relax",
            text: "Post Deleted",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
        },
      });
    });
  };

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function () {
    $("#posts-list-container>ul>li").each(function () {
      let self = $(this);
      let deleteButton = $(" .delete-post-button", self);
      deletePost(deleteButton);

      // get the post's id by splitting the id attribute
      let postId = self.prop("id").split("-")[1];
      new PostComments(postId);
    });
  };

  createPost();
  convertPostsToAjax();
}
