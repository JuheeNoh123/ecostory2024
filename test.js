const { spawn } = require('child_process');


function runPythonScript_2() {
  const pythonProcess = spawn('python', ['data/database.py']);

  pythonProcess.stdout.on('data', (data) => {
    //console.log(`파이썬 출력2: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    //console.error(`파이썬 오류: ${data}`);
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

// fetchDataAsync 함수 호출
fetchDataAsync();