from django.urls import path
from .views import InteractionView

urlpatterns = [
    path('', InteractionView.as_view()),
]