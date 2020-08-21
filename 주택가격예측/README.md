# Kaggle - 주택 가격 예측


## 개요
### 1. 상세설명
* 아이오와주 에임스에 있는 주거용 주택의 거의 모든 측면을 설명하는 79개의 설명 변수를 학습시켜 각 주택의 최종 가격을 예측해야 합니다.

### 2. 데이터셋 구성
* train.csv : 훈련 세트
* test.csv : 테스트 세트
* data_description.txt : 각 열에 대한 전체 설명
* sample_submission.csv : 판매 연도 및 월, 부지 면적 및 침실 수에 대한 정보 예측해야 할 데이터

### 3. 규칙
* Random Forest 및 Gradient Boosting과 같은 고급 회귀 기술를 사용해야 합니다.
* R 과 Python을 사용하여야 합니다.

### 4. 참가
* 인원 : 1명
* 작업툴 : python, VScode, Jupeter Notebook
* 기간 : 20.06.08 ~ 20.08.21

## 프로그램 코드 설명
### 1. 라이브러리 및 데이터 불러오기
#### 1-1. 데이터 처리를 위한 패키지와 모듈 불러오기
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

#### 1-2. 데이터 불러오기
```python
train = pd.read_csv('/Users/mac/Desktop/house_project/data/train.csv')
test = pd.read_csv('/Users/mac/Desktop/house_project/data/test.csv')
```

#### 1-2. train 파일 데이터에서 상위 5개를 불러오기
```python
train.head(5)
```
<img src="https://user-images.githubusercontent.com/60723495/83249507-a4a1c480-a1e1-11ea-8249-1c6ea5465b49.png" width="1000" height="200">

#### 1-3. test 파일 데이터에서 상위 5개 불러오기
```python
test.head(5)
```
<img src="https://user-images.githubusercontent.com/60723495/83250803-a8cee180-a1e3-11ea-94dc-7801312516a5.png" width="1000" height="200">

#### 1-4. 각각의 DataFrame의 size를 출력 / 각각 DataFrame에서 맨앞의 id를 삭제한 후의 size를 출력
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

### 2. Data Processing
#### 2-1. GrLivArea 와 SalePrice 간의 그래프를 출력
```python
fig, ax = plt.subplots()
ax.scatter(x=train['GrLivArea'], y=train['SalePrice'])
plt.ylabel('SalePrice', fontsize=13)
plt.xlabel('GrLivArea', fontsize=13)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344400-3a079a80-a341-11ea-8ce1-1f3456b2f6d4.png" width="300" height="200">

* SalePrice(주택 가격) 와 GrLivArea(생활면적크기)는 상식적으로 서로에게 영향을 미칠 것으로 예상이 됩니다.
* GrLivArea가 커져도 가격이 오르지 않는 특이치가 발생하는 것을 볼 수 있습니다.

#### 2-2. GrLivArea 와 SalePrice 간의 이상치를 제거하고 그래프를 출력
```python
train = train.drop(train[(train['GrLivArea'] > 4000) & (train['SalePrice'] < 300000)].index)
fig, ax = plt.subplots()
ax.scatter(train['GrLivArea'], train['SalePrice'])
plt.ylabel('SalePrice', fontsize = 13)
plt.xlabel('GrLivArea', fontsize =13)
plt.show()
```
<img src="https://user-images.githubusercontent.com/60723495/83344412-9bc80480-a341-11ea-9943-dc2601582441.png" width="300" height="200">

* 이러한 특이치는 SalePrice를 예측하는 데 안좋은 영향을 끼칠 것으로 사료되어 제거하였습니다.

#### 2-3. 대상 변수인 SalePrice를 관한 빈도수와 오차 분포를 나타낸 그래프를 출력
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

* 대상 변수인 SalePrice에 대한 빈도수와 오차 분포를 그래프로 이루고 있습니다.
* 기준이 되는 정규성을 가지는 그래프와 비교하여 분석합니다.
* 빈도수는 한쪽으로 치우치는 증상을 보이고 오차의 분포는 많은 차이를 보이고 있습니다.
* 정규성과 비교하기 쉽게 대상 변수에 대한 정규화를 필요로 해보입니다.

#### 2-4. 대상 변수인 SalePrice를 관한 빈도수와 오차 분포를 로그변환하여 나타낸 그래프를 출력
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

* 로그변환 : 정규성을 높이고 분석(회귀 분석 등)에서 정확한 값을 얻기 위해서 사용합니다, 즉 정규 분포가 아닌 것을 정규 분포에 가깝게 만드는 변환입니다. 

#### 2-5. 대상 변수인 SalePrice를 제외한 Dataframe을 구성
```python
ntrain = train.shape[0]
ntest = test.shape[0]
y_train = train.SalePrice.values
all_data = pd.concat((train, test)).reset_index(drop=True)
all_data.drop(['SalePrice'], axis=1 , inplace=True)
print('all_data size is : {}'.format(all_data.shape))
```
#### 2-6. 각각의 변수에 값이 존재하지 않는 개수를 세어서 변수 안의 전체 개수를 나누어서 100을 곱해서 missing ratio 출력
```python
all_data_na = (all_data.isnull().sum() / len(all_data)) * 100
all_data_na = all_data_na.drop(all_data_na[all_data_na == 0].index).sort_values(ascending=False)[:30]
missing_data = pd.DataFrame({'Missing Ratio' : all_data_na})
missing_data.head(20)
```
<img src="https://user-images.githubusercontent.com/60723495/83344886-d0d75580-a347-11ea-9bfb-dd4d2f71ddb8.png" width="300" height="1000">

#### 2-7. missing ratio를 토대로 막대 그래프화 시켜 출력
```python
f, ax = plt.subplots(figsize = (10, 10))
plt.xticks(rotation = '90')
sns.barplot(x=all_data_na.index, y=all_data_na)
plt.xlabel('Features', fontsize = 15)
plt.ylabel('Percent of missing values', fontsize = 15)
plt.title('Percent missing data by feature', fontsize = 15)
```
<img src="https://user-images.githubusercontent.com/60723495/83344918-34fa1980-a348-11ea-8e19-6ca22749e3e0.png" width="500" height="500">

#### 2-8. 각각의 변수간에 상관성을 분석한 그래프 출력
```python
corrmat = train.corr()
plt.subplots(figsize=(12,9))
sns.heatmap(corrmat, vmax=0.9, square=True)
```
<img src="https://user-images.githubusercontent.com/60723495/83344966-b6ea4280-a348-11ea-99ee-933b14bd4e68.png" width="600" height="500">

* 데이터 Columns별 상관성을 분석한 그래프
* 상관성이 있다고 해서 무조건으로 믿을 수 없는 자료

#### 2-9. 각각의 변수의 missing data를 각각 변수의 형식에 맞추어서 값을 None과 0, mode(0)으로 채우거나 삭제
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

#### 2-10. 다시 한번더 missing ratio를 출력하면 아무런 값이 나오지 않게 됩니다.
```python
all_data_na = (all_data.isnull().sum() / len(all_data)) * 100
all_data_na = all_data_na.drop(all_data_na[all_data_na == 0].index).sort_values(ascending = False)
missing_data = pd.DataFrame({'Missing Ratio' : all_data_na})
missing_data.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83345083-febd9980-a349-11ea-8e75-0c1daab79bf9.png" width="300" height="100">

#### 2-11. 각각의 변수중 변수의 형식을 계산하기 편하게 변환
```python
all_data['MSSubClass'] = all_data['MSSubClass'].apply(str)
all_data['OverallCond'] = all_data['OverallCond'].astype(str)
all_data['YrSold'] = all_data['YrSold'].astype(str)
all_data['MoSold'] = all_data['MoSold'].astype(str)
```
#### 2-12. LabelEncoder를 통하여 변수의 형식이 String인 문자를 수치화하고, 각각 변수에 항목들을 리스트화하여 변수로 저장
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

#### 2-13. 분포도가 한쪽으로 치우치는 않았는 지 확인하여 정규화가 필요한지 판단
```python
numeric_feats = all_data.dtypes[all_data.dtypes != 'object'].index
skewed_feats = all_data[numeric_feats].apply(lambda x: skew(x.dropna())).sort_values(ascending = False)
print('\nSkew in numerical features: \n')
skewness = pd.DataFrame({'skew' : skewed_feats})
skewness.head(10)
```

#### 2-14. 로그변환이 아닌 Box_Cox변환을 사용
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

#### 2-15. 처리되어진 각각의 값을 변수에 저장
```python
train = all_data[:ntrain]
test = all_data[:ntest]
```

### 3. 모델링

#### 3-1. 모델링을 위한 라이브러리 불러오기
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


#### 3-2. Lasso Regularization
```python
lasso = make_pipeline(RobustScaler(), Lasso(alpha=0.0005, random_state=1))
```

#### 3-3. Elastic Net Regularization
```python
ENet = make_pipeline(RobustScaler(), ElasticNet(alpha=0.0005, l1_ratio= .9, random_state=3))
```

#### 3-4. Ridge Regularization
```python
KRR = KernelRidge(alpha=0.6, kernel='polynomial', degree=2, coef0=2.5)
```

#### 3-5. Gradient Boost Regularization
```python
GBoost = GradientBoostingRegressor(n_estimators=3000, learning_rate=0.05, max_depth=4, max_features=
'sqrt', min_samples_leaf=15, min_samples_split=10, loss='huber', random_state=5)
```

#### 3-6. Xgboost Regularization
```python
model_xgb = xgb.XGBRegressor(colsample_bytree=0.4603, gamma=0.0468, learning_rate=0.05, max_depth=3,min_child_weight=1.7817, n_estimators=2200, reg_alpha=0.4640, reg_lambda=0.8571, subsample=0.5213, silent=1, random_state=7, nthread=-1)
```
    
#### 3-7. LightGBM Regularization
```python
model_lgb = lgb.LGBMRegressor(objective='regression',num_leaves=5,learning_rate=0.05, n_estimators=720, max_bin=55, bagging_fraction=0.8 , bagging_freq=5, feature_fraction=0.2319, feature_fraction_seed=9, bagging_seed=9, min_data_in_leaf=6, min_sum_hessian_in_leaf=11)
```  
    
#### 3-8. 각각의 모델로 구해지는 RMSLE의 중간값과 평균을 출력
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

#### 3-9. 여러개의 기본 모델의 평균화를 시키는 클래스 
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

#### 3-10. 클래스에 넣어서 위의 4개의 모델(ElasticNet 과 GradientBoost, kernel Ridge, lasso)의 RMSLE 값을 평균화하여 출력
```python
averaged_models = AveragingModels(models=(ENet, GBoost, KRR, lasso))
score = rmsle_cv(averaged_models)
print('Averaged base models score : {:.4f} ({:.4f})\n'.format(score.mean(),score.std()))
>>> Averaged base models score : 0.1087 (0.0077)
```

#### 3-11. Stacking 기법을 사용하여 평균화 시키는 클래스
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

#### 3-12. Stacking 기법을 사용하기위해 base_models를 ElasticNet 과 GradientBoost, Kernel Ridge로 meta_model에 lasso를 넣어 평준화
```python
stacked_averaged_models = StackingAveragedModels(base_models=(ENet, GBoost, KRR), meta_model= lasso)
score = rmsle_cv(stacked_averaged_models)
print('Stacking Averaged models score : {:.4f} ({:.4f})'.format(score.mean(),score.std()))
>>> Stacking Averaged models score : 0.1081 (0.0073)
```

#### 3-13. RMSLE를 구해주는 함수 
```python
def rmsle(y, y_pred) : 
    return np.sqrt(mean_squared_error(y, y_pred))
```

#### 3-14. Stacking 기법으로 RSMLE를 출력
```python
stacked_averaged_models.fit(train.values, y_train)
stacked_train_pred = stacked_averaged_models.predict(train.values)
stacked_pred = np.expm1(stacked_averaged_models.predict(test.values))
print(rmsle(y_train, stacked_train_pred))
>>> 0.07839506096666429
```

#### 3-15. Xgboost 모델로 RSMLE를 출력
```python
model_xgb.fit(train, y_train)
xgb_train_pred = model_xgb.predict(train)
xgb_pred = np.expm1(model_xgb.predict(test))
print(rmsle(y_train, xgb_train_pred))
>>> 0.0786103062413744
```

#### 3-16. LightGBM 모델로 RSMLE를 출력
```python
model_lgb.fit(train, y_train)
lgb_train_pred = model_lgb.predict(train)
lgb_pred = np.expm1(model_lgb.predict(test.values))
print(rmsle(y_train, lgb_train_pred))
>>> 0.07226288640876002
```

#### 3-17. 위에 3개 모델의 RSMLE를 퍼센트로 나누어 더하여 출력
```python
print('RMSLE score on train data : ')
print(rmsle(y_train, stacked_train_pred*0.80 + xgb_train_pred*0.10 + lgb_train_pred*0.10))
>>> RMSLE score on train data : 0.07559500505171629
```
* 이렇게 가중치를 나눈 이유는 LightGBM과 Xgboost보다 stacking기법의 값이 RSMLE 제일 낮은 평균화된 값을 가지기 때문입니다.

#### 3-18. 변수에 저장
```python
ensemble = stacked_pred*0.80 + xgb_pred*0.10 + lgb_pred*0.10
```

#### 3-19. test.csv의 id를 토대로 값을 SalePrice의 값에 넣어서 submission.csv에 저장
```python
sub = pd.DataFrame()
sub['id'] = test_ID
sub['SalePrice'] = ensemble
sub.to_csv('data/submission.csv',index=False)
```
