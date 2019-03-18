from django.urls import path
from . import views

urlpatterns = [
    path('', views.show_main_page, name="show_main_page"),
    path('predict_digit/', views.predict_digit, name="predict_digit"),
    path('refresh_model/', views.refresh_model, name="refresh_model"),
    path('train_model/', views.train_model, name="train_model"),
]
