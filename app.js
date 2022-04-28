require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const cookieparser = require('cookie-parser');
const apiroutes = require("./routes/api/");
const authroutes = require("./routes/auth/");
const docs = require("./routes/api/docs.route");
const { sequelize } = require("./models");
const passportLocalConfig = require('./passport/localStrategy');
const passportGoogleConfig = require('./passport/googleStrategy');
const cookieParser = require('cookie-parser');
const mySqlStore = require('express-mysql-session')(session);

const app = express();

//enable cors
app.use(cors());
app.options('*',cors());

//parse json request body
app.use(express.json())

//parse unrlencoded json request body
app.use(express.urlencoded({extended:true}));

//cookie activate
app.use(cookieParser(process.env.COOKIE_SECRET));

//mysql session activate
const mySqlOption = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
};

const sessionStore = new mySqlStore(mySqlOption);


app.use(session({
  resave:false,
  saveUninitialized:true,
  secret:process.env.COOKIE_SECRET,
  cookie:{
    httpOnly:true,
    secure:false,
    maxAge: 60 * 60 * 1000,
  },
  store: sessionStore
}));

//DB sync
sequelize.sync({ force: false })
  .then(() => {
    console.log('Successfully connected');
  })
  .catch((err) => {
    console.error(err);
});

//passport init
app.use(passport.initialize());
app.use(passport.session());
passportLocalConfig();
passportGoogleConfig();

//app = require("./config.js")


app.get("/",(req,res) => {
    //res.json({message:"hello"});
    res.sendFile(__dirname + '/login_test.html');
});


app.get("/test",(req,res) => {
  //res.json({message:"hello"});
  res.sendFile(__dirname + '/test.html');
});
//const chatRouter = require('./routes/api/chat');

const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({message: "Auth is required"});
  }
};

app.use('/api',authenticateUser,apiroutes);
app.use('/',authroutes);
//app.use('chat',chatRouter);

app.use('/docs',docs);


app.set('port', process.env.PORT || 3000);

module.exports = app;
//app.use('/docs',swaggerUi.serve,swaggerUi.setup(swaggerDefinition));


