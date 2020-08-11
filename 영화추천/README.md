
# 영화 추천 프로그램


## 1. 활용할 라이브러리와 패키지 불러오기
```python
%matplotlib inline
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy import stats 
from ast import literal_eval
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from nltk.stem.snowball import SnowballStemmer 
from nltk.stem.wordnet import WordNetLemmatizer
from nltk.corpus import wordnet
from surprise import Reader, Dataset, SVD, accuracy
from surprise.model_selection import cross_validate
from surprise.model_selection import KFold
import warnings; warnings.simplefilter('ignore')
```
   - %matplotlib inline : Jupyter 와 같은 IPython에서 matplotlib으로 plot을 만드는 데 사용한다.
   - pandas : 데이터 조작과 분석에 쓰이는 라이브러리
   - numpy : 행렬이나 다차원배열을 처리하는 라이브러리
   - matplotlib : plot을 생성을 지원하는 라이브러리
   - seaborn : matplotlib을 기반으로 다양한 색상 테마와 통계용 차트 등의 기능을 추가한 시각화 패키지
   - scipy.stats : 과학기술계산용 함수안에 통계부분
   - ast.literal_eval : 문법을 구조화 시켜주는 모듈로 string안에 dict를 다시 구조화한다.
   - sklearn.feature_extraction.text : 문서 전처리용 클래스 제공
     + CountVectorizer : 문서 집합에서 단어 토큰을 생성하고 각 단어의 수를 세어 Bow 인코딩한 벡터를 만든다.
     + TfidfVectorizer : CountVectorizer와 비슷하지만 TF-IDF 방식으로 단어의 가중치를 조정한 Bow 벡터를 만든다
   - sklearn.metrics.pairwise : 벡터 배열 X와 선택적 Y에서 거리 행렬을 처리하는 라이브러리
     + linear_kernel : X와 Y 사이의 선형 커널을 계산
     + cosine_silmilarity : X와 Y의 샘플 간 코사인 유사성을 계산
   - nltk.stem.snowball.SnowballStemmer : 눈덩이 형태소 분석기(영어 외의 13개 국가의 언어에 대한 stemming을 지원)
   - nltk.stem.wordnet.WordNetLemmatizer : stemmer처럼 형태소를 분석하지만 설정에 따라 동사, 복수명사등을 출력할 수 있다.
   - nltk.corpus.wordnet : 영어 용 어휘 데이터베이스이며 nltk corpuss의 일부
   - surprise : 명시적인 등급 데이터를 처리하는 추천시스템을 구축하고 분석하는 scikit
     + SVD : 특이값 분해(행렬을 특정한 구조로 분해하는 방식) 알고리즘
     + accurancy : rmse, mae등을 계산할 때 사용
   - surprise.model_selection.cross_validate : 교차 유효성 검사
   - surprise.model_selection.Kfold : fold를 나눌 때 사용되는 라이브러리
  
  
  
## 2. Data Processing
#### 2-1) 데이터 정보
* movies_metadata.csv : 주요 영화 메타 데이터 파일. Full MovieLens 데이터 세트에 소개 된 45,000 개의 영화에 대한 정보가 포함되어 있습니다. 포스터, 배경, 예산, 수익, 출시일, 언어, 생산 국가 및 회사 등의 기능이 있습니다.
* keyword.csv : MovieLens 영화에 대한 영화 플롯 키워드가 들어 있습니다. 문자열 화 된 JSON 객체의 형태로 제공됩니다.
* credits.csv : 모든 영화에 대한 출연진 및 승무원 정보로 구성됩니다. 문자열 화 된 JSON 객체의 형태로 제공됩니다.
* links.csv : Full MovieLens 데이터 세트에 포함 된 모든 영화의 TMDB 및 TMDB ID가 포함 된 파일입니다.
* links_small.csv : 전체 데이터 세트의 9,000 개 영화로 구성된 작은 하위 집합의 TMDB 및 TMDB ID를 포함합니다.
* ratings_small.csv : 9,000 개의 영화에서 700 명의 사용자가 평가 한 100,000 개의 하위 집합. 



#### 2-2) 데이터 불러오기
```python
md = pd.read_csv('movies_metadata.csv')
md.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83372988-f6289a00-a401-11ea-9eb5-b6a9e7df6b32.png" width="1000" height="450">



#### 2-3) genres 데이터 변환
```python
md['genres'] = md['genres'].fillna('[]').apply(literal_eval).apply(lambda x: [i['name'] for i in x] if isinstance(x, list) else [])
md.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83373200-7bac4a00-a402-11ea-8b1d-c254ec9c2197.png" width="1000" height="450">



#### 2-4) vote_counts와 vote_averages에 missing Data 처리 후에 cloumn인 vote_count와 vote_average 각각의 열을 저장(C는 vote_averages의 평균)
```python
vote_counts = md[md['vote_count'].notnull()]['vote_count'].astype('int')
vote_averages = md[md['vote_average'].notnull()]['vote_average'].astype('int')
C = vote_averages.mean()
print(C)
>>> 5.244896612406511
```



#### 2-5) vote_counts의 0.95분위에 있는 수 구하기
```python
m = vote_counts.quantile(0.95)
print(m)
>>> 434.0
```



#### 2-6) release_date의 값에서 년도만을 추출해서 year이라는 column을 추가하여 Dataframe에 나타낸다.
```python
md['year'] = pd.to_datetime(md['release_date'], errors = 'coerce').apply(lambda x: str(x).split('-')[0] if x != np.nan else np.nan)
print(md['year'])
```  
<img src="https://user-images.githubusercontent.com/60723495/83373742-5e787b00-a404-11ea-8e87-6df29162e944.png" width="300" height="350">



#### 2-7) vote_count에서 0.95 분위의 수보다 크고 missing Data가 아니면서 데이터 형변환한 Dataframe 출력
```python
qualified = md[(md['vote_count'] >= m) & (md['vote_count'].notnull()) & (md['vote_average'].notnull())][['title','year', 'vote_count', 'vote_average', 'popularity', 'genres']]
qualified['vote_count'] = qualified['vote_count'].astype('int')
qualified['vote_average'] = qualified['vote_average'].astype('int')
print(qualified.shape)
qualified.head()
>>> (2274, 6)
```
<img src="https://user-images.githubusercontent.com/60723495/83374033-566d0b00-a405-11ea-8457-dc5f0ac0d6f9.png" width="1000" height="200">



#### 2-8) 가중 등급(WR) = (v/(v+m)*R)+(m/(v+m)*C)을 구하는 함수를 만들고 Dataframe의 column으로 추가하고 출력
```python
def weight_rating(x):
    v = x['vote_count']
    R = x['vote_average']
    return (v/(v+m) * R) + (m/(m + v) * C)
qualified['wr'] = qualified.apply(weight_rating, axis = 1)
qualified.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83374270-15292b00-a406-11ea-8778-d6495f8b2c3f.png" width="1000" height="200">



#### 2-9) 가중등급을 기준으로 내림차순 정렬을 하고 상위 250개를 저장하고 상위의 15개를 출력(Top Movie Dataframe 생성)
```python
qualified = qualified.sort_values('wr', ascending = False).head(250)
qualified.head(15)
```
<img src="https://user-images.githubusercontent.com/60723495/83374423-94b6fa00-a406-11ea-9911-b8c8b351b2e3.png" width="1000" height="500">
