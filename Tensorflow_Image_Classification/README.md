# Tensorflow를 사용하여 고양이와 개 품종 분류하기

## 목표
* Oxford pet 데이터를 받아와 고양이와 개 이미지를 분류하는 딥러닝 모델을 만듭니다.

## 설명
* 인원 : 1명
* 작업툴 : Python, Tensorflow, Numpy, matplotlib, colab등

## 데이터
* images : 고양이와 개 이미지가 모여있는 폴더이며, 이미지의 이름에서 시작이 대문자일 경우 고양이고 소문자일 경우 개를 뜻하며 품종이 적혀있습니다, 품종마다 약 200개의 이미지를 가지고 있습니다.

## 참고한 논문자료
* MobileNetV2: Inverted Residuals and Linear Bottlenecks
* Densely Connected Convolutional Networks
* Bag of Tricks for Image Classification with Convolutional Neural Networks

## 프로그래밍

### 1. 라이브러리 import하기
```python
import tensorflow as tf
from tensorflow import keras
import numpy as np
import os
import re
from PIL import Image
import shutil
import random
import matplotlib.pyplot as plt
```

### 2. 데이터 준비
#### 2.1) gdown 라이브러리를 import하여 Google Drive에서 oxford_pet.zip 압축파일을 다운받아옵니다.
```python
import gdown
url = 'https://drive.google.com/uc?id=1dIR9ANjUsV9dWa0pS9J0c2KUGMfpIRG0'
fname = 'oxford_pet.zip'
gdown.download(url, fname, quiet=False)
# 출력
>> Downloading...
From: https://drive.google.com/uc?id=1dIR9ANjUsV9dWa0pS9J0c2KUGMfpIRG0
To: /content/oxford_pet.zip
811MB [00:04, 185MB/s]
oxford_pet.zip
```

#### 2.2) 다운로드가 잘 되어있는지를 확인합니다.
```python
!ls -l
# 출력
>> total 791576
-rw-r--r-- 1 root root 810565619 Aug 23 10:09 oxford_pet.zip
drwxr-xr-x 1 root root      4096 Jul 30 16:30 sample_data
```
#### 2.3) 압축파일의 압축을 풀어줍니다.
```python
!unzip -q oxford_pet.zip -d oxford_pet
```

#### 2.4) 압축파일이 잘 풀려는 지 확인하고 폴더안에 파일을 확인합니다.
```python
!ls oxford_pet
# 출력
>> annotations  images
```

#### 2.5) image_dir에 images의 path를 저장합니다.
```python
cur_dir = os.getcwd()
data_dir = os.path.join(cur_dir, 'oxford_pet')
image_dir = os.path.join(data_dir,'images')
```

#### 2.6) 리스트컴프리헨션을 사용하여 파일형식이 '.jpg'형식인 파일의 이름은 리스트화하여 image_files에 저장합니다.
```python
image_files = [fname for fname in os.listdir(image_dir) if os.path.splitext(fname)[-1] == '.jpg']
print(len(image_files))
# 출력
>> 7390
```

#### 2.7) 데이터 전처리에서 특이치 삭제처럼 3채널의 RGB형태가 아닌 파일을 찾아내어 삭제해줍니다. 
```python
for image_file in image_files:
    image_path = os.path.join(image_dir, image_file)
    image = Image.open(image_path)
    image_mode = image.mode 
    if image_mode != 'RGB':
        print(image_file, image_mode)
        image = np.asarray(image)
        print(image.shape)
        os.remove(image_path)
# 출력
>> Egyptian_Mau_177.jpg P
(175, 246)
staffordshire_bull_terrier_2.jpg L
(282, 500)
Egyptian_Mau_191.jpg P
(214, 300)
Egyptian_Mau_129.jpg L
(325, 299)
Abyssinian_5.jpg RGBA
(150, 200, 4)
Egyptian_Mau_139.jpg P
(250, 350)
Egyptian_Mau_186.jpg RGBA
(275, 183, 4)
Egyptian_Mau_167.jpg P
(275, 183)
Egyptian_Mau_14.jpg RGBA
(800, 582, 4)
Abyssinian_34.jpg P
(202, 250)
staffordshire_bull_terrier_22.jpg L
(500, 364)
Egyptian_Mau_145.jpg P
(188, 216)
```

#### 2.8) 형태가 다른 파일을 삭제한 후에 파일의 수를 출력하여 확인합니다.
```python
image_files = [fname for fname in os.listdir(image_dir) if os.path.splitext(fname)[-1] == '.jpg']
print(len(image_files))
# 출력
>> 7378
```
#### 2.9) 집합에서의 중북불가한 특성을 활용하여 고양이와 개의 품종을 리스트화하여 저장해줍니다.
```python
class_list = set()
for image_file in image_files:
    file_name = os.path.splitext(image_file)[0]
    class_name = re.sub('_\d+', '', file_name)
    class_list.add(class_name)
class_list = list(class_list)
print(len(class_list))
# 출력
>> 37
```

#### 2.10) class_list를 정렬하여 출력하여 데이터를 확인해줍니다.
```python
class_list.sort()
class_list
# 출력
>> ['Abyssinian',
 'Bengal',
 'Birman',
 'Bombay',
 'British_Shorthair',
 'Egyptian_Mau',
 'Maine_Coon',
 'Persian',
 'Ragdoll',
 'Russian_Blue',
 'Siamese',
 'Sphynx',
 'american_bulldog',
 'american_pit_bull_terrier',
 'basset_hound',
 'beagle',
 'boxer',
 'chihuahua',
 'english_cocker_spaniel',
 'english_setter',
 'german_shorthaired',
 'great_pyrenees',
 'havanese',
 'japanese_chin',
 'keeshond',
 'leonberger',
 'miniature_pinscher',
 'newfoundland',
 'pomeranian',
 'pug',
 'saint_bernard',
 'samoyed',
 'scottish_terrier',
 'shiba_inu',
 'staffordshire_bull_terrier',
 'wheaten_terrier',
 'yorkshire_terrier']
```
#### 2.11) class_list의 인덱스 1은 Bengal이라는 것을 확인할 수 있습니다.
```python
class_list[1]
# 출력
>> Bengal
```
#### 2.12) class_list를 활용하여 인덱스를 붙인 사전형식의 class2idx를 만들어줍니다.
```python
class2idx = {cls:idx for idx, cls in enumerate(class_list)}
class2idx
# 출력
>> {'Abyssinian': 0,
 'Bengal': 1,
 'Birman': 2,
 'Bombay': 3,
 'British_Shorthair': 4,
 'Egyptian_Mau': 5,
 'Maine_Coon': 6,
 'Persian': 7,
 'Ragdoll': 8,
 'Russian_Blue': 9,
 'Siamese': 10,
 'Sphynx': 11,
 'american_bulldog': 12,
 'american_pit_bull_terrier': 13,
 'basset_hound': 14,
 'beagle': 15,
 'boxer': 16,
 'chihuahua': 17,
 'english_cocker_spaniel': 18,
 'english_setter': 19,
 'german_shorthaired': 20,
 'great_pyrenees': 21,
 'havanese': 22,
 'japanese_chin': 23,
 'keeshond': 24,
 'leonberger': 25,
 'miniature_pinscher': 26,
 'newfoundland': 27,
 'pomeranian': 28,
 'pug': 29,
 'saint_bernard': 30,
 'samoyed': 31,
 'scottish_terrier': 32,
 'shiba_inu': 33,
 'staffordshire_bull_terrier': 34,
 'wheaten_terrier': 35,
 'yorkshire_terrier': 36}
```
#### 2.13) class2idx에서 Bengal의 값을 출력하면 1이 나오게 됩니다.
```python
class2idx['Bengal']
# 출력
>> 1
```
#### 2.14) 학습을 위해 사용할 train과 validation의 path를 저장하고 디렉터리를 만들어줍니다.
```python
train_dir = os.path.join(data_dir, 'train')
val_dir = os.path.join(data_dir, 'validation')
os.makedirs(train_dir, exist_ok=True)
os.makedirs(val_dir, exist_ok=True)
```
#### 2.15) image_files을 정렬해줍니다.
```python
image_files.sort()
```
#### 2.16) image_files의 인덱스 9번까지 출력하여줍니다.
```python
image_files[:10]
# 출력
>> ['Abyssinian_1.jpg',
 'Abyssinian_10.jpg',
 'Abyssinian_100.jpg',
 'Abyssinian_101.jpg',
 'Abyssinian_102.jpg',
 'Abyssinian_103.jpg',
 'Abyssinian_104.jpg',
 'Abyssinian_105.jpg',
 'Abyssinian_106.jpg',
 'Abyssinian_107.jpg']
```
#### 2.17) 각각 고양이와 개의 품종들 마다 약 200개의 이미지를 가지고 있는데 160개는 train으로 나머지는 validation으로 사용하기위해 나누어 복사하여 저장합니다.
```python
cnt = 0
previous_class = ""
for image_file in image_files:
    file_name = os.path.splitext(image_file)[0]
    class_name = re.sub('_\d+', '', file_name)
    if class_name == previous_class:
        cnt += 1
    else:
        cnt = 1
    if cnt <= 160:
        cpath = train_dir
    else:
        cpath = val_dir
    image_path = os.path.join(image_dir, image_file)
    shutil.copy(image_path, cpath)
    previous_class = class_name
```
#### 2.18) 각각의 디렉터리의 파일들을 리스트화하여 저장합니다.
```python
train_images = os.listdir(train_dir)
val_images = os.listdir(val_dir)
```
#### 2.19) 각각의 개수를 출력하여 줍니다.
```python
print(len(train_images),len(val_images))
# 출력
>> 5920 1458
```
#### 2.20) train_images의 상위 10개를 출력합니다.
```python
train_images[:10]
# 출력
>> ['english_cocker_spaniel_194.jpg',
 'saint_bernard_36.jpg',
 'Persian_139.jpg',
 'Persian_136.jpg',
 'Birman_103.jpg',
 'miniature_pinscher_25.jpg',
 'yorkshire_terrier_164.jpg',
 'yorkshire_terrier_156.jpg',
 'american_pit_bull_terrier_174.jpg',
 'Persian_44.jpg']
```
#### 2.21) val_images의 상위 10개를 출력합니다.
```python
val_images[:10]
# 출력
>> ['pug_64.jpg',
 'Sphynx_8.jpg',
 'Abyssinian_71.jpg',
 'havanese_98.jpg',
 'samoyed_96.jpg',
 'Siamese_66.jpg',
 'japanese_chin_87.jpg',
 'Bombay_86.jpg',
 'english_cocker_spaniel_84.jpg',
 'boxer_82.jpg']
```

### 3. TFRecord File 만들기
* TFRecord 파일은 Tensorflow로 딥러닝 학습을 하는데 필요한 데이터들을 보관하기 위한 데이터포멧입니다.
* 흔히들 Tensorflow의 표준 데이터 파일 포멧이라고도 합니다.
* 장점 
    - 학습데이터를 분리하여 관리하지 않아서 코드 구현시 더욱 효율적으로 구현이 가능합니다.
    - 매번 코드에서 인코딩/디코딩 작업을 할 필요가 없어서 학습 속도가 개선됩니다.
    - 이미지 파일은 TFRecord 파일로 새성하면 파일 사이즈가 작아집니다.
#### 3.1) 이미지 사이즈를 설정할 때 쓰일 값을 변수에 저장합니다.
```python
IMG_SIZE = 224
```
#### 3.2)
```python
tfr_dir = os.path.join(data_dir, 'tfrecord')
os.makedirs(tfr_dir,exist_ok = True)

tfr_train_dir = os.path.join(tfr_dir, 'cls_train.tfr')
tfr_val_dir = os.path.join(tfr_dir, 'cls_val.tfr')
```
#### 3.3)
```python
writer_train = tf.io.TFRecordWriter(tfr_train_dir)
writer_val = tf.io.TFRecordWriter(tfr_val_dir)
```
#### 3.4) Tensorflow홈페이지에서 제공하는 TFRecord 함수를 찾아와 넣어줍니다.  
```python
# The following functions can be used to convert a value to a type compatible
# with tf.Example.

def _bytes_feature(value):
  """Returns a bytes_list from a string / byte."""
  if isinstance(value, type(tf.constant(0))):
    value = value.numpy() # BytesList won't unpack a string from an EagerTensor.
  return tf.train.Feature(bytes_list=tf.train.BytesList(value=[value]))

def _float_feature(value):
  """Returns a float_list from a float / double."""
  return tf.train.Feature(float_list=tf.train.FloatList(value=[value]))

def _int64_feature(value):
  """Returns an int64_list from a bool / enum / int / uint."""
  return tf.train.Feature(int64_list=tf.train.Int64List(value=[value]))
```
#### 3.5) train TFRecord File 만들기
```python
n_train = 0

train_files = os.listdir(train_dir)
for train_file in train_files:
    train_path = os.path.join(train_dir, train_file)
    image = Image.open(train_path)
    image = image.resize((IMG_SIZE,IMG_SIZE))
    bimage = image.tobytes()

    file_name = os.path.splitext(train_file)[0]
    class_name = re.sub('_\d+', '', file_name)
    class_num = class2idx[class_name]

    example = tf.train.Example(features = tf.train.Features(feature ={
        'image': _bytes_feature(bimage),
        'cls_num': _int64_feature(class_num)
    }))
    writer_train.write(example.SerializeToString())
    n_train += 1

writer_train.close()
print(n_train)
# 출력
>> 5920
```
#### 3.6) val TFRecord File 만들기
```python
n_val = 0

val_files = os.listdir(val_dir)
for val_file in val_files:
  val_path = os.path.join(val_dir, val_file)
  image = Image.open(val_path)
  image = image.resize((IMG_SIZE, IMG_SIZE))
  bimage = image.tobytes()

  file_name = os.path.splitext(val_file)[0] #Bangal_101
  class_name = re.sub('_\d+', '', file_name)
  class_num = class2idx[class_name]

  example = tf.train.Example(features=tf.train.Features(feature={
      'image': _bytes_feature(bimage),
      'cls_num': _int64_feature(class_num)
  }))
  writer_val.write(example.SerializeToString())
  n_val += 1

writer_val.close()
print(n_val)
# 출력
>> 1458
```

### 4. Classification 모델링 - MobileNetV2
#### 4.1) 전체적인 설정 값들을 지정하여줍니다.
```python
N_CLASS = len(class_list)
N_EPOCHS = 50
N_BATCH = 40
N_TRAIN = n_train
N_VAL = n_val
IMG_SIZE = 224
learning_rate = 0.0001
steps_per_epoch = N_TRAIN / N_BATCH
validation_steps = int(np.ceil(N_VAL / N_BATCH))
```
#### 4.2) TFRecord 파일로 저장한 데이터를 불러와서 image와 label에 각각 저장해줍니다.
```python
def _parse_function(tfrecord_serialized):
    features={'image': tf.io.FixedLenFeature([], tf.string),
              'cls_num': tf.io.FixedLenFeature([], tf.int64)
    }
    parsed_features = tf.io.parse_single_example(tfrecord_serialized, features)

    image = tf.io.decode_raw(parsed_features['image'], tf.uint8)
    image = tf.reshape(image, [IMG_SIZE,IMG_SIZE,3])
    image = tf.cast(image, tf.float32)/255.

    label = tf.cast(parsed_features['cls_num'], tf.int64)
    label = tf.one_hot(label, N_CLASS)

    return image, label
```
#### 4.3) cutmix는 사진 두개를 랜덤한 크기로 부분을 잘라서 서로 합쳐서 추가해주는 함수입니다.
```python
def cutmix(images, labels, PROB = 0.5):
    imgs = []; labs =[]
    for i in range(N_BATCH):
        APPLY = tf.cast(tf.random.uniform(()) <= PROB, tf.int32)
        idx = tf.random.uniform((), 0, N_BATCH, tf.int32)

        W = IMG_SIZE; H = IMG_SIZE
        lam = tf.random.uniform(())
        cut_ratio = tf.math.sqrt(1.-lam)
        cut_w = tf.cast(W * cut_ratio, tf.int32) * APPLY
        cut_h = tf.cast(H * cut_ratio, tf.int32) * APPLY

        cx = tf.random.uniform((), int(W/8), int(7/8*W), tf.int32)
        cy = tf.random.uniform((), int(H/8), int(7/8*H), tf.int32)

        xmin = tf.clip_by_value(cx - cut_w//2, 0, W)
        ymin = tf.clip_by_value(cy - cut_h//2, 0, H)
        xmax = tf.clip_by_value(cx + cut_w//2, 0, W)
        ymax = tf.clip_by_value(cy + cut_h//2, 0, H)

        mid_left = images[i, ymin:ymax, : xmin, :]
        mid_mid = images[idx, ymin:ymax, xmin:xmax, :]
        mid_right = images[i, ymin:ymax, xmax:, :]
        middle = tf.concat([mid_left,mid_mid,mid_right], axis = 1)
        top = images[i, :ymin, :, :]
        bottom = images[i, ymax:, :, :]
        new_img = tf.concat([top,middle,bottom], axis = 0)
        imgs.append(new_img)

        alpha = tf.cast((cut_w*cut_h)/(W*H), tf.float32)
        label1 = labels[i]; label2 = labels[idx]
        new_label = ((1-alpha) * label1 + alpha * label2)
        labs.append(new_label)

    new_imgs = tf.reshape(tf.stack(imgs), [-1, IMG_SIZE, IMG_SIZE, 3])
    new_labs = tf.reshape(tf.stack(labs), [-1, N_CLASS])

    return new_imgs, new_labs

```
* 이 부분은 기존의 이미지만으로 부족한 데이터를 채울 수 있고 모델의 선능향상에 도움을 줍니다.
* cutmix는 네이버에서 나온 방법입니다.
#### 4.4) train_dataset을 만들업줍니다.
```python
train_dataset = tf.data.TFRecordDataset(tfr_train_dir)
train_dataset = train_dataset.map(_parse_function, num_parallel_calls = tf.data.experimental.AUTOTUNE)
train_dataset = train_dataset.shuffle(buffer_size = N_TRAIN).prefetch(tf.data.experimental.AUTOTUNE).batch(N_BATCH)
train_dataset = train_dataset.map(cutmix).repeat()
```
#### 4.5) val_dataset을 만들업줍니다.
```python
val_dataset = tf.data.TFRecordDataset(tfr_val_dir)
val_dataset = val_dataset.map(_parse_function, num_parallel_calls = tf.data.experimental.AUTOTUNE)
val_dataset = val_dataset.batch(N_BATCH).repeat()
```
#### 4.6) train_dataset의 한부분을 출력해줍니다.
```python
for image, label in train_dataset.take(1):
    for i in range(N_BATCH):
        print(label[i].numpy())
        plt.imshow(image[i])
        plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90979363-89034b80-e58f-11ea-8497-171b49ebafb2.PNG" width="515" height="650">

* 여기서 배열이 0과 1로 이루어져 있으면 cutmix함수가 적용되지않은 이미지이고 0과 1사이의 실수로 나오는 이미지는 cutmix함수가 적용된 이미지입니다. 

#### 4.7) 학습에 필요한 라이브러리를 import해줍니다.
```python
from tensorflow.keras import models
from tensorflow.keras.applications.mobilenet_v2 import MobileNetV2
from tensorflow.keras.layers import Conv2D, ReLU, MaxPooling2D, Dense, BatchNormalization, GlobalAveragePooling2D
```
#### 4.8) MobileNetV2를 다운 받아줍니다.
```python
mobilenetv2 = MobileNetV2(weights='imagenet', include_top=False, input_shape=(IMG_SIZE,IMG_SIZE,3))
# 출력
>> Downloading data from https://storage.googleapis.com/tensorflow/keras-applications/mobilenet_v2/mobilenet_v2_weights_tf_dim_ordering_tf_kernels_1.0_224_no_top.h5
9412608/9406464 [==============================] - 0s 0us/step
```
#### 4.9) 모델에 각각 레이어를 추가해주는 함수입니다.
```python
def create_mv_model():
    model = models.Sequential()
    model.add(mobilenetv2)
    model.add(GlobalAveragePooling2D())
    model.add(Dense(256))
    model.add(BatchNormalization())
    model.add(ReLU())
    model.add(Dense(N_CLASS, activation='softmax'))
    return model
```
#### 4.10) 앞에 모델에 레이어를 추가해놓은 함수를 불러와 모델을 구성합니다.
```python
model = create_mv_model()

LR_INIT = 0.000001
LR_MAX = 0.0002
LR_MIN = LR_INIT
RAMPUP_EPOCH = 4
EXP_DECAY = 0.9

def lr_schedule_fn(epoch):
    if epoch < RAMPUP_EPOCH:
        lr = (LR_MAX - LR_MIN) / RAMPUP_EPOCH * epoch + LR_INIT
    else:
        lr = (LR_MAX - LR_MIN) * EXP_DECAY**(epoch - RAMPUP_EPOCH)
    return lr

lr_callback = keras.callbacks.LearningRateScheduler(lr_schedule_fn)

model.compile(optimizer = tf.keras.optimizers.Adam(LR_INIT),
              loss = tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
              metrics = ['accuracy'])
model.summary()
# 출력
>> Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
mobilenetv2_1.00_224 (Functi (None, 7, 7, 1280)        2257984   
_________________________________________________________________
global_average_pooling2d (Gl (None, 1280)              0         
_________________________________________________________________
dense (Dense)                (None, 256)               327936    
_________________________________________________________________
batch_normalization (BatchNo (None, 256)               1024      
_________________________________________________________________
re_lu (ReLU)                 (None, 256)               0         
_________________________________________________________________
dense_1 (Dense)              (None, 37)                9509      
=================================================================
Total params: 2,596,453
Trainable params: 2,561,829
Non-trainable params: 34,624
_________________________________________________________________
```
#### 4.11) learning_late의 변화를 그래프로 출력해줍니다.
```python
def plot_lr():
    lr = []
    epoch_list = list(np.arange(N_EPOCHS)+1)
    for epoch in range(N_EPOCHS):
        lr.append(lr_schedule_fn(epoch))
    plt.plot(epoch_list, lr, 'b-')
    plt.xlabel('Epoch')
    plt.show()

plot_lr()
```
<img src="https://user-images.githubusercontent.com/69491771/90979344-6ffa9a80-e58f-11ea-91e7-4f0648476d21.PNG" width="405" height="245">

#### 4.12) 모델 학습시킵니다.
```python
history = model.fit(
    train_dataset,
    epochs = N_EPOCHS,
    steps_per_epoch = steps_per_epoch,
    validation_data = val_dataset,
    validation_steps= validation_steps,
    callbacks= [lr_callback]
)
# 출력
>> Epoch 45/50
148/148 [==============================] - 44s 298ms/step - loss: 1.2063 - accuracy: 0.8868 - val_loss: 0.9240 - val_accuracy: 0.9390
Epoch 46/50
148/148 [==============================] - 44s 299ms/step - loss: 1.2079 - accuracy: 0.8880 - val_loss: 0.9234 - val_accuracy: 0.9410
Epoch 47/50
148/148 [==============================] - 44s 299ms/step - loss: 1.1957 - accuracy: 0.8943 - val_loss: 0.9239 - val_accuracy: 0.9403
Epoch 48/50
148/148 [==============================] - 44s 298ms/step - loss: 1.1944 - accuracy: 0.8936 - val_loss: 0.9234 - val_accuracy: 0.9410
Epoch 49/50
148/148 [==============================] - 44s 296ms/step - loss: 1.1967 - accuracy: 0.8932 - val_loss: 0.9242 - val_accuracy: 0.9410
Epoch 50/50
148/148 [==============================] - 43s 291ms/step - loss: 1.2234 - accuracy: 0.8861 - val_loss: 0.9220 - val_accuracy: 0.9417
```
* 그 결과 약 94%의 정확도가 나오게 됩니다.

### 5. Classification 모델링 - DenseNet121 
#### 5.1) 학습에 필요한 라이브러리를 import해줍니다.
```python
from tensorflow.keras.applications.densenet import DenseNet121
```
#### 5.2) 학습에 필요한 라이브러리를 import해줍니다.
```python
from tensorflow.keras import models
from tensorflow.keras.layers import Conv2D, ReLU, MaxPooling2D, Dense, BatchNormalization, GlobalAveragePooling2D
```
#### 5.3) DenseNet121 다운 받아줍니다.
```python
densenet = DenseNet121(weights='imagenet', include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
# 출력
>> Downloading data from https://storage.googleapis.com/tensorflow/keras-applications/densenet/densenet121_weights_tf_dim_ordering_tf_kernels_notop.h5
29089792/29084464 [==============================] - 2s 0us/step
```
#### 5.4) 모델에 각각 레이어를 추가해주는 함수입니다.
```python
def create_dense_model():
  model = models.Sequential()
  model.add(densenet)
  model.add(GlobalAveragePooling2D())
  model.add(Dense(256))
  model.add(BatchNormalization())
  model.add(ReLU())
  model.add(Dense(N_CLASS, activation='softmax'))
  return model
```
#### 5.5) 앞에 모델에 레이어를 추가해놓은 함수를 불러와 모델을 구성합니다.
```python
model = create_dense_model()

LR_INIT = 0.000001
LR_MAX = 0.0002
LR_MIN = LR_INIT
RAMPUP_EPOCH = 4
EXP_DECAY = 0.9

def lr_schedule_fn(epoch):
  if epoch < RAMPUP_EPOCH:
    lr = (LR_MAX - LR_MIN) / RAMPUP_EPOCH * epoch + LR_INIT
  else:
    lr = (LR_MAX - LR_MIN) * EXP_DECAY**(epoch - RAMPUP_EPOCH)
  return lr

lr_callback = keras.callbacks.LearningRateScheduler(lr_schedule_fn)

model.compile(optimizer=tf.keras.optimizers.Adam(LR_INIT),
              loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.1),
              metrics=['accuracy'])
model.summary()
# 출력
>> Model: "sequential_1"
_________________________________________________________________
Layer (type)                 Output Shape              Param #   
=================================================================
densenet121 (Functional)     (None, 7, 7, 1024)        7037504   
_________________________________________________________________
global_average_pooling2d_1 ( (None, 1024)              0         
_________________________________________________________________
dense_2 (Dense)              (None, 256)               262400    
_________________________________________________________________
batch_normalization_1 (Batch (None, 256)               1024      
_________________________________________________________________
re_lu_1 (ReLU)               (None, 256)               0         
_________________________________________________________________
dense_3 (Dense)              (None, 37)                9509      
=================================================================
Total params: 7,310,437
Trainable params: 7,226,277
Non-trainable params: 84,160
_________________________________________________________________
```
#### 5.6) 모델 학습시킵니다.
```python
history = model.fit(
    train_dataset,
    epochs=N_EPOCHS,
    steps_per_epoch=steps_per_epoch,
    validation_data=val_dataset,
    validation_steps=validation_steps,
    callbacks=[lr_callback]
)
# 출력
>> Epoch 45/50
148/148 [==============================] - 140s 946ms/step - loss: 1.0980 - accuracy: 0.9014 - val_loss: 0.8890 - val_accuracy: 0.9513
Epoch 46/50
148/148 [==============================] - 140s 947ms/step - loss: 1.0977 - accuracy: 0.8993 - val_loss: 0.8930 - val_accuracy: 0.9499
Epoch 47/50
148/148 [==============================] - 140s 946ms/step - loss: 1.0981 - accuracy: 0.9030 - val_loss: 0.8925 - val_accuracy: 0.9520
Epoch 48/50
148/148 [==============================] - 140s 946ms/step - loss: 1.1055 - accuracy: 0.9047 - val_loss: 0.8928 - val_accuracy: 0.9499
Epoch 49/50
148/148 [==============================] - 140s 948ms/step - loss: 1.1059 - accuracy: 0.9015 - val_loss: 0.8944 - val_accuracy: 0.9513
Epoch 50/50
148/148 [==============================] - 140s 945ms/step - loss: 1.0909 - accuracy: 0.9091 - val_loss: 0.8938 - val_accuracy: 0.9499
```
* 그 결과 약 95%의 정확도가 나오게 됩니다, 앞의 MobileNetV2 보다 정확도 1%가 오른것을 볼 수 있습니다.
### 6. 새로운 이미지 받아와서 TEST해보기
#### 6.1) 새로운 이미지를 업로드 후에 이미지 파일을 모델를 돌릴 수 있게 최적화 시킵니다.
```python
## Image upload 후 실행
image = Image.open('솜이.jpg')
image = image.resize((224, 224))
image = np.array(image)
image = image/255.
```
#### 6.2) 이미지를 출력해줍니다.
```python
plt.imshow(image)
plt.show()
```
<img src="https://user-images.githubusercontent.com/69491771/90979292-1abe8900-e58f-11ea-9d26-d3f8ecf32793.PNG" width="260" height="250">

#### 6.3) 모델를 돌리기위한 형태로 reshape해줍니다.
```python
image = np.reshape(image, (1, 224, 224, 3))
```
#### 6.4) 학습된 모델을 동작시켜줍니다.
```python
prediction = model.predict(image)
prediction.shape
# 출력
>> (1, 37)
```
#### 6.5) max값의 label을 출력합니다.
```python
pred_class = np.argmax(prediction, axis=-1)
pred_class
# 출력
>> array([17])
```
#### 6.6) label을 조회해 품종을 출력해줍니다.
```python
class_list[int(pred_class)]
# 출력
>> chihuahua
```
