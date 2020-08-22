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

### 5. 모델 구성하기
#### 5.1)
```python 
model = keras.Sequential([
                          keras.layers.Flatten(input_shape = (28,28)),
                          keras.layers.Dense(128, activation='relu'),
                          keras.layers.Dense(10, activation='softmax')
])
```
* 첫 번째 층인 tf.keras.layers.Flatten은 2차원 배열(28 x 28 픽셀)의 이미지 포맷을 28 * 28 = 784 픽셀의 1차원 배열로 변환합니다.
    + 이미지에 있는 픽셀의 행을 펼쳐서 일렬로 늘립니다.
    + 학습되는 가중치가 없고 데이터를 변환하기만 합니다.
* 두 개의 tf.keras.layers.Dense 층이 연속되어 연결됩니다.
    + 첫 번째 Dense 층은 128개의 노드(또는 뉴런)를 가집니다.
    + 두 번째 (마지막) 층은 10개의 노드의 소프트맥스(softmax) 층입니다.
        - 이 층은 10개의 확률을 반환하고 반환된 값의 전체 합은 1입니다.
        - 노드는 현재 이미지가 10개 클래스 중 하나에 속할 확률을 출력합니다. 
#### 5.2)
```python 
model.compile(optimizer='adam',
              loss = 'sparse_categorical_crossentropy',
              metrics = ['accuracy'])
```
* 손실 함수(Loss function)-훈련 하는 동안 모델의 오차를 측정합니다, 모델의 학습이 올바른 방향으로 향하도록 이 함수를 최소화해야 합니다.
* 옵티마이저(Optimizer)-데이터와 손실 함수를 바탕으로 모델의 업데이트 방법을 결정합니다.
* 지표(Metrics)-훈련 단계와 테스트 단계를 모니터링하기 위해 사용합니다, 다음에서는 올바르게 분류된 이미지의 비율인 정확도를 사용합니다.

### 6. 모델 훈련하기
```python
model.fit(train_images, train_labels, epochs=5)
>> Epoch 1/5
1875/1875 [==============================] - 3s 2ms/step - loss: 0.4961 - accuracy: 0.8284
Epoch 2/5
1875/1875 [==============================] - 3s 2ms/step - loss: 0.3758 - accuracy: 0.8640
Epoch 3/5
1875/1875 [==============================] - 3s 2ms/step - loss: 0.3365 - accuracy: 0.8784
Epoch 4/5
1875/1875 [==============================] - 3s 2ms/step - loss: 0.3121 - accuracy: 0.8867
Epoch 5/5
1875/1875 [==============================] - 3s 2ms/step - loss: 0.2971 - accuracy: 0.8909
<tensorflow.python.keras.callbacks.History at 0x7f8279f3fc50>
```

### 7. 정확도 평가하기
```python
test_loss, test_acc = model.evaluate(test_images, test_labels, verbose=2)
print('\n테스트 정확도 : ', test_acc)
>> 313/313 - 0s - loss: 0.3532 - accuracy: 0.8711

테스트 정확도 :  0.8711000084877014
```
* 테스트 세트의 정확도가 훈련 세트의 정확도보다 조금 낮습니다. 
* 훈련 세트의 정확도와 테스트 세트의 정확도 사이의 차이는 과대적합(overfitting) 때문입니다.
* 과대적합은 머신러닝 모델이 훈련 데이터보다 새로운 데이터에서 성능이 낮아지는 현상을 말합니다. 

### 8. 예측 만들기.
#### 8.1) 
```python
predictions = model.predict(test_images)
```
* 훈련된 모델을 사용하여 이미지에 대한 예측을 만들 수 있습니다.
#### 8.2)
```python 
predictions[0]
>> array([7.5080010e-05, 5.8749498e-07, 4.9882242e-06, 2.4914254e-07,
       6.2080517e-06, 1.1042258e-02, 3.2268759e-05, 4.2161353e-02,
       1.7172043e-04, 9.4650525e-01], dtype=float32)
```
* 예측은 10개의 숫자 배열로 나타납니다.
* 값은 10개의 옷 품목에 상응하는 모델의 신뢰도를 나타냅니다.
#### 8.3) 
```python 
np.argmax(predictions[0])
>> 9
```
* 가장 높은 신뢰도를 가진 레이블을 찾아봅니다.
#### 8.4) 
```python 
test_labels[0]
>> 9
```
* 값이 맞는지 테스트 레이블을 확인해봅니다.
#### 8.5) 
```python 
def plot_image(i, predictions_array, true_label, img):
    predictions_array, true_label, img = predictions_array[i], true_label[i], img[i]
    plt.grid(False)
    plt.xticks([])
    plt.yticks([])

    plt.imshow(img, cmap=plt.cm.binary)

    predicted_label = np.argmax(predictions_array)
    if predicted_label == true_label:
        color = 'blue'
    else :
        color = 'red'

    plt.xlabel("{} {:2.0f}% ({})".format(class_names[predicted_label],
                                         100*np.max(predictions_array),
                                         class_names[true_label]),
               color = color)
```
* 이미지와 예측률을 표시해주는 그래프를 만드는 함수입니다.
* 올바른 예측은 파랑색으로 잘못된 예측은 빨강색으로 나타냅니다
#### 8.6) 
```python 
def plot_value_array(i, predictions_array, true_label):
    predictions_array, true_label = predictions_array[i], true_label[i]
    plt.grid(False)
    plt.xticks([])
    plt.yticks([])
    thisplot = plt.bar(range(10), predictions_array, color = "#777777")
    plt.ylim([0, 1])
    predicted_label = np.argmax(predictions_array)

    thisplot[predicted_label].set_color('red')
    thisplot[true_label].set_color('blue')
```
* 신뢰도 점수배열을 표시해주는 그래프를 만드는 함수입니다.
* 올바른 예측은 파랑색으로 잘못된 예측은 빨강색으로 나타냅니다
#### 8.7)
```python 
i = 0
plt.figure(figsize=(6,3))
plt.subplot(1,2,1)
plot_image(i, predictions, test_labels, test_images)
plt.subplot(1,2,2)
plot_value_array(i, predictions, test_labels)
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90952076-8e7f6980-e49b-11ea-9208-aae3e3707804.PNG" width="350" height="180">

* 0번째 원소의 이미지, 예측, 신뢰도 점수 배열을 확인해 보겠습니다.

#### 8.8) 
```python 
i = 12
plt.figure(figsize=(6,3))
plt.subplot(1,2,1)
plot_image(i, predictions, test_labels, test_images)
plt.subplot(1,2,2)
plot_value_array(i, predictions, test_labels)
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90952087-a7881a80-e49b-11ea-8981-1e1e94730366.PNG" width="350" height="180">

* 12번째 원소의 이미지, 예측, 신뢰도 점수 배열을 확인해 보겠습니다.

#### 8.9) 
```python 
num_rows = 5
num_cols = 3
num_images = num_rows * num_cols
plt.figure(figsize=(2*2*num_cols, 2*num_rows))
for i in range(num_images):
    plt.subplot(num_rows, 2*num_cols, 2*i+1)
    plot_image(i, predictions, test_labels,test_images)
    plt.subplot(num_rows, 2*num_cols, 2*i+2)
    plot_value_array(i, predictions, test_labels)
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90952096-bc64ae00-e49b-11ea-826f-263a9fa5b2a9.PNG" width="710" height="520">

#### 8.10) 
```python 
img = test_images[0]
print(img.shape)
>> (28, 28)
```
*  훈련된 모델을 사용하여 한 이미지에 대한 예측을 만듭니다.
#### 8.11) 
```python 
img = (np.expand_dims(img,0))
print(img.shape)
>> (1, 28, 28)
```
* tf.keras 모델은 한 번에 샘플의 묶음 또는 배치(batch)로 예측을 만드는데 최적화되어 있습니다. 
* 하나의 이미지를 사용할 때에도 2차원 배열로 만들어야 합니다
#### 8.12) 
```python 
predictions_single = model.predict(img)
print(predictions_single)
>> [[7.5079945e-05 5.8749498e-07 4.9882146e-06 2.4914235e-07 6.2080398e-06
  1.1042264e-02 3.2268763e-05 4.2161305e-02 1.7172060e-04 9.4650531e-01]]
```
* 이미지의 예측을 만듭니다
#### 8.13) 
```python 
plot_value_array(0, predictions_single, test_labels)
_ = plt.xticks(range(10),class_names,rotation=45)
```
<img src="https://user-images.githubusercontent.com/69491771/90952105-d1d9d800-e49b-11ea-9d14-29dbbdfcc014.PNG" width="350" height="280">
* model.predict는 2차원 넘파이 배열을 반환하므로 첫 번째 이미지의 예측을 선택합니다

#### 8.14) 
```python 
np.argmax(predictions_single[0])
>> 9
```
* 이전과 마찬가지로 모델의 예측은 레이블 9입니다.

