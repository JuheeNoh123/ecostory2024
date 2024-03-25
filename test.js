add_data='{\n' +
'    "생활": [\n' +
'      "일회용품 대신 재사용 가능한 용기 사용하기",\n' +
'      "도시림에 나무 심기",\n' +
'      "자원순환을 생각하며 쇼핑하기",\n' +
'      "종이를 많이 사용하는 것을 줄이기",\n' +
'      "네모지기를 줄이는 것이 환경에 좋음",\n' +
'      "수도꼭지에 물을 닦기",\n' +
'      "농약을 사용하지 않는 유기농 농산물 구입하기",\n' +
'      "공공장소에 있는 쓰레기통을 이용하여 쓰레기를 버리기",\n' +
'      "친환경 제품을 구입하기",\n' +
'      "가정에서 자체적으로 재생 가능한 에너지 사용하기"\n' +
'    ]\n' +
'}'


//let category= new category_model(category_NM);
//console.log(add_data);
//let category_Id = category.find();
//let category= new category_model(category_NM);
//console.log(add_data);
//let category_Id = await category.find();
//console.log(category_Id['category_Id']);
response=JSON.parse(add_data);
title=Object.keys(response); //생활
//console.log(title); //['친환경을 위한 요소']
let result = [];
title.forEach(async element => {
    response[element].forEach(async (value, index)=>{
        console.log('Index: ' + index + ' Value: ' + value);
        //let guide= new guide_model(response[element][cg], category_Id['category_Id']);
        //let save = await guide.save();  
        //console.log("db save : " , save);               
        
    })
    console.log("response[element]: \n",response[element]);
    result = response[element];
})