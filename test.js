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

  
async function test(){
    var data = [];
    for(let i=0;i<add_data.length;i++){
        //let guide = new guide_model();
        //let guide_Id_list =guide.findwithguide_NM(add_data[i]);
        let guide_Id = guide_Id_list[0][0].guide_Id;    //222
        //console.log("guide_Id : ",guide_Id);
        //data.$[{guide_Id}] = add_data[i];   //add_data[i] : '지구를 위해 무엇이든 할 것을 결심하기' 
        var jsonObject = {
            'guide_Id': guide_Id,
            'guide_NM': add_data[i]
        }

        data.push(jsonObject);
        
    }

    console.log("data : ",data);
}

test();