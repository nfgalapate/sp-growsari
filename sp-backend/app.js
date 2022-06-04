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

module.exports = app;