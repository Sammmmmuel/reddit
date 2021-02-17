const User = require('../models/user');
const Post = require('../models/post');

module.exports = (app) => {
    // Create
    app.get("/posts/new", (req, res) => {
        res.render("posts-new")
    })

    app.post('/posts/new', (req, res) => {
        // INSTANTIATE INSTANCE OF POST MODEL
        const currentUser = req.user
        const post = new Post(req.body);

        // SAVE INSTANCE OF POST MODEL TO DB
        post.save((err, post) => {
            // REDIRECT TO THE ROOT
            return res.redirect(`/`);
        })
    });

    app.get("/posts/:id", (req, res) => {
        const currentUser = req.user

        Post.findById(req.params.id)
            .lean()
            .then((post) => {
                res.render("posts-show", { post, currentUser })
            })
            .catch((error) => {
                console.log(error.message)
            })
    })

    // Subreddit
    app.get("/n/:subreddit", (req, res) => {
        const currentUser = req.user

        Post.find({ subreddit: req.params.subreddit })
            .lean()
            .then((posts) => {
                res.render("posts-index", { posts, currentUser })
            })
            .catch((error) => {
                console.log(error.message)
            })
    })
    app.get("/", (req, res) => {
        const currentUser = req.user;

        Post.find({})
            .then(posts => {
                res.render("posts-index", { posts, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });
};