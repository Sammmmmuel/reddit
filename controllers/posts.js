const User = require('../models/user');
const Post = require('../models/post');


module.exports = (app) => {
    app.get("/posts/", (req, res) => {
        Post.find({})
            .lean()
            .then((posts) => {
                res.render("posts-index", { posts })
            })
            .catch((error) => {
                console.log(error.message)
            })
    })
    app.get("/posts/new", (req, res) => {
        res.render("posts-new")
    })

    app.post('/posts/new', (req, res) => {
        const currentUser = req.user;
        if (req.user) {
            const user = req.user
            const post = new Post(req.body);
            post.author = req.user._id;
            post.upVotes = [];
            post.downVotes = [];
            post.voteScore = 0;
            post
                .save()
                .then(post => {
                    return User.findById(req.user._id);
                })
                .then(user => {
                    user.posts.unshift(post);
                    user.save();
                    res.redirect('/posts/');
                })
                .catch(err => {
                    console.log(err.message);
                });

            // } else {
            //     return res.status(401);
        }
    });


    // SHOW
    app.get("/posts/:id", function(req, res) {
        const currentUser = req.user;
        Post.findById(req.params.id).populate('comments').lean()
            .then(post => {
                res.render("posts-show", { post, currentUser });
            })
            .catch(err => {
                console.log(err.message);
            });
    });
    // SUBREDDIT
    app.get("/n/:subreddit", function(req, res) {
        const currentUser = req.user;
        Post.find({ subreddit: req.params.subreddit }).lean()
            .then(posts => {
                res.render("posts-index", { posts, currentUser });
            })
            .catch(err => {
                console.log(err);
            });
    });

    app.get('/', (req, res) => {
        const currentUser = req.user;
        // res.render('home', {});
        console.log(req.cookies);
        Post.find({}).lean().populate('author')
            .then(posts => {
                res.render('posts-index', { posts, currentUser });
                // res.render('home', {});
            }).catch(err => {
                console.log(err.message);
            })
    })
    app.put("/posts/:id/vote-up", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
            post.upVotes.push(req.user._id);
            post.voteScore = post.voteScore + 1;
            post.save();

            res.status(200);
        });
    });

    app.put("/posts/:id/vote-down", function(req, res) {
        Post.findById(req.params.id).exec(function(err, post) {
            post.downVotes.push(req.user._id);
            post.voteScore = post.voteScore - 1;
            post.save();

            res.status(200);
        });
    });
};