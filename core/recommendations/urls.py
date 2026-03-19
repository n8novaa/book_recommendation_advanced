from django.urls import path
from .views import TestPreferenceView

urlpatterns = [
    path('test-preferences/', TestPreferenceView.as_view()),
]