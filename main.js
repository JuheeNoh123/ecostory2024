const express = require('express');
const app = express();
const port = 3000;
//var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(express.urlencoded( {extended : true } ));
//app.use(cookieParser());
//var health = require('./health/model');

var signupRouter = require('./src/signup/register');
var loginRouter = require('./src/signup/login');
var dataRouter = require('./src/ecodata/ecodata');
var gptRouter = require('./src/gpt/callgpt');
//var verify = require('./src/signup/verify');
var makeplanRouter = require('./src/guide/makeplan');

//app.use(verify);
app.use('/user',signupRouter);
app.use('/user',loginRouter);
app.use('/', dataRouter);
app.use('/guide', gptRouter);
app.use('/guide', makeplanRouter);

//app.use('/',indexRouter);

app.listen(port,async () => {
  console.log(`Example app listening on port ${port}`);
})