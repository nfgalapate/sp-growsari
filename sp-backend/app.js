require("dotenv").config();
require("./config/database").connect();

const express = require("express");
const app = express();
const auth = require("./middleware/auth");
var router = express.Router();

app.use(express.json());


//importing router for users
var register = require('./routes/register');
app.use('/register', register);

var welcome = require('./routes/welcome');
app.use('/welcome', welcome);

var login = require('./routes/login');
app.use('/login', login);

var subjects = require('./routes/subjects');
app.use('/subjects', subjects);

var user = require('./routes/user');
app.use('/user', user);

var notes = require('./routes/notes');
app.use('/notes', notes);

var activities = require('./routes/activities');
app.use('/activities', activities);



module.exports = app;