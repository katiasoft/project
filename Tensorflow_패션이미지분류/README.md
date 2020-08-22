# Tensorflow를 사용한 패션 이미지 분류하기

## 목표
* 패션 MNIST 데이터를 받아와 운동화나 셔츠 같은 옷 이미지를 분류하는 신경망 모델을 훈련합니다.

## 설명
* 인원 : 1명
* 작업툴 : Python, Tensorflow, Numpy, matplotlib, colab등

## 데이터
* train_images : 모델 학습에 사용하는 image 훈련세트 
* train_labels : 모델 학습에 사용하는 label 훈련세트 
* test_images : 모델 테스트에 사용되는 image 테스트세트
* test_labels : 모델 테스트에 사용되는 label 테스트세트

## 프로그래밍

### 1. 라이브러리 import하기
```python
import tensorflow as tf
from tensorflow import  keras

import numpy as np
import matplotlib.pyplot as plt
```

### 2. 패션 MNIST 데이터셋 import하기
#### 2.1)
```python 
fashion_mnist = keras.datasets.fashion_mnist

(train_images, train_labels), (test_images, test_labels) = fashion_mnist.load_data()
```
* load_data() 함수를 호출하면 네개의 numpy 배열이 반환됩니다.
* train_images와 train_labels 배열은 모델 학습에 사용하는 훈련세트입니다.
* test_images와 test_labels 배열은 모델 테스트에 사용되는 테스트세트입니다.
* image는 28x28 크키의 numpy배열이고 픽셀 값은 0~255 입니다.
* label은 0~9까지의 정수 배열입니다. 
#### 2.2)
```python 
class_names = ['T-shirt/top', 'Trouser', 'Pullover', 'Dress', 'Coat', 'Sandal', 'shirt', 'Sneaker', 'Bag', 'Ankle boot']
```
* label의 정수배열에 맞게 매핑할 수 있는 class_names 의 배열을 만들어 줍니다.

### 3. 데이터 탐색하기
#### 3.1)
```python 
train_images.shape
>> (60000, 28, 28)
```
* 훈련세트는 60000개의 image가 있으며, 28x28 픽셀로 표현됩니다.
#### 3.2)
```python 
len(train_labels)
>> 60000
```
* 훈련세트는 60000개의 label이 가지고 있습니다.
#### 3.3)
```python 
train_labels
>> array([9, 0, 0, ..., 3, 0, 5], dtype=uint8)
```
* 훈련세트는 label은 0~9의 정수로 이루어집니다.
#### 3.4)
```python 
test_images.shape
>> (10000, 28, 28)
```
* 테스트 세트는 10000개의 image가 있으며, 28x28 픽셀로 표현됩니다.
#### 3.5)
```python 
len(test_labels)
>> 10000
```
* 테스트 세트는 10000개의 label이 가지고 있습니다.

### 4. 데이터 전처리하기
#### 4.1)
```pyton
plt.figure()
plt.imshow(train_images[0])
plt.colorbar()
plt.grid(False)
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90951778-c89b3c00-e498-11ea-9121-546c9f26e7e2.PNG" width="250" height="200">

* 첫 번째 이미지를 보면 픽셀 값의 범위가 0~255 사이라는 것을 알 수 있습니다.

#### 4.2)
```python
train_images = train_images / 255.0
test_images = test_images / 255.0
```
* 신경망 모델에 주입하기전에 픽셀 값의 범위를 0~1 사이로 조정해줄 필요가 있습니다.
* 훈련 세트와 테스트 세트에 255.0으로 나누어줍니다.

#### 4.3)
```python 
plt.figure(figsize=(10,10))
for i  in range(25) :
    plt.subplot(5,5,i+1)
    plt.xticks([])
    plt.yticks([])
    plt.grid(False)
    plt.imshow(train_images[i], cmap=plt.cm.binary)
    plt.xlabel(class_names[train_labels[i]])
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90951822-50814600-e499-11ea-821c-3772bc406b21.PNG" width="550" height="550">

* 훈련 세트에서 25개의 이미지와 class_name을 출력해보겠습니다.
