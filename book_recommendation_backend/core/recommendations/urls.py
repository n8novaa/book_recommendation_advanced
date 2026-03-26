from django.urls import path
from .views import TestPreferenceView, RecommendationView

urlpatterns = [
    path('test-preferences/', TestPreferenceView.as_view()),
    path('recommendations/', RecommendationView.as_view()),
]