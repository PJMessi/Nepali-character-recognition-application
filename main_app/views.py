from django.shortcuts import render
import tensorflow as tf
from numpy import *
import base64
from PIL import Image, ImageFilter
from django.http import JsonResponse
import pandas as pd

from keras.datasets import mnist
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import Dropout
from keras.layers import Flatten
from keras.layers.convolutional import Conv2D
from keras.layers.convolutional import MaxPooling2D
from keras.optimizers import Adam
from keras.utils import np_utils

# Create your views here.

def refresh_model(request):
    train_data = pd.read_csv('train.csv')
    test_data = pd.read_csv('test.csv')
    y_train  = train_data.iloc[:, 0].values
    x_train = train_data.iloc[:, 1:].values
    x_train = x_train.reshape(len(x_train), 32, 32)
    y_test  = test_data.iloc[:, 0].values
    x_test = test_data.iloc[:, 1:].values
    x_test = x_test.reshape(len(x_test), 32, 32)
    x_train = tf.keras.utils.normalize(x_train, axis = 1)
    x_test = tf.keras.utils.normalize(x_test, axis = 1)
    x_train = x_train.reshape(len(x_train), 32, 32, 1)
    x_test = x_test.reshape(len(x_test), 32, 32, 1)

    number_of_classes = 58
    y_train = np_utils.to_categorical(y_train, number_of_classes)
    y_test = np_utils.to_categorical(y_test, number_of_classes)
    model = Sequential()
    model.add(Conv2D(32, (5, 5), input_shape=(x_train.shape[1], x_train.shape[2], 1), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Conv2D(32, (3, 3), activation='relu'))
    model.add(MaxPooling2D(pool_size=(2, 2)))
    model.add(Dropout(0.2))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dense(number_of_classes, activation='softmax'))
    model.compile(loss='categorical_crossentropy', optimizer=Adam(), metrics=['accuracy'])
    model.fit(x_train, y_train, validation_data=(x_test, y_test), epochs=10, batch_size=200)
    model.save('nepali_character_recognition_model.h5')
    return JsonResponse({'result': "Model refreshed successfully."})

def show_main_page(request):
        context = {
        "title": "DIGIT RECOGNITION APP"
        }
        return render(request, 'main_app/index.html', context)

def predict_digit(request):
        result = list(request.POST.keys())

        if(request.method == 'POST'):    
                character_recognition_model = tf.keras.models.load_model('nepali_character_recognition_model.h5') 
                data = result[0][22:]
                img = base64.b64decode(data)

                fh = open("imageToSave.png", "wb")
                fh.write(img)
                fh.close()        
                #print("Success: PNG image of canvas created.")

                im = Image.open("imageToSave.png")
                rgb_im = im.convert('RGB')
                rgb_im.save('colors.jpg')
                #print("Success: PNG image converted to RGB.")

                im=Image.open('colors.jpg')
                img = array(im.resize((32, 32), Image.ANTIALIAS).convert("L"))
                data = img.reshape([1, 1024])
                data = (data/255)
                data = reshape(data, (32, 32))     

                data = data.reshape(1, 32, 32, 1)
                #print(data)
                #print("Success: Data generated form RGB image.")

                predictions = character_recognition_model.predict(data)
                prediction = argmax(predictions[0])
                #print("Success: Prediction successful.")
                print("The nepali number you entered is: " + str(prediction.item()))
                return JsonResponse({'result':prediction.item()})

def train_model(request):    
        character_recognition_model = tf.keras.models.load_model('nepali_character_recognition_model.h5')
        canvas_data = uint8(request.POST.get('canvas_data'))

        im=Image.open('colors.jpg')
        img = array(im.resize((32, 32), Image.ANTIALIAS).convert("L"))
        data = img.reshape([1, 1024])
        data = (data/255)
        data = reshape(data, (32, 32))
        data = data.reshape(1, 32, 32, 1)
        number_of_classes = 58
        canvas_data = canvas_data.reshape(1, 1)
        canvas_data = np_utils.to_categorical(canvas_data, number_of_classes)
        print(canvas_data.shape)
        character_recognition_model.fit( data, canvas_data, epochs = 1)
        character_recognition_model.save('nepali_character_recognition_model.h5')
        print("SUCCESS: model fit.")  
        return JsonResponse({'result':"Model Trained"})