
# 영화 추천 프로그램
## 개요
### 1. 상세설명
* 넷플릭스나 IPTV에서 영화나 드라마를 추천해주는 알고리즘을 머신러닝을 사용하여 총 3가지의 방법으로 재현 해보기

### 2. 데이터셋 구성
* credits.csv : 영화에 대한 출연진 및 제작진 정보
* keyword.csv : 영화에 대한 영화 플롯 키워드
* links.csv : 영화의 TMDB 및 IMDB ID
* links_small.csv : 전체 데이터 세트의 9,000 개 영화 중 작은 하위 집합의 TMDB 및 IMDB ID
* movie_metadata.csv : 기본 영화 메타 데이터 파일
* ratings.csv : 영화에 대한 700 명의 사용자가 평가
* ratings_small.csv : 9,000 편의 영화에 대한 700 명의 사용자가 평가 한 100,000 개의 하위 집합

### 3. 참가
* 인원 : 1명
* 작업툴 : Python, VScode, Jupeter Notebook, Pandas, Numpy등
* 기간 : 20.06.22 ~ 20.06.28

## 프로그래밍 설명

### 1. 활용할 라이브러리와 패키지 불러오기
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
   - %matplotlib inline : Jupyter 와 같은 IPython에서 matplotlib으로 plot을 만드는 데 사용합니다.
   - pandas : 데이터 조작과 분석에 쓰이는 라이브러리
   - numpy : 행렬이나 다차원배열을 처리하는 라이브러리
   - matplotlib : plot을 생성을 지원하는 라이브러리
   - seaborn : matplotlib을 기반으로 다양한 색상 테마와 통계용 차트 등의 기능을 추가한 시각화 패키지
   - scipy.stats : 과학기술계산용 함수안에 통계부분
   - ast.literal_eval : 문법을 구조화 시켜주는 모듈로 string안에 dict를 다시 구조화합니다.
   - sklearn.feature_extraction.text : 문서 전처리용 클래스 제공
     + CountVectorizer : 문서 집합에서 단어 토큰을 생성하고 각 단어의 수를 세어 Bow 인코딩한 벡터를 만듭니다.
     + TfidfVectorizer : CountVectorizer와 비슷하지만 TF-IDF 방식으로 단어의 가중치를 조정한 Bow 벡터를 만듭니다
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
  
  
  
### 2. Data Processing
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



#### 2-6) release_date의 값에서 년도만을 추출해서 year이라는 column을 추가하여 Dataframe에 나타냅니다.
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



### 3. 콘텐츠 기반 필터링(content based filtering)

#### 3-1) 다음을 기반으로 두개의 컨텐츠 기반으로 구축
* 동영상 개요 및 태그 라인
* 영화 출연진, 제작진, 키워드 및 장르
* 모든 영화의 정보보다 일부를 가져와서 사용



#### 3-2) 각 영화별의 장르가 여러개로 구성되어져있다, 이러한 것을 세분화 하여 새로운 Dataframe에 저장하여 출력
```python
s = md.apply(lambda x: pd.Series(x['genres']), axis = 1).stack().reset_index(level = 1, drop = True)
s.name = 'genre'
gen_md = md.drop('genres',axis = 1).join(s)
gen_md.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83378294-478d5500-a413-11ea-9230-2ae5cc135d3c.png" width="1000" height="550">



#### 3-3) 장르를 키워드로 받아서 가중치등급으로 내림차순 정렬한 Top250을 Dataframe을 생성하여 리턴 해주는 함수
```python
def build_chart(genre, percenttile = 0.85) : 
    df = gen_md[gen_md['genre'] == genre]
    vote_counts = df[df['vote_count'].notnull()]['vote_count'].astype('int')
    vote_averages= df[df['vote_average'].notnull()]['vote_average'].astype('int')
    C = vote_averages.mean()
    m = vote_counts.quantile(percenttile)
    qualified = df[(df['vote_count'] >= m) & (df['vote_count'].notnull()) & (df['vote_average'].notnull())][['title', 'year', 'vote_count', 'vote_average', 'popularity']]
    qualified['vote_count'] = qualified['vote_count'].astype('int')
    qualified['vote_average'] = qualified['vote_average'].astype('int')    
    qualified['wr'] = qualified.apply(lambda x: (x['vote_count']/(x['vote_count'] + m) * x['vote_average']) + (m / (m + x['vote_count']) * C), axis = 1)
    qualified = qualified.sort_values('wr', ascending = False).head(250)
    return qualified
```

#### 3-4) 'Romance'라는 장르에서 Top 15를 출력
```python
build_chart('Romance').head(15)
```
<img src="https://user-images.githubusercontent.com/60723495/83378576-12353700-a414-11ea-834f-35cd4d980895.png" width="1000" height="450">



#### 3-5) 콘텐츠 기반 추천 시작 부분 - link_small.csv 파일을 links_small이란 Dataframed에 저장하고 TMDB ID의 missing Data 처리와 형변환한 값을 Dataframe에 다시 저장
```python
links_small = pd.read_csv('links_small.csv')
links_small = links_small[links_small['tmdbId'].notnull()]['tmdbId'].astype('int')
```



#### 3-6) Movie_data의 데이터가 너무 커서 축소하여 새로운 Dataframe 생성(Id 형변환하여 links_samll Id와 비교하여 일치하는 곳에 'tmdbId' column을 생성하고 값을 추가)
```python
md = md.drop([19730, 29503, 35587])
md['id'] = md['id'].astype('int')
smd = md[md['id'].isin(links_small)]
smd.shape
smd.head()
>>> (9099, 25)
``` 
<img src="https://user-images.githubusercontent.com/60723495/83381216-0731d500-a41b-11ea-8798-392c7dd644cb.png" width="1000" height="450">



#### 3-7) Dataframe 'smd'안의 column인 'tagline'의 missing Data에 ' '의 값을 넣고 'overview'의 column과 합쳐서 column 'description'에 저장하고 'description'의 missing data에 ' '의 값으로 채우기
```python
smd['tagline'] = smd['tagline'].fillna('')
smd['description'] = smd['overview'] + smd['tagline']
smd['description'] = smd['description'].fillna('')
```



#### 3-8) Dataframe 'smd'을 Tfid벡터화시켜서 matrix(행렬화)하고 tfidf_matrix에 저장하고 사이즈 출력
```python
tf = TfidfVectorizer(analyzer='word', ngram_range=(1, 2), min_df=0, stop_words='english')
tfidf_matrix = tf.fit_transform(smd['description'])
tfidf_matrix.shape
>>> (9099, 268124)
```



#### 3-9) 변수 cosine_sim에 tfidf_matrix와 tfidf_matrix사이의 선형 커널을 계산하여 저장(첫번째 행의 값 출력)
```python
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
cosine_sim[0]
>>> array([1.        , 0.00680476, 0.        , ..., 0.        , 0.00344913,
       0.        ])
```



#### 3-10) Dataframe 'smd'에 인덱스를 부여하고 'titles'에 'smd'의 column인 'title'을 저장하고 'indices'에 Series를 생성('smd'의 인덱스를 기본으로 한 'smd'의 column인 'title'을 값으로 하여)
```python
smd = smd.reset_index()
titles = smd['title']
indices = pd.Series(smd.index, index=smd['title'])
```



#### 3-11) title를 입력 받아서 title의 index를 찾고 index를 기반하여 cosine유사성을 list화하여 sim_scores에 저장하고 오름차순으로 정렬하고 인덱스 1번부터 30번까지 슬라이싱하여 저장하고 'movie_indices'에 index를 차례대로 리스트화하여 titles에서 index를 'movie_indices'값을 기초로 하여 찾아서 리턴시켜주는 함수
```python
def get_recommendations(title) :
    idx = indices[title]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:31]
    movie_indices = [i[0] for i in sim_scores]
    return titles.iloc[movie_indices]
```



#### 3-12) 영화 제목이 'The Godfather'와 'The Dark Knight'와 유사한 영화 10개씩 출력
```python
get_recommendations('The Godfather').head(10)
```
<img src="https://user-images.githubusercontent.com/60723495/83383288-c7212100-a41f-11ea-89db-69b939776809.png" width="400" height="300">

```python
get_recommendations('The Dark Knight').head(10)
```
<img src="https://user-images.githubusercontent.com/60723495/83383426-10717080-a420-11ea-9fb7-ffe75a45ae23.png" width="600" height="300">



### 4. 협업 필터링(Collaborative filtering)


#### 4-1) RMSE(Root Mean Square Error)를 최소화하고 훌륭한 추천을 하기 위해 SVD(Single Value Discovery)와 같은 매우 강력한 알고리즘을 사용했던 서프라이즈 라이브러리를 사용합니다.



#### 4-2) 'reader'에 Reader함수를 저장하고 Dataframe 'ratings'에 rationgs_small.csv를 불러와 저장하고 출력
```python
reader = Reader()
ratings = pd.read_csv('ratings_small.csv')
ratings.head()
```
<img src="https://user-images.githubusercontent.com/60723495/83468966-4d3d7600-a4b9-11ea-8dbe-feddf32690bb.png" width="300" height="150">




#### 4-3) 'data'에 Dataframe 'ratings'의 column인 'userId'와 'movieId', 'rating'을 Reader함수를 적용하여 Dataset으로 저장
```python
data = Dataset.load_from_df(ratings[['userId', 'movieId', 'rating']], reader)
```



#### 4-4) 'svd'에 SVD함수를 저장(SVD : 특이값 분해 알고리즘)
```python
svd = SVD()
```



#### 4-5) cross_validate함수를 활용하여 fold를 5개로 나눈 각각의 RMSE와 MAE를 구하고 평균값과 오차를 보여줍니다.
```python
cross_validate(svd, data, measures=['RMSE', 'MAE'], cv=5, verbose=True)
```
<img src="https://user-images.githubusercontent.com/60723495/83470485-3dc02c00-a4bd-11ea-966d-4f3aeba9c400.png" width="800" height="150">



#### 4-6) 'trainset'에 fold를 나누지 않은 Dataset 'data'를 저장하고 svd에서 활용할 Dataset을 'trainset'으로 설정
```python
trainset = data.build_full_trainset()
svd.fit(trainset)
```



#### 4-7) Dataframe 'ratings'의 column 'userId' value가 1인 값을 출력
```python
ratings[ratings['userId'] == 1]
``` 
<img src="https://user-images.githubusercontent.com/60723495/83471552-eec7c600-a4bf-11ea-83e9-0f14f40ea787.png" width="300" height="500">




#### 4-8) userId가 1를 movieId가 302일때 실제등급이 3등급이라고 설정하고 svd를 작동시켜봅니다.
```python
svd.predict(1, 302, 3)
>>> Prediction(uid=1, iid=302, r_ui=3, est=2.594896522839313, details={'was_impossible': False})
```



#### 4-9) 협업필러링으로 동작해보았는데 8번의 결과처럼 ID가 302인 영화의 경우 2.594으로 예상되고, 한 가지 놀라운 특징은 영화가 무엇인지(또는 그 안에 무엇이 들어있는지) 상관하지 않는다는 것입니다. 그것은 순전히 할당된 영화 ID에 근거하여 작동하며, 다른 사용자들이 어떻게 영화를 예측했는지에 따라 등급을 예측합니다.



### 5. Hybrid Recommend System


#### 5-1) 콘텐츠와 협업 필터링을 통해 아이디어를 모아 특정 사용자에게 영화 제안을 하는 System을 구축합니다.



#### 5-2) 함수 'convert_int'는 x을 받아서 오류가 발생하지 않으면 int로 형변환을 시켜고 리턴 하고, 오류가 발생하면 nan이라는 값을 리턴하는 함수입니다.
```python
def convert_int(x):
    try:
        return int(x)
    except:
        return np.nan
```



#### 5-3) Datafreme 'id_map'에 links_small.csv 파일의 'movieId'와 'tmdbId'를 불러와서 저장하고 'tmdbID'를 형변환 시키고 이름을 'id' 바꾸어줍니다. Dataframe 'smd'의 column 'title'와 'id'을 'id'를 기준으로 'title'을 추가
```python
id_map = pd.read_csv('links_small.csv')[['movieId', 'tmdbId']]
id_map['tmdbId'] = id_map['tmdbId'].apply(convert_int)
id_map.columns = ['movieId', 'id']
id_map = id_map.merge(smd[['title', 'id']], on='id').set_index('title')
```



#### 5-4) 'indices_map'에 Dataframe 'id_map'의 column 'id'를 저장
```python
indices_map = id_map.set_index('id')
```



#### 5-5) 함수 'hybrid'는 userId와 title을 받아서 title의 index를 'idx'에 저장하고 Dataframe 'id_map'에서 title을 기반으로 id를 'tmdbId'에 저장하고 title을 기반으로 movieId를 'movie_id'에 저장하고 cosine유사성을 측정하고 리스트화 시켜서 오름차순으로 정렬하고 index 1번부터 25번까지 슬라이싱하여 'sim_scores'에 저장합니다, sim_scores의 id를 토대로 'movies'에 'title' , 'vote_count', 'vote_average', 'year', 'id'를 저장하고 협업필터링에서 예상 등급 구하는 값을 추가하여 내림차순으로 재배열하여 Top10를 리턴하여 다. 
```python
def hybrid(userId, title):
    idx = indices[title]
    tmdbId = id_map.loc[title]['id']
    movie_id = id_map.loc[title]['movieId']
    sim_scores = list(enumerate(cosine_sim[int(idx)]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:26]
    movie_indices = [i[0] for i in sim_scores]  
    movies = smd.iloc[movie_indices][['title', 'vote_count', 'vote_average', 'year', 'id']]
    movies['est'] = movies['id'].apply(lambda x: svd.predict(userId, indices_map.loc[x]['movieId']).est)
    movies = movies.sort_values('est', ascending=False)
    return movies.head(10)
```



#### 5-6) userId가 1번이고 영화 'Avatar'와 비슷한 영화 추천
```python
hybrid(1, 'Avatar')
```
<img src="https://user-images.githubusercontent.com/60723495/83473939-b9be7200-a4c5-11ea-925b-e5d7a34bf6ae.png" width="800" height="350">



#### 5-7) userId가 500번이고 영화 'Avatar'와 비슷한 영화 추천
```python
hybrid(500, 'Avatar')
```
<img src="https://user-images.githubusercontent.com/60723495/83474071-0efa8380-a4c6-11ea-914f-033ef5f7503b.png" width="800" height="350">
