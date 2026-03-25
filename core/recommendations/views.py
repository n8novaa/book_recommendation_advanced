from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .services import get_user_genre_preferences

from .services import get_recommended_books, collaborative_recommendations
from books.serializers import BookSerializer

from .services import build_user_item_matrix, test_similarity

from books.models import Book


class TestPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        preferences = get_user_genre_preferences(request.user)
        return Response(preferences)

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        build_user_item_matrix()
        test_similarity()
        book_ids = collaborative_recommendations(request.user)

        books = Book.objects.filter(id__in=book_ids)

        return Response([book.title for book in books])

