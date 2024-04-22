import pandas as pd
from io import StringIO
import requests
import pprint
import json

#음식물 쓰레기
url_f = "https://openapi.gg.go.kr/Fodndrkwstoccur?KEY=7f21e9c535d044b8aeb51c90b1c8dff3&Type=json&pIndex=1&pSize=100"
response_f = requests.get(url_f)
contents_f = response_f.text
json_ob_f = json.loads(contents_f)
print(json_ob_f)
body_f = json_ob_f['Fodndrkwstoccur'][1]['row']
dataframe_f = pd.json_normalize(body_f)
print(dataframe_f)
dataframe_f.to_csv('data\data_waste.csv',index=False)


#대기질
url_d = "https://openapi.gg.go.kr/Sidoatmospolutnmesure?KEY=544c8a0f0d7d4183afaf35a35dbec704&Type=json&pIndex=1&pSize=100"
response_d = requests.get(url_d)
contents_d = response_d.text
json_ob_d = json.loads(contents_d)
body_d = json_ob_d['Sidoatmospolutnmesure'][1]['row']
dataframe_d = pd.json_normalize(body_d)
#print(dataframe_d)
dataframe_d.to_csv('data\data_air.csv',index=False)

# 온실가스
url_o = "https://openapi.gg.go.kr/GGSIGUNGREENGASEMSTM?KEY=f492b61fa9f3461a822ccbaa1de3a8b2&Type=json&pIndex=1&pSize=100"
response_o = requests.get(url_o)
contents_o = response_o.text
json_ob_o = json.loads(contents_o)
body_o = json_ob_o['GGSIGUNGREENGASEMSTM'][1]['row']
dataframe_o = pd.json_normalize(body_o)
#print(dataframe_o)
dataframe_o.to_csv('data\data_emission.csv',index=False)




# # 시군명 별로 대기 품질 관련 값들의 평균 계산
# average_values_by_city_f = dataframe_f.groupby('SIGUN_NM').mean()
# average_values_by_city_d = dataframe_d.groupby('SIGUN_NM').mean()
# average_values_by_city_o = dataframe_o.groupby('SIGUN_NM').mean()

# # 결과 출력
# print("시군명 별 음식물 쓰레기 평균 값들:")
# print(average_values_by_city_f)
# print("시군명 별 대기 품질 평균 값들:")
# print(average_values_by_city_d)
# print("시군명 별 온실가스 평균 값들:")
# print(average_values_by_city_o)

