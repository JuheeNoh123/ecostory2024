import time
import pymysql
from dotenv import load_dotenv
import os
from ecodata import res  
from apscheduler.schedulers.background import BackgroundScheduler


load_dotenv()

Host = os.environ.get('DB_HOST')
Database = os.environ.get('DATABASE')
User = os.environ.get('DB_USER')
Password = os.environ.get('PASSWORD')


# mysql 연동
conn = pymysql.connect(host=Host, user=User, password=Password, db=Database, charset='utf8', autocommit=True)

# 커서 생성
cursor = conn.cursor()
datas = []
# datas = [(0.234790, 0.300000, 0.120986, 0.655777,양평군), (0.283650, 0.179213, 0.129953, 0.592816), () ...]
for idx, row in res.iterrows():
    data = (
        row['Emission_Score'],
        row['Waste_Score'],
        row['Air_Score'],
        row['Total_Score'],
        row['Severity'],
        row['SIGUN_NM']
    )
    datas.append(data)



# 쿼리 실행
sql = """INSERT INTO eco_data (sigun_id, Emission_Score, Waste_Score, Air_Score, Total_Score, Severity)
        SELECT id, %s, %s, %s, %s, %s FROM sigun WHERE SIGUN_NM = %s
        ON DUPLICATE KEY UPDATE Emission_Score = %s ,Waste_Score=%s, Air_Score = %s,Total_Score = %s, Severity= %s"""

for data in datas:
    try:
        # 데이터 정규화
        Emission_Score = round(data[0], 5)
        Waste_Score = round(data[1], 5)
        Air_Score = round(data[2], 5)
        Total_Score = round(data[3], 5)
        Severity = data[4]
        SIGUN_NM = data[5]

        cursor.execute(sql, (Emission_Score, Waste_Score, Air_Score, Total_Score, Severity, SIGUN_NM,
                             Emission_Score, Waste_Score, Air_Score, Total_Score, Severity))
        print("Inserted data for", SIGUN_NM)
    except pymysql.Error as e:
        print("Error inserting data for", SIGUN_NM, ":", e)
# 연결 종료
conn.close()
    
