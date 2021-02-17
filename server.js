const Post = require('./models/post');
const express = require('express')
const app = express()
const port = 3000
const hbs = require('express-handlebars');
const path = require('path')
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');

// Use Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add after body parser initialization!
app.use(expressValidator());

app.engine('hbs', hbs({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'index',
    extname: 'hbs'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// app.get('/', (req, res) => {
//     res.render('main', { layout: 'index' });
// });

app.get("/posts/new", (req, res) => {
    res.render("posts-new.hbs")
})

app.get('/', (req, res) => {
    Post.find({}).lean()
        .then(posts => {
            res.render('posts-index', { posts });
        })
        .catch(err => {
            console.log(err.message);
        })
})


require('./controllers/posts.js')(app);
// Set db
require('./data/reddit-db');

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
module.exports = app;