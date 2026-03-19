from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import get_user_genre_preferences


class TestPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences = get_user_genre_preferences(request.user)
        return Response(preferences)


