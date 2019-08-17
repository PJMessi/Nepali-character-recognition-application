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

#for image compare
from skimage import measure
import matplotlib.pyplot as plt
import numpy as np
import cv2
import os
import random
from pathlib import Path
from resizeimage import resizeimage

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

    number_of_classes = 11
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

                fh = open("png_image.png", "wb")
                fh.write(img)
                fh.close()        
                #print("Success: PNG image of canvas created.")

                im = Image.open("png_image.png")
                rgb_im = im.convert('RGB')
                rgb_im.save('jpg_image.jpg')
                #print("Success: PNG image converted to RGB.")

                im=Image.open('jpg_image.jpg')
                img = array(im.resize((32, 32), Image.ANTIALIAS).convert("L"))
                data = img.reshape([1, 1024])
                data = (data/255)
                data = reshape(data, (32, 32))     

                data = data.reshape(1, 32, 32, 1)
                #print(data)
                #print("Success: Data generated form RGB image.")

                predictions = character_recognition_model.predict(data)
                prediction = argmax(predictions[0])

                # start image compare ================================================================================================================================================================================          

                #retrieving the canvas image----------------------------------------------
                #converting canvas img to 32 by 32 bit (size of training dataset)
                with open('jpg_image.jpg', 'r+b') as f: 
                        with Image.open(f) as image:
                                cover = resizeimage.resize_cover(image, [32, 32])
                                cover.save('user_image.png', image.format)

                user_image = cv2.imread("user_image.png")
                user_image = cv2.cvtColor(user_image, cv2.COLOR_BGR2GRAY)                   
                cv2.imwrite('C:\\Users\\pjmes\Desktop\\Project\\Finalllllllllllllllll\\compare_img_2.png', user_image)
                #--------------------------------------------------------------------------

                # prediction.item() contains the character label predicted by the model
                print("==============================================================================================================================")
                print("Model prediction: " + str(prediction.item()))

                # retrieving the image of that predicted character from the train dataset------
                p = 'C:\\Users\\pjmes\Desktop\\Project\\Finalllllllllllllllll\\Test' + '\\' + str(prediction.item())
                path = Path(p)
                files = os.listdir(path)
                index = random.randrange(0, len(files))

                predicted_character_image = cv2.imread("Test\\" + str(prediction.item()) + "\\" + files[index])
                predicted_character_image = cv2.cvtColor(predicted_character_image, cv2.COLOR_BGR2GRAY)
                cv2.imwrite('C:\\Users\\pjmes\Desktop\\Project\\Finalllllllllllllllll\\compare_img_1.png', predicted_character_image)
                #------------------------------------------------------------------------
               	
                original = cv2.imread("compare_img_1.png")
                image_to_compare = cv2.imread("compare_img_2.png")


                # 1) Check if 2 images are equals
                if original.shape == image_to_compare.shape:
                    # print("The images have same size and channels")
                    difference = cv2.subtract(original, image_to_compare)
                    b, g, r = cv2.split(difference)

                    # if cv2.countNonZero(b) == 0 and cv2.countNonZero(g) == 0 and cv2.countNonZero(r) == 0:
                    #     print("The images are completely Equal")
                    # else:
                    #     print("The images are NOT equal")

                # 2) Check for similarities between the 2 images
                sift = cv2.xfeatures2d.SIFT_create()
                kp_1, desc_1 = sift.detectAndCompute(original, None)
                kp_2, desc_2 = sift.detectAndCompute(image_to_compare, None)

                index_params = dict(algorithm=0, trees=5)
                search_params = dict()
                flann = cv2.FlannBasedMatcher(index_params, search_params)

                matches = flann.knnMatch(desc_1, desc_2, k=2)

                good_points = []
                for m, n in matches:
                    if m.distance < 0.75*n.distance:
                        good_points.append(m)

                # Define how similar they are
                number_keypoints = 0
                if len(kp_1) <= len(kp_2):
                    number_keypoints = len(kp_1)
                else:
                    number_keypoints = len(kp_2)


                # print("Keypoints 1ST Image: " + str(len(kp_1)))
                # print("Keypoints 2ND Image: " + str(len(kp_2)))
                # print("GOOD Matches:", len(good_points))

                print("How good is the match: ", len(good_points) / number_keypoints * 100)

                similarity = len(good_points) / number_keypoints * 100
                result = cv2.drawMatches(original, kp_1, image_to_compare, kp_2, good_points, None)
                cv2.imwrite("feature_matching.jpg", result)
                print("==============================================================================================================================")
                # end image compare=========================================================================================================================================================
                
                if(similarity > 15):
                    return JsonResponse({'result':prediction.item()})
                else:
                    return JsonResponse({'result':10, 'result2':prediction.item()})
                
                # print("Success: Prediction successful.")
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
        number_of_classes = 11
        canvas_data = canvas_data.reshape(1, 1)
        canvas_data = np_utils.to_categorical(canvas_data, number_of_classes)
        print(canvas_data.shape)
        character_recognition_model.fit( data, canvas_data, epochs = 1)
        character_recognition_model.save('nepali_character_recognition_model.h5')
        print("SUCCESS: model fit.")  
        return JsonResponse({'result':"Model Trained"})


#for image compare
