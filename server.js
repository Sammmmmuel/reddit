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
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressValidator());
app.engine('hbs', hbs({
    layoutsDir: __dirname + '/views/layouts',
    // partialsDir: path.join(__dirname, 'views/partials'),
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

require('./controllers/posts.js')(app);
require('./data/reddit-db');
require('./controllers/comments.js')(app);
require('./controllers/auth.js')(app);
require('./controllers/replies.js')(app);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;