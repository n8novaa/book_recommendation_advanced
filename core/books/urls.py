from django.urls import path
from .views import BookCreateView

urlpatterns = [
    path('books/', BookCreateView.as_view()),
]