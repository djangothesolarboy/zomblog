const express = require('express'),
    cors = require('cors'),
    mongoose = require('mongoose'),
    postRouter = require('./routes/posts'),
    methodOverride = require('method-override'),
    bodyParser = require('body-parser'),
    { auth } = require('express-openid-connect'),
    Surreal = require('surrealdb.js'),
    Post = require('./models/post');

let corsOptions = {
    origin: "https://localhost:5000"
};

let app = express();
require('dotenv').config();

app.use(
  auth({
    authRequired: false,
    auth0Logout: true,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    secret: process.env.SECRET,
    idpLogout: true,
  })
);

// mongoose.connect(process.env.DB_URI);
// const db = mongoose.connection;

// db.on('error', (error) => console.log(error));
// db.once('connected', () => console.log('database connected.'));

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use('/posts', postRouter);

async function db() {
  try {
    await Surreal.Instance.connect('http://localhost:8000/rpc'); // connect to db
    await Surreal.Instance.use('zomblog', 'zomblog'); // select namespace & database
    let person = await Surreal.Instance.create('person');

    await Surreal.Instance.select('person');
  } catch(e) {
    console.error('error', e);
  }
}

app.get('/', async (req, res) => {
  await db();
  
  // const posts = await Post.find().sort({ createdOn: 'desc' });
  console.log('yeet?');
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  // res.render('posts/index', { posts: posts });
});

app.listen(process.env.DB_PORT);

module.exports = app;