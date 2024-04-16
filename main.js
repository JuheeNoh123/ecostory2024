const express = require('express');
const app = express();
const port = 3000;
const cron = require('node-cron');
const { spawn } = require('child_process');

function runPythonScript() {
  const pythonProcess = spawn('python', ['data/data_mean.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`파이썬 출력1: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`파이썬 오류: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`파이썬 프로세스 종료, 종료 코드: ${code}`);
  });
}


function runPythonScript_2() {
  const pythonProcess = spawn('python', ['data/database.py']);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`파이썬 출력2: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`파이썬 오류: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`파이썬 프로세스 종료, 종료 코드: ${code}`);
  });
}

// cron.schedule('10 * * * * *', () => {
//   console.log('파이썬 파일 실행');
//   runPythonScript();
//   //runPythonScript_2();
// });

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