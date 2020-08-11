# Kaggle - 주택 가격 예측


## 1. 개요
### 1-1) 상세설명
* 아이오와주 에임스에 있는 주거용 주택의 거의 모든 측면을 설명하는 79개의 설명 변수를 학습시켜 각 주택의 최종 가격을 예측해야합니다.

### 1-2) 데이터셋 구성
* train.csv : 훈련 세트
* test.csv : 테스트 세트
* data_description.txt : 각 열에 대한 전체 설명
* sample_submission.csv : 판매 연도 및 월, 부지 면적 및 침실 수에 대한 정보 예측해야 할 데이터

### 1-3) 규칙
* Random Forest 및 Gradient Boosting과 같은 고급 회귀 기술를 사용해야 합니다.
* R 과 Python을 사용하여야 합니다.

## 2. 프로그램 코드 설명
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

* 모델링을 위한 라이브러리 불러오기
```python
from sklearn.linear_model import ElasticNet, Lasso, BayesianRidge, LassoLarsIC
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.kernel_ridge import KernelRidge
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import RobustScaler
from sklearn.base import BaseEstimator, TransformerMixin, RegressorMixin, clone
from sklearn.model_selection import KFold, cross_val_score, train_test_split
from sklearn.metrics import mean_squared_error
import xgboost as xgb
import lightgbm as lgb
```


* Lasso Regularization
    + 선형 회귀의 Regularization(규제)을 적용하는 대안이다.
    + 계수를 0에 가깝게 만들려고 하여 이르 L1규제라고 하며, 어떤 계수는 0이 되기도 하는
데 이는 완전히 제외하는 Feature가 생긴다는 의미한다.
    + Feature 선택이 자동으로 이루어진다고 볼 수 있다.
    + Alpha 값의 기본값은 1.0이며, 과소 적합을 줄이기 위해서는 이 값을 줄여야 한다.
    + Grid Search 또는 Random Search를 alpha에 넣어서 사용한다.
    + Max_iter는 반복 실행하는 최대 횟수를 의미한다.
```python
lasso = make_pipeline(RobustScaler(), Lasso(alpha=0.0005, random_state=1))
```

* Elastic Net Regularization
    + 변수도 줄이고, 분산 또한 줄이고 싶은 경우에 사용한다.
    + Lasso Regularization 와 Ridge Regularization의 혼합형이다.
    + 예) 실제 영향을 주는 변수는 A인데, 같이 붙어 다니는 B가 있는 경우에 통계적으로 B도
영향을 주는 것처럼 판단이 될 수 있다.
        - Lasso만 하면 A가 사라지고 B만 남거나, Ridge만 하면 beta를 전체적으로 줄여줘 서 변수 선택이 안되는 문제가 생긴다.
        - 이런 경우를 해결하기 위해 사용한다.
```python
ENet = make_pipeline(RobustScaler(), ElasticNet(alpha=0.0005, l1_ratio= .9, random_state=3))
```

* Ridge Regularization
    + 회귀를 위한 선형 모델이다.
    + 가중치(w)의 모든 원소가 0에 가깝게 만들어 모든 Feature가 주는 영향을 최소화(기울
기를 작게 만든다) 한다.
    + Regularization(규제)은 과대 적합이 되지 않도록 모델을 강제로 제한한다는 의미한다.
    + Grid Search 또는 Random Search를 alpha에 넣어서 사용한다.
    + Max_iter는 반복 실행하는 최대 횟수를 의미한다.
```python
KRR = KernelRidge(alpha=0.6, kernel='polynomial', degree=2, coef0=2.5)
```

* Gradient Boost Regularization
    + 여러개의결정트리를묶어강력한모델을만드는또다른앙상블기법이다.
    + 회귀와 분류에 모두 사용할 수 있다.
    + Random Forest와 달리 이진 트리의 오차를 보완하는 방식으로 순차적으로 트리를 만들
었다.
    + 무작위성이 없고 강력한 사전 가지치기가 사용된다.
    + 1~5개의 깊지 않은 트리를 사용하기 때문에 메모리를 적게 사용하고 예측이 빠르다.
    + Learning_rate : 오차를 얼마나 강하게 보정할 것인지를 제어한다.
    + N_estimater : 값을 키우면 앙상블에 트리가 더 추가되어 모델의 복잡도가 커지고 훈련 세트에서의 실수를 바로잡을 기회가 많아지지만, 너무 크면 모델이 복잡해지고 과대 적 합이 될 수 있다.
```python
GBoost = GradientBoostingRegressor(n_estimators=3000, learning_rate=0.05, max_depth=4, max_features=
'sqrt', min_samples_leaf=15, min_samples_split=10, loss='huber', random_state=5)
```

* Xgboost Regularization
    + Gradient Boost 알고리즘의 단점을 보완 해주기 위해 나왔다.
    + 과대 적합 방지가 가능한 규제가 포함되어 있다.
    + 분류와 회귀가 둘 다 가능하다.
    + 조기 종료(early stopping)을 제공한다.
    + Gradient Boost를 기반으로 한다.(즉, 앙상블 Boosting의 특징인 가중치 부여를 경사하 강법으로 한다)
```python
model_xgb = xgb.XGBRegressor(colsample_bytree=0.4603, gamma=0.0468, learning_rate=0.05, max_depth=3,min_child_weight=1.7817, n_estimators=2200, reg_alpha=0.4640, reg_lambda=0.8571, subsample=0.5213, silent=1, random_state=7, nthread=-1)
```

* Xgboost의 hyperparmeter
    + N_estimators(혹은 num_boost_round) : 결정 트리의 개수
    + Max_depth : 트리의 깊이
    + Colsample_bytree : 칼럼의 샘플링 비율
    + Subsample : weak learner가 학습에 사용하는 데이터 샘플링 비율
    + Learning_rate : 학습률
    + Min_split_loss : 리프 노드를 추가적으로 나눌지 결정하는 값
    + Reg_lambda : L2 규제
    + Reg_alpha : L1 규제
    
* LightGBM Regularization
    + Xgboost가 학습시간이 느린 단점을 보완 해주기 위해 나왔다.
    + 대용량 데이터 처리가 가능하고, 다른 모델들보다 더 적은 자원을 사용한다.
    + 속도가 빠르며, GPU까지 지원해주기도 한다.
    + 너무 적은 수의 데이터를 사용하면 과대 적합의 문제 발생한다.
    + Leaf Wise(리프 중심) 트리 분할을 사용한다.
    + Tree의 균형은 맞추지 않고 leaf node를 지속적으로 분할하면서 진행한다.
    + Leaf node를 max delta loss 값을 가지는 Leaf node를 계속 분할해 간다.
    + 비 대칭적이고 깊은 Tree가 생성되지만 동일한 leaf를 생성할 때 leaf-wise는 Level-wise 보다 손실을 줄일 수 있다.
    

* LightGBM의 hyperparmeter
    + N_estimators : 반복하려는 트리의 개수
    + Learning_rate : 학습률
    + Max_depth : 트리의 최대 깊이
    + Min_child_samples : 리프 노드가 되기 위한 최소한의 샘플 데이터 수
    + Num_leaves:하나의트리가가질수있는최대리프개수
    + Fearure_fraction : 트리를 학습할 때마다 선택하는 feature의 비율
    + Reg_lambda : L2 규제
    + Reg_alpha : L1 규제
    
* LightGBM의 Leaf-wise 트리 분석
    + 기존의 Tree들은 Tree의 depth(깊이)를 줄이기위해서 Level-wise(균형 트리)분할을 사용하는데, LightGBM은 위와 같이 다르게 모델이 동작한다.
    + 균형을 잡아주어야 하기 때문에 Tree의 depth가 줄어든다, 그 대신 그 균형을 잡아주기 위한 연산이 추가 되는 것이 단점이다.
<img src="https://user-images.githubusercontent.com/60723495/83345630-6f67b480-a350-11ea-8256-fda78e1e3d1a.png" width="600" height="300">


* RMSLE(Root Mean Square Logarithmic Error)
    + 과대평가 된 항목보다는 과소평가 된 항목에 페널티를 준다.
    + 오차를 제곱해서 평균한 값의 제곱근으로 값이 적을수록 정밀도가 높다.
    + 0에 가까운 값이 나올수록 정밀도가 높은 값이다.
    + RMSE와 RMSLE 차이
        - 아웃라이어에 강건 해진다.
        - 상대적 Error를 측정해준다.
        - Under Estimation에 큰 페널티를 부여한다.
    
* 각각의 모델로 구해지는 RMSLE의 중간값과 평균을 출력해준다.
```python
score = rmsle_cv(lasso)
print('\nLasso score: {:.4f} ({:.4f})\n'.format(score.mean(), score.std()))
>>> Lasso score: 0.1115 (0.0074)
```
```python
score = rmsle_cv(ENet)
print("ElasticNet score: {:.4f} ({:.4f})\n".format(score.mean(), score.std()))
>>> ElasticNet score: 0.1116 (0.0074)
```
```python
score = rmsle_cv(KRR)
print("Kernel Ridge score: {:.4f} ({:.4f})\n".format(score.mean(), score.std()))
>>> Kernel Ridge score: 0.1153 (0.0075)
```
```python
score = rmsle_cv(GBoost)
print("Gradient Boosting score: {:.4f} ({:.4f})\n".format(score.mean(), score.std()))
>>> Gradient Boosting score: 0.1167 (0.0083)
```
```python
score = rmsle_cv(model_lgb)
print("LGBM score: {:.4f} ({:.4f})\n" .format(score.mean(), score.std()))
>>> LGBM score: 0.1155 (0.0067)
```
```python
score = rmsle_cv(model_xgb)
print("Xgboost score: {:.4f} ({:.4f})\n".format(score.mean(), score.std()))
>>> Xgboost score: 0.1158 (0.0064)
```

* Stacking(Meta Modeling)
  + 서로 다른 모델들을 조합해서 최고의 성능을 내는 모델을 생성하는 기법이다.
  + 서로의 장점은 취하고 약점은 보완 할 수 있게 된다.
  + 필요한 데이터 연산량이 많아야 한다.
  + 문제에 따라 정확도를 요구하기도 하지만, 안정성을 요구하기도 한다. 
  + 문제에 적절한 모델을 선택하는 것이 중요하다.

* 여러개의 기본 모델의 평균화를 시키는 클래스 
```python
class AveragingModels(BaseEstimator, RegressorMixin, TransformerMixin):
    def __init__(self, models):
        self.models = models

    def fit(self, X, y):
        self.models_ = [clone(x) for x in self.models]

        for model in self.models_:
            model.fit(X,y)

        return self

    def predict(self, X):
        predictions = np.column_stack([
            model.predict(X) for model in self.models_
        ])
        return np.mean(predictions, axis=1)
```

* 클래스에 넣어서 위의 4개의 모델(ElasticNet 과 GradientBoost, kernel Ridge, lasso)의 RMSLE 값을 평균화하여 출력해준다.
```python
averaged_models = AveragingModels(models=(ENet, GBoost, KRR, lasso))
score = rmsle_cv(averaged_models)
print('Averaged base models score : {:.4f} ({:.4f})\n'.format(score.mean(),score.std()))
>>> Averaged base models score : 0.1087 (0.0077)
```

* Stacking 기법을 사용하여 평균화 시키는 클래스
```python
class StackingAveragedModels(BaseEstimator,RegressorMixin,TransformerMixin):
    def __init__(self, base_models, meta_model, n_folds =5):
        self.base_models = base_models
        self.meta_model = meta_model
        self.n_folds = n_folds

    def fit(self, X, y):
        self.base_models_ = [list() for x in self.base_models]
        self.meta_model_ = clone(self.meta_model)
        kfold = KFold(n_splits=self.n_folds, shuffle=True, random_state=156)

        out_of_fold_predictions = np.zeros((X.shape[0], len(self.base_models)))
        for i, model in enumerate(self.base_models):
            for train_index, holdout_index in kfold.split(X,y):
                instance = clone(model)
                self.base_models_[i].append(instance)
                instance.fit(X[train_index], y[train_index])
                y_pred = instance.predict(X[holdout_index])
                out_of_fold_predictions[holdout_index, i] = y_pred

        self.meta_model_.fit(out_of_fold_predictions, y)
        return self

    def predict(self, X):
        meta_features = np.column_stack([
            np.column_stack([model.predict(X) for model in base_models]).mean(axis=1)
            for base_models in self.base_models_])
        return self.meta_model_.predict(meta_features)
```


* 최종 Stacking 기법 설명
    + K-Fold를 Fold의 값에 5를 주어 각각의 모델을 5등분을 한다.
    + Stacking기법을 사용할 때 base Model 과 meta Model 주어지는데 Fold값이 5 이면 base Model은 3개의 Model을 주어야하고 나머지 2개의 Model에는 meta Model이 들어가게 된다. (Out-Of-Fold의 정의가 들어간다)
    + 5개의 모델에 대한 값을 모아서 새로운 Feature을 만들고 학습 시킨다.
    + Test file의 값을 예측하게 된다.
<img src="https://user-images.githubusercontent.com/60723495/83346389-d4bea400-a356-11ea-8ca9-e10ccd3989f8.png" width="700" height="300">

* Stacking 기법을 사용하기위해 base_models를 ElasticNet 과 GradientBoost, Kernel Ridge로 meta_model에 lasso를 넣어 평준화 하였다.
```python
stacked_averaged_models = StackingAveragedModels(base_models=(ENet, GBoost, KRR), meta_model= lasso)
score = rmsle_cv(stacked_averaged_models)
print('Stacking Averaged models score : {:.4f} ({:.4f})'.format(score.mean(),score.std()))
>>> Stacking Averaged models score : 0.1081 (0.0073)
```

* RMSLE를 구해주는 함수 
```python
def rmsle(y, y_pred) : 
    return np.sqrt(mean_squared_error(y, y_pred))
```

* Stacking 기법으로 RSMLE를 출력
```python
stacked_averaged_models.fit(train.values, y_train)
stacked_train_pred = stacked_averaged_models.predict(train.values)
stacked_pred = np.expm1(stacked_averaged_models.predict(test.values))
print(rmsle(y_train, stacked_train_pred))
>>> 0.07839506096666429
```

* Xgboost 모델로 RSMLE를 출력
```python
model_xgb.fit(train, y_train)
xgb_train_pred = model_xgb.predict(train)
xgb_pred = np.expm1(model_xgb.predict(test))
print(rmsle(y_train, xgb_train_pred))
>>> 0.0786103062413744
```

* LightGBM 모델로 RSMLE를 출력
```python
model_lgb.fit(train, y_train)
lgb_train_pred = model_lgb.predict(train)
lgb_pred = np.expm1(model_lgb.predict(test.values))
print(rmsle(y_train, lgb_train_pred))
>>> 0.07226288640876002
```

* 위에 3개 모델의 RSMLE를 퍼센트로 나누어 더하여 출력한다.
    + 이렇게 가중치를 나눈 이유는 LightGBM과 Xgboost보다 stacking기법의 값이 RSMLE 제일 낮은 평균화된 값을 가지기 때문이다.
```python
print('RMSLE score on train data : ')
print(rmsle(y_train, stacked_train_pred*0.80 + xgb_train_pred*0.10 + lgb_train_pred*0.10))
>>> RMSLE score on train data : 0.07559500505171629
```

* 변수에 저장한다
```python
ensemble = stacked_pred*0.80 + xgb_pred*0.10 + lgb_pred*0.10
```

* test.csv의 id를 토대로 값을 SalePrice의 값에 넣어서 submission.csv에 저장한다.
```python
sub = pd.DataFrame()
sub['id'] = test_ID
sub['SalePrice'] = ensemble
sub.to_csv('data/submission.csv',index=False)
```
