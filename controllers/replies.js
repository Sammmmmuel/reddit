const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require("../models/user");

module.exports = app => {
    // NEW REPLY
    app.get("/posts/:postId/comments/:commentId/replies/new", (req, res) => {
        const currentUser = req.user;
        let post;
        Post.findById(req.params.postId).lean()
            .then(p => {
                post = p;
                return Comment.findById(req.params.commentId).lean();
            })
            .then(comment => {
                res.render("replies-new", { post, comment, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });

    // CREATE REPLY
    app.post("/posts/:postId/comments/:commentId/replies", (req, res) => {
        console.log(req.body);
    });
};