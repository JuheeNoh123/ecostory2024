import pandas as pd

try:
    # 데이터 불러오기
    data_emission = pd.read_csv('data\data_emission.csv', na_values=[''])  # 기준배출량 등의 데이터
    data_waste = pd.read_csv('data\data_waste.csv', na_values=[''])  # 음식물류폐기물발생량 등의 데이터
    data_air = pd.read_csv('data\data_air.csv', na_values=[''])  # 대기오염물질 농도값 등의 데이터

    # NaN 값을 적절한 값으로 대체
    data_emission.fillna(data_emission.mean(), inplace=True)
    data_waste.fillna(data_waste.mean(), inplace=True)
    data_air.fillna(data_air.mean(), inplace=True)

    # 가중치 설정
    weight_emission = 0.4
    weight_waste = 0.3
    weight_air = 0.3

    # 종합 친환경성 지표 계산
    # 온실가스 발생량 데이터 정규화
    min_gas_emission = data_emission['GAS_EMISN_AMNT'].min()
    max_gas_emission = data_emission['GAS_EMISN_AMNT'].max()
    data_emission['Normalized_Gas_Emission'] = (data_emission['GAS_EMISN_AMNT'] - min_gas_emission) / (max_gas_emission - min_gas_emission)

    # 음식물류폐기물 발생량 데이터 정규화
    min_waste = data_waste['FODNDRK_WST_OCCUR_QTY'].min()
    max_waste = data_waste['FODNDRK_WST_OCCUR_QTY'].max()
    data_waste['Normalized_Waste'] = (data_waste['FODNDRK_WST_OCCUR_QTY'] - min_waste) / (max_waste - min_waste)

    # 대기오염물질 데이터 정규화
    cols_air = ['SUA_GAS_DNST_VL', 'COMNXD_DNST_VL', 'NO2_DNST_VL', 'OZONE_DNST_VL', 'FINEDUST_PM10_DNST_VL', 'FINEDUST_PM2_5_DNST_VL']
    for col in cols_air:
        min_value = data_air[col].min()
        max_value = data_air[col].max()
        data_air[f'Normalized_{col}'] = (data_air[col] - min_value) / (max_value - min_value)

    # 각 환경 지표 계산
    data_emission['Emission_Score'] = weight_emission * data_emission['Normalized_Gas_Emission']
    data_emission['Waste_Score'] = weight_waste * data_waste['Normalized_Waste']
    data_emission['Air_Score'] = weight_air * data_air[[f'Normalized_{col}' for col in cols_air]].mean(axis=1)

    # 종합 점수 계산
    data_emission['Total_Score'] = (data_emission['Emission_Score'] +
                                     data_emission['Waste_Score'] +
                                     data_emission['Air_Score']) / \
                                    (weight_emission + weight_waste + weight_air)

    # 결과 정렬
    result = data_emission[['SIGUN_NM', 'Emission_Score', 'Waste_Score', 'Air_Score', 'Total_Score']].sort_values(by='Total_Score', ascending=False)
    print(result)
    
    # 결과를 출력할 때 NaN 값을 가진 행을 제거합니다.
    result.dropna(inplace=True)

    # 환경 심각도 등급 나누기
    result['Severity'] = pd.qcut(result['Total_Score'], q=[0, 0.25, 0.5, 0.75, 1],
                                labels=['Very Low', 'Low', 'High', 'Very High'])

    res = result[['SIGUN_NM', 'Emission_Score', 'Waste_Score', 'Air_Score', 'Total_Score', 'Severity']]
    # 결과 출력
    print(res)
    
    
    

except Exception as e:
    print("An error occurred:", e)
