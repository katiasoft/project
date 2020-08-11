# Kaggle - 주택 가격 예측



## 1.



## 2. 프로그램 설명
#### 2-1) 라이브러리 및 데이터 불러오기
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

#### 2-2) Data 전처리
* GrLivArea 와 SalePrice 간의 그래프를 출력
```python
fig, ax = plt.subplots()
ax.scatter(x=train['GrLivArea'], y=train['SalePrice'])
plt.ylabel('SalePrice', fontsize=13)
plt.xlabel('GrLivArea', fontsize=13)
plt.show()
```
    + SalePrice(주택 가격) 와 GrLivArea(생활면적크기)는 상식적으로 서로에게 영향을 미칠 것으로 예상이 된다.
    + GrLivArea가 커져도 가격이 오르지 않는 특이치가 발생하는 것을 볼 수 있다.
<img src="https://user-images.githubusercontent.com/60723495/83344400-3a079a80-a341-11ea-8ce1-1f3456b2f6d4.png" width="300" height="200">


