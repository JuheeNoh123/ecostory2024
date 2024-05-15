require('dotenv').config();
const { OpenAI } = require("openai");


const callChatGPT = async(prompt) => {

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {role: "system", content: "너는 환경을 위한 가이드를 알려주는 가이드 북이야"},
        {role: "user", content:"친환경을 위해 실천할 수 있는 요소를 카테고리별로 10가지씩 JSON 형식으로 출력해줘"},
        {role: "assistant", content:'{ "가정": [ "플라스틱 사용 줄이기", "재활용 가능한 제품 구매하기", "담배꽁초를 버리지 말고 분리수거함에 버리기", "에너지 효율적인 전구로 교체하기", "급수기 대신 물병이나 잔을 사용하기", "친환경 세제 사용하기", "음식물 쓰레기를 재활용하기", "가정의 전력 소비를 줄이기 위해 전기제품을 꺼놓기", "가정에서 나무 화덕으로 난방하기", "가정에서 쓰는 물을 절약하기" ], "일상": [ "대중교통을 이용하기", "오토바이나 자전거를 이용하기", "일회용품 대신 재사용 가능한 용기 사용하기", "도시림에 나무 심기", "자원순환을 생각하며 쇼핑하기", "종이를 많이 사용하는 것을 줄이기", "네모지기를 줄이는 것이 환경에 좋음", "수도꼭지에 물을 닦기", "농약을 사용하지 않는 유기농 농산물 구입하기", "공공장소에 있는 쓰레기통을 이용하여 쓰레기를 버리기" ], "사회": [ "친환경 단체에 가입하여 활동하기", "지역 및 봉사 활동에 참여하기", "동물 보호 시설에서 봉사하기", "친환경 운동에 동참하기", "친환경 교육과 캠페인 활동에 참여하기", "지역 커뮤니티 활동에 참여하기", "환경을 주제로 한 문화 활동에 참여하기", "친환경 제품을 지원하는 기부하기", "친환경 활동을 홍보하기", "지구를 위해 무엇이든 할 것을 결심하기" ] }'},
        {role: "user", content: "친환경을 위해 실천할 수 있는 요소를 생활 카테고리로 10가지만 JSON 형식으로 출력해줘"},
        {role: "assistant", content:'{ "생활": [ "일회용품 대신 재사용 가능한 용기 사용하기", "도시림에 나무 심기", "자원순환을 생각하며 쇼핑하기", "종이를 많이 사용하는 것을 줄이기", "네모지기를 줄이는 것이 환경에 좋음", "수도꼭지에 물을 닦기", "농약을 사용하지 않는 유기농 농산물 구입하기", "공공장소에 있는 쓰레기통을 이용하여 쓰레기를 버리기", "친환경 제품을 구입하기", "가정에서 자체적으로 재생 가능한 에너지 사용하기" ] }'},
        {role: "user", content:prompt},
      ],
      //max_tokens:100, //돈 많이 나갈까봐 글자수 제한 ㅎ

    });

    console.log("response", response.choices[0].message);
    return response.choices[0].message;

  } 
  catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return null;
  }
}

module.exports = { callChatGPT };