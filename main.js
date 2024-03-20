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
//var indexRouter = require('./index/index');
var gptRouter = require('./src/gpt/callgpt');


app.use('/user',signupRouter);
app.use('/user',loginRouter);
app.use('/', dataRouter);
app.use('/guide', gptRouter);

//app.use('/',indexRouter);

app.listen(port,async () => {
  console.log(`Example app listening on port ${port}`);
})