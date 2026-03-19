from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import get_user_genre_preferences

from .services import get_recommended_books
from books.serializers import BookSerializer


class TestPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences = get_user_genre_preferences(request.user)
        return Response(preferences)

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        books = get_recommended_books(request.user)

        if not books:
            return  Response({"message": "No recommendations available"})
        
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)

