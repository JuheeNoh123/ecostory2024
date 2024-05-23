// const { spawn } = require('child_process');


// function runPythonScript_2() {
//   const pythonProcess = spawn('python', ['data/database.py']);

//   pythonProcess.stdout.on('data', (data) => {
//     //console.log(`파이썬 출력2: ${data}`);
//   });

//   pythonProcess.stderr.on('data', (data) => {
//     //console.error(`파이썬 오류: ${data}`);
//   });

//   pythonProcess.on('close', (code) => {
//     console.log(`파이썬 프로세스 종료, 종료 코드: ${code}`);

//   });
// }




// // 가짜 데이터를 가져오는 함수 (Promise를 반환)
// function fetchData() {
//   return new Promise((resolve, reject) => {
//     // 비동기 작업 시뮬레이션 (setTimeout 사용)

//       const pythonProcess = spawn('python', ['data/data_mean.py']);

//       pythonProcess.stdout.on('data', (data) => {
//         //console.log(`파이썬 출력1: ${data}`);
//       });

//       pythonProcess.stderr.on('data', (data) => {
//         //console.error(`파이썬 오류: ${data}`);
//         resolve(false);
//       });

//       pythonProcess.on('close', (code) => {
//         //console.log(`파이썬 프로세스 종료, 종료 코드: ${code}`);
//         if(code == 0) resolve(true);
//         else resolve(false);
//       });

//   });
// }

// // async 함수를 사용하여 데이터 가져오기
// async function fetchDataAsync() {
//   try {
//     const data = await fetchData(); // fetchData 함수의 Promise를 기다림
//     console.log("Data received:", data);

//     if(data) runPythonScript_2();
    
//     // 여기서 추가적인 작업을 수행할 수 있습니다.
//     console.log("Additional processing of data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error occurred:", error);
//   }
// }

// // fetchDataAsync 함수 호출
// fetchDataAsync();


const ans = [
  {
    WeekNumber: 1,
    WeekListID1: 427,
    WeekListID2: 429,
    WeekListID3: 568,
    WeekListID4: 514,
    WeekListID5: 520,
    guide_NM1: '환경 단체 가입하여 활동하기',
    guide_NM2: '지구를 위한 행동 결심하기',
    guide_NM3: '일상 생활에서 필요한 생활용품을 대신하는 다양한 방법 찾아보기',
    guide_NM4: '지구를 위해 노력하기',
    guide_NM5: '쓰레기통 이용하기'
  },
  {
    WeekNumber: 2,
    WeekListID1: 551,
    WeekListID2: 559,
    WeekListID3: 472,
    WeekListID4: 569,
    WeekListID5: 574,
    guide_NM1: '재활용 가능한 제품 구입하기',
    guide_NM2: '선제적으로 구입하고 먹거나 연식 것 대신 버리지 않기',
    guide_NM3: '네모지기를 줄이는 것이 환경에 좋음',
    guide_NM4: '일회용품 대신 수세미나 청소포 등 재사용 가능한 청소도구 사용하기',
    guide_NM5: '사용하지 않는 생활용품은 기부하기'
  },
  {
    WeekNumber: 3,
    WeekListID1: 467,
    WeekListID2: 608,
    WeekListID3: 448,
    WeekListID4: 449,
    WeekListID5: 571,
    guide_NM1: '지역 환경보호 단체에 봉사하기',
    guide_NM2: '화장지 대신 천기포로 물빨래하기',
    guide_NM3: '일회용품 대신 재사용 가능한 용기 사용하기',
    guide_NM4: '자전거를 타기',
    guide_NM5: '생활용품을 필요한 만큼만 구입하기'
  },
  {
    WeekNumber: 4,
    WeekListID1: 447,
    WeekListID2: 612,
    WeekListID3: 523,
    WeekListID4: 465,
    WeekListID5: 477,
    guide_NM1: '대중교통을 이용하기',
    guide_NM2: '일회용 스펀지 대신 천 스펀지 사용하기',
    guide_NM3: '친환경 농산물 구입하기',
    guide_NM4: '지역 및 봉사 활동에 참여하기',
    guide_NM5: '자체적으로 컴퓨터 등 전자제품을 수리하고 재활용하기'
  },
  {
    WeekNumber: 5,
    WeekListID1: 447,
    WeekListID2: 512,
    WeekListID3: 427,
    WeekListID4: 603,
    WeekListID5: 572,
    guide_NM1: '대중교통을 이용하기',
    guide_NM2: '친환경 기부하기',
    guide_NM3: '환경 단체 가입하여 활동하기',
    guide_NM4: '자연 유래 성분에서 만든 볼품 사용하기',
    guide_NM5: '할인 행사용으로 구매한 제품 대신 필요한 제품 구입하기'
  }
]

console.log(ans[0].WeekNumber)