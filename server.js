require('dotenv').config();
const Post = require('./models/post');
const express = require('express')
const app = express()
const port = 3000
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.engine('hbs', hbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'index',
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


const checkAuth = (req, res, next) => {
    if (
        typeof req.cookies.nToken === "undefined" ||
        req.cookies.nToken === null
    ) {
        req.user = null
    } else {
        const token = req.cookies.nToken
        const decodedToken = jwt.decode(token, { complete: true }) || {}
        req.user = decodedToken.payload
    }
    res.locals.currentUser = req.user

    next();
};

app.use(checkAuth);
app.get("/posts/new", (req, res) => {
    res.render("posts-new")
})

// INDEX
app.get('/', (req, res) => {
    var currentUser = req.user;
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
require('./controllers/posts.js')(app);
require('./data/reddit-db');
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;