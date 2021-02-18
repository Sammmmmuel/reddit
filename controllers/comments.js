const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports = (app) => {
    app.post("/posts/:postId/comments", function(req, res) {
        const comment = new Comment(req.body)
        comment.author = req.user._id
        comment
            .save()
            .then(() => {
                return Promise.all([Post.findById(req.params.postId)])
            })
            .then(([post]) => {
                post.comments.unshift(comment)
                return Promise.all([post.save()])
            })
            .then(() => {
                return res.redirect(`/posts/${req.params.postId}`)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}