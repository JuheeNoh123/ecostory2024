import pymysql
from dotenv import load_dotenv
import os
from ecodata import res  


load_dotenv()

Host = os.environ.get('HOST')
Database = os.environ.get('DATABASE')
User = os.environ.get('USER')
Password = os.environ.get('PASSWORD')

# mysql 연동
conn = pymysql.connect(host=Host, user=User, password=Password, db=Database, charset='utf8')

# 커서 생성
cursor = conn.cursor()

datas = []
# datas = [(0.234790, 0.300000, 0.120986, 0.655777,양평군), (0.283650, 0.179213, 0.129953, 0.592816), () ...]
for idx, row in res.iterrows():
    datas.append([row['Emission_Score'], row['Waste_Score'], row['Air_Score'], row['Total_Score'],row['Severity'],row['SIGUN_NM'],row['Emission_Score'], row['Waste_Score'], row['Air_Score'], row['Total_Score'],row['Severity']])
print(datas)

# 쿼리 실행
sql = """INSERT INTO eco_data (sigun_id, Emission_Score, Waste_Score, Air_Score, Total_Score, Severity) 
        SELECT id, %s, %s, %s, %s, %s FROM sigun WHERE SIGUN_NM = %s 
        ON DUPLICATE KEY UPDATE Emission_Score = %s ,Waste_Score=%s, Air_Score = %s,Total_Score = %s, Severity= %s"""
for data in datas:
     cursor.execute(sql, data)

# 결과 가져오기
#rows = cursor.fetchall()
conn.commit()

# 연결 종료
conn.close()