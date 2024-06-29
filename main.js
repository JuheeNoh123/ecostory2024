require('dotenv').config();

const express = require('express');
const app = express();
const port = 8000;
const cron = require('node-cron');
const { spawn } = require('child_process');
const cors = require('cors')

/*
function runPythonScript_2() {
  const pythonProcess = spawn('python3', ['data/database.py']);

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
// 가짜 데이터를 가져오는 함수 (Promise를 반환)
function fetchData() {
  return new Promise((resolve, reject) => {
    // 비동기 작업 시뮬레이션 (setTimeout 사용)
    
    const pythonProcess = spawn('python', ['data/data_mean.py']);

    pythonProcess.stdout.on('data', (data) => {
      //console.log(`파이썬 출력1: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      //console.error(`파이썬 오류: ${data}`);
      resolve(false);
    });

    pythonProcess.on('close', (code) => {
      //console.log(`파이썬 프로세스 종료, 종료 코드: ${code}`);
      if(code == 0) resolve(true);
      else resolve(false);
    });


  });
}

// async 함수를 사용하여 데이터 가져오기
async function fetchDataAsync() {
  try {
    const data = await fetchData(); // fetchData 함수의 Promise를 기다림
    console.log("Data received:", data);

    if(data) runPythonScript_2();
    
    // 여기서 추가적인 작업을 수행할 수 있습니다.
    console.log("Additional processing of data:", data);
    return data;
  } catch (error) {
    console.error("Error occurred:", error);
  }
}





// 초 분 시 일 월 요일(일:0, 토:6)
cron.schedule('10 * * * * *', () => {
  console.log('파이썬 파일 실행');
  fetchDataAsync();
  //runPythonScript_2();
});

*/
app.use(cors({
  origin: true, // 허용할 도메인
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded( {extended : true } ));





var signupRouter = require('./src/signup/register');
var loginRouter = require('./src/signup/login');
var dataRouter = require('./src/ecodata/ecodata');
var gptRouter = require('./src/gpt/callgpt');
var verify = require('./src/signup/verify');
var makeplanRouter = require('./src/guide/makeplan');
var checklistRouter = require('./src/guide/checklist');
var userRouter = require('./src/signup/user');


app.use('/user',verify,signupRouter);
app.use('/user',loginRouter);
app.use('/user', userRouter);
app.use('/', dataRouter);
app.use('/guide', gptRouter);
app.use('/guide',verify, makeplanRouter);

app.use('/checklist', verify,checklistRouter);






app.listen(port,async () => {
  console.log(`Example app listening on port ${port}`);
})
