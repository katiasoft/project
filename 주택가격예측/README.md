# Kaggle - 주택 가격 예측



## 1.



## 2. 프로그램 설명
### 2-1) 라이브러리 및 데이터 불러오기
* 데이터 처리를 위한 패키지와 모듈 불러오기
```python
import numpy as np
import pandas as pd
%matplotlib inline
import matplotlib.pyplot as plt
import seaborn as sns
import warnings
from scipy import stats
from scipy.stats import norm, skew
from subprocess import check_output
color = sns.color_palette()
sns.set_style('darkgrid')
def igonore_warn(*args, **kwargs):
    pass
warnings.warn = igonore_warn
pd.set_option('display.float_format', lambda x : '{:.3f}'.format(x))
print(check_output(['ls','/Users/mac/Desktop/house_project/data']).decode("utf8"))
```

* 데이터 불러오기
```python
train = pd.read_csv('/Users/mac/Desktop/house_project/data/train.csv')
test = pd.read_csv('/Users/mac/Desktop/house_project/data/test.csv')
```

* train 파일 데이터에서 상위 5개를 불러오기
```python
train.head(5)
```
<img src="https://user-images.githubusercontent.com/60723495/83249507-a4a1c480-a1e1-11ea-8249-1c6ea5465b49.png" width="1000" height="200">

* test 파일 데이터에서 상위 5개 불러오기
```python
test.head(5)
```
<img src="https://user-images.githubusercontent.com/60723495/83250803-a8cee180-a1e3-11ea-94dc-7801312516a5.png" width="1000" height="200">

* 각각의 DataFrame의 size를 출력 /<br>  각각 DataFrame에서 맨앞의 id를 삭제한 후의 size를 출력<br>
```python
print('The train data size before dropping Id feature is : {}' .format(train.shape))
print('The test data size before dropping Id feature is : {}' .format(test.shape))
train_ID = train['Id']
test_ID = test['Id']
train.drop('Id', axis=1, inplace=True)
test.drop('Id', axis=1, inplace=True)
print('The train data size before dropping Id feature is : {}' .format(train.shape))
print('The test data size before dropping Id feature is : {}' .format(test.shape))
>>>The train data size before dropping Id feature is : (1460, 81)
The test data size before dropping Id feature is : (1459, 80)
The train data size before dropping Id feature is : (1460, 80)
The test data size before dropping Id feature is : (1459, 79)
```

### 2-2) Data Processing
* GrLivArea 와 SalePrice 간의 그래프를 출력
    + SalePrice(주택 가격) 와 GrLivArea(생활면적크기)는 상식적으로 서로에게 영향을 미칠 것으로 예상이 된다.
    + GrLivArea가 커져도 가격이 오르지 않는 특이치가 발생하는 것을 볼 수 있다.
```python
fig, ax = plt.subplots()
ax.scatter(x=train['GrLivArea'], y=train['SalePrice'])
plt.ylabel('SalePrice', fontsize=13)
plt.xlabel('GrLivArea', fontsize=13)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344400-3a079a80-a341-11ea-8ce1-1f3456b2f6d4.png" width="300" height="200">

* GrLivArea 와 SalePrice 간의 이상치를 제거하고 그래프를 출력
    + 이러한 특이치는 SalePrice를 예측하는 데 안좋은 영향을 끼칠 것으로 사료되어 제거하 였다.
```python
train = train.drop(train[(train['GrLivArea'] > 4000) & (train['SalePrice'] < 300000)].index)
fig, ax = plt.subplots()
ax.scatter(train['GrLivArea'], train['SalePrice'])
plt.ylabel('SalePrice', fontsize = 13)
plt.xlabel('GrLivArea', fontsize =13)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344412-9bc80480-a341-11ea-9943-dc2601582441.png" width="300" height="200">

* 대상 변수인 SalePrice를 관한 빈도수와 오차 분포를 나타낸 그래프를 출력
    + 대상 변수인 SalePrice에 대한 빈도수와 오차 분포를 그래프로 이루고 있다.
    + 기준이 되는 정규성을 가지는 그래프와 비교하여 분석한다.
    + 빈도수는 한쪽으로 치우치는 증상을 보이고 오차의 분포는 많은 차이를 보이고 있다.
    + 정규성과 비교하기 쉽게 대상 변수에 대한 정규화를 필요로 해 보인다.
```python 
sns.distplot(train['SalePrice'], fit = norm)
(mu, sigma) = norm.fit(train['SalePrice'])
print('\n mu = {:.2f} and sigma = {:.2f}\n' .format(mu, sigma))
plt.legend(['Normal dist. ($\mu=$ {:.2f} and $\sigma=$ {:.2f})'.format(mu, sigma)], loc = 'best')
plt.ylabel('Frequency')
plt.title('SalePrice distribution')
fig = plt.figure()
res = stats.probplot(train['SalePrice'], plot=plt)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344432-d631a180-a341-11ea-92e0-ec294bc44e59.png" width="300" height="200">
<img src="https://user-images.githubusercontent.com/60723495/83344459-27da2c00-a342-11ea-8d3a-bc5695a89d77.png" width="300" height="200">

* 대상 변수인 SalePrice를 관한 빈도수와 오차 분포를 로그변환하여 나타낸 그래프를 출력
    + 로그변환 : 정규성을 높이고 분석(회귀 분석 등)에서 정확한 값을 얻기 위해서 사용한다, 즉 정규 분포가 아닌 것을 정규 분포에 가깝게 만드는 변환이다. 
```python
train['SalePrice'] = np.log1p(train['SalePrice'])
sns.distplot(train['SalePrice'], fit = norm)
(mu, sigma) = norm.fit(train['SalePrice'])
print('\n mu = {:.2f} and sigma = {:.2f}\n' .format(mu, sigma))
plt.legend(['Normal dist. ($\mu=$ {:.2f} and $\sigma$ {:.2f})'.format(mu, sigma)], loc = 'best')
plt.ylabel('Frequency')
plt.title('SalePrice distribution')
fig = plt.figure()
res = stats.probplot(train['SalePrice'], plot=plt)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344479-72f43f00-a342-11ea-8534-ceeedbe0262f.png" width="300" height="200">
<img src="https://user-images.githubusercontent.com/60723495/83344490-ab941880-a342-11ea-85d8-3e003f11ebdd.png" width="300" height="200">

* 대상 변수인 SalePrice를 제외한 Dataframe을 구성
```python
ntrain = train.shape[0]
ntest = test.shape[0]
y_train = train.SalePrice.values
all_data = pd.concat((train, test)).reset_index(drop=True)
all_data.drop(['SalePrice'], axis=1 , inplace=True)
print('all_data size is : {}'.format(all_data.shape))
```
* 각각의 변수에 값이 존재하지 않는 개수를 세어서 변수 안의 전체 개수를 나누어서 100을 곱해서 missing ratio 출력
```python
all_data_na = (all_data.isnull().sum() / len(all_data)) * 100
all_data_na = all_data_na.drop(all_data_na[all_data_na == 0].index).sort_values(ascending=False)[:30]
missing_data = pd.DataFrame({'Missing Ratio' : all_data_na})
missing_data.head(20)
```
<img src="https://user-images.githubusercontent.com/60723495/83344886-d0d75580-a347-11ea-9bfb-dd4d2f71ddb8.png" width="300" height="1000">

* missing ratio를 토대로 막대 그래프화 시켜 출력
```python
f, ax = plt.subplots(figsize = (10, 10))
plt.xticks(rotation = '90')
sns.barplot(x=all_data_na.index, y=all_data_na)
plt.xlabel('Features', fontsize = 15)
plt.ylabel('Percent of missing values', fontsize = 15)
plt.title('Percent missing data by feature', fontsize = 15)
```
<img src="https://user-images.githubusercontent.com/60723495/83344918-34fa1980-a348-11ea-8e19-6ca22749e3e0.png" width="500" height="500">

* 각각의 변수간에 상관성을 분석한 그래프 출력
    + 데이터 Columns별 상관성을 분석한 그래프
    + 상관성이 있다고 해서 무조건으로 믿을 수 없는 자료
```python
corrmat = train.corr()
plt.subplots(figsize=(12,9))
sns.heatmap(corrmat, vmax=0.9, square=True)
```
<img src="https://user-images.githubusercontent.com/60723495/83344966-b6ea4280-a348-11ea-99ee-933b14bd4e68.png" width="600" height="500">

* 각각의 변수의 missing data를 각각 변수의 형식에 맞추어서 값을 None과 0, mode(0)으로 채우거나 삭제
```python
all_data['PoolQC'] = all_data['PoolQC'].fillna('None')
all_data['MiscFeature'] = all_data['MiscFeature'].fillna('None')
all_data['Alley'] = all_data['Alley'].fillna('None')
all_data['Fence'] = all_data['Fence'].fillna('None')
all_data['FireplaceQu'] = all_data['FireplaceQu'].fillna('None')
all_data['LotFrontage'] = all_data.groupby('Neighborhood')['LotFrontage'].transform(lambda x: x.fillna(x.median()))
for col in ('GarageType', 'GarageFinish', 'GarageQual', 'GarageCond'):
    all_data[col] = all_data[col].fillna('None')
for col in ('GarageYrBlt', 'GarageArea', 'GarageCars'):
    all_data[col] = all_data[col].fillna(0)
for col in ('BsmtFinSF1', 'BsmtFinSF2', 'BsmtUnfSF','TotalBsmtSF', 'BsmtFullBath', 'BsmtHalfBath'):
    all_data[col] = all_data[col].fillna(0)
for col in ('BsmtQual', 'BsmtCond', 'BsmtExposure', 'BsmtFinType1', 'BsmtFinType2'):
    all_data[col] = all_data[col].fillna('None')
all_data["MasVnrType"] = all_data["MasVnrType"].fillna("None")
all_data["MasVnrArea"] = all_data["MasVnrArea"].fillna(0)
all_data['MSZoning'] = all_data['MSZoning'].fillna(all_data['MSZoning'].mode()[0])
all_data = all_data.drop(['Utilities'], axis=1)
all_data['Functional'] = all_data['Functional'].fillna('Typ')
all_data['Electrical'] = all_data['Electrical'].fillna(all_data['Electrical'].mode()[0])
all_data['KitchenQual'] = all_data['KitchenQual'].fillna(all_data['KitchenQual'].mode()[0])
all_data['Exterior1st'] = all_data['Exterior1st'].fillna(all_data['Exterior1st'].mode()[0])
all_data['Exterior2nd'] = all_data['Exterior2nd'].fillna(all_data['Exterior2nd'].mode()[0])
all_data['SaleType'] = all_data['SaleType'].fillna(all_data['SaleType'].mode()[0])
all_data['MSSubClass'] = all_data['MSSubClass'].fillna('None')
```

* 다시 한번더 missing ratio를 출력하면 아무런 값이 나오지 않게 된다.
```python
all_data_na = (all_data.isnull().sum() / len(all_data)) * 100
all_data_na = all_data_na.drop(all_data_na[all_data_na == 0].index).sort_values(ascending = False)
missing_data = pd.DataFrame({'Missing Ratio' : all_data_na})
missing_data.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83345083-febd9980-a349-11ea-8e75-0c1daab79bf9.png" width="300" height="100">

* Feature Engineering
  + Feature Engineering은 Machine Learning 알고리즘을 작동하기 위해 데이터에 대한 도메인 지식을 활용하여 특징(feature)를 만들어내는 과정이다.
  + 다른 정의를 살펴보면, Machine Learning Model을 위한 데이터 레이블의 칼럼(특징)을 생성하거나 선택하는 작업을 의미한다.
  + 간단히 정리하면, 모델의 성능을 높이기 위해 모델에 입력할 데이터를 만들기 위해 주 어진 초기 데이터로부터 특징을 가공하고 생성하는 전체 과정을 의미한다.
  + 모델 성능에 미치는 영향이 크기 때문에 Machine Learning 응용에 있어서 굉장히 중요 한 단계이며, 전문성과 시간과 비용이 많이 드는 작업이다.

* 각각의 변수중 변수의 형식을 계산하기 편하게 변환한다.
```python
all_data['MSSubClass'] = all_data['MSSubClass'].apply(str)
all_data['OverallCond'] = all_data['OverallCond'].astype(str)
all_data['YrSold'] = all_data['YrSold'].astype(str)
all_data['MoSold'] = all_data['MoSold'].astype(str)
```
* LabelEncoder를 통하여 변수의 형식이 String인 문자를 수치화하고, 각각 변수에 항목들을 리스트화하여 변수로 저장한다.
```python
from sklearn.preprocessing import LabelEncoder
cols = ('FireplaceQu', 'BsmtQual', 'BsmtCond', 'GarageQual', 'GarageCond', 
        'ExterQual', 'ExterCond','HeatingQC', 'PoolQC', 'KitchenQual', 'BsmtFinType1', 
        'BsmtFinType2', 'Functional', 'Fence', 'BsmtExposure', 'GarageFinish', 'LandSlope',
        'LotShape', 'PavedDrive', 'Street', 'Alley', 'CentralAir', 'MSSubClass', 'OverallCond', 
        'YrSold', 'MoSold')
for c in cols :
    lbl = LabelEncoder()
    lbl.fit(list(all_data[c].values))
    all_data[c] = lbl.transform(list(all_data[c].values))
print('Shape all_data : {}' .format(all_data.shape))
all_data['TotalSF'] = all_data['TotalBsmtSF'] + all_data['1stFlrSF'] + all_data['2ndFlrSF']
```

* Skewed Features(비뚤어진 특징 : Box_Cox변환)
  + 데이터를 정규 분포에 가깝게 만들거나 데이터 분산을 안정화하는 작업이다.
  + 정규성을 가정하는 분석법이나 정상성을 요구하는 분석법에 사용하기에 앞선 전처리이다.
  + 데이터가 모두 양수여야 한다는 조건이 필요하다.
  + 대상 변수인 SalePrice의 값이 주택의 가격을 뜻함으로 모두 양수를 의미한다, 따라서 Box-Cox Transformation을 사용 할 수 있다.
  + 이번 프로젝트에서는 Log Transformation 보다 Box-Cox Transformation가 신뢰 수준을 향상시키는데 도움이 될 것이다.

* 분포도가 한쪽으로 치우치는 않았는 지 확인하여 정규화가 필요한지 판단한다.
```python
numeric_feats = all_data.dtypes[all_data.dtypes != 'object'].index
skewed_feats = all_data[numeric_feats].apply(lambda x: skew(x.dropna())).sort_values(ascending = False)
print('\nSkew in numerical features: \n')
skewness = pd.DataFrame({'skew' : skewed_feats})
skewness.head(10)
```

* 로그변환이 아닌 Box_Cox변환을 사용하였다.
```python
skewness = skewness[abs(skewness) > 0.75]
print('There are {} skewed numerical features to Box Cox transform' .format(skewness.shape[0]))
from scipy.special import boxcox1p
skewed_features = skewness.index
lam = 0.15
for feat in skewed_features:
    all_data[feat] = boxcox1p(all_data[feat], lam)
all_data = pd.get_dummies(all_data)
print(all_data.shape)
```

* 처리되어진 각각의 값을 변수에 저장한다.
```python
train = all_data[:ntrain]
test = all_data[:ntest]
```

### 2-3) 모델링
