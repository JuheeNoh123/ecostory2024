const guide_model = require('./src/gpt/models/guide_model');
add_data = [ "친환경 단체에 가입하여 활동하기", 
"지역 및 봉사 활동에 참여하기", 
"동물 보호 시설에서 봉사하기", 
"친환경 운동에 동참하기", 
"친환경 교육과 캠페인 활동에 참여하기", 
"지역 커뮤니티 활동에 참여하기", 
"환경을 주제로 한 문화 활동에 참여하기", 
"친환경 제품을 지원하는 기부하기", 
"친환경 활동을 홍보하기", 
"지구를 위해 무엇이든 할 것을 결심하기" ];

guide_Id_list= [
    [ { guide_Id: 222 } ],
    [ '`guide_Id` INT NOT NULL PRIMARY KEY AUTO_INCREMENT ']
  ];

  
// async function test(){
//     var data = [];
//     for(let i=0;i<add_data.length;i++){
//         //let guide = new guide_model();
//         //let guide_Id_list =guide.findwithguide_NM(add_data[i]);
//         let guide_Id = guide_Id_list[0][0].guide_Id;    //222
//         //console.log("guide_Id : ",guide_Id);
//         //data.$[{guide_Id}] = add_data[i];   //add_data[i] : '지구를 위해 무엇이든 할 것을 결심하기' 
//         var jsonObject = {
//             'guide_Id': guide_Id,
//             'guide_NM': add_data[i]
//         }

//         data.push(jsonObject);
        
//     }

//     console.log("data : ",data);
// }

// test();
array = [
    { guide_NM: '대중교통 이용' },
    { guide_NM: '자전거 나 걷기' },
    { guide_NM: '전기 자동차 구매 고려' },
    { guide_NM: '친환경 제품 구매' },
    { guide_NM: '부동산 재활용 제품 구매' },
    { guide_NM: '지구 친화적 제품 선호' },
    { guide_NM: '지구 친화적 옷차림' },
    { guide_NM: '중고 제품 구매' },
    { guide_NM: '유기농 제품 선호' },
    { guide_NM: '가공 식품 줄이기' },
    { guide_NM: '비건 식단 고려' },
    { guide_NM: '지역 시장 이용' },
    { guide_NM: '올바른 제품 포장' },
    { guide_NM: '친환경 차량 구입하기' },
    { guide_NM: '부동산 재활용 제품 구매' },
    { guide_NM: '친환경 제품 구매' },
    { guide_NM: '장거리 여행시 대중교통을 선호하기' },
    { guide_NM: '친환경 제품 구매' },
    { guide_NM: '친환경 차량 구입하기' },
    { guide_NM: '유기농 제품 선호' },
    { guide_NM: '필요한 만큼만 구매' },
    { guide_NM: '식재료를 재활용하여 음식을 만들기' },
    { guide_NM: '식사 계획 세우기' },
    { guide_NM: '육류 소비를 줄이고 채소 중심 식습관을 가지기' },
    { guide_NM: '자가용 대신 대중교통을 이용하거나 동승하고 서로 간 배려하기' }
  ];

for (let index = array.length - 1; index > 0; index--) {
    // 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
    const randomPosition = Math.floor(Math.random() * (index + 1));

    // 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
    const temporary = array[index];
    array[index] = array[randomPosition];
    array[randomPosition] = temporary;
}

console.log(array);
