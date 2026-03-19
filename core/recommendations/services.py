from collections import Counter
from interactions.models import Interaction
from books.models import Book


def get_user_genre_preferences(user):
    interactions = Interaction.objects.filter(user=user).select_related('book')

    genres = []

    for interaction in interactions:
        if interaction.book and interaction.book.genre:
            genres.append(interaction.book.genre)

    return Counter(genres)


def get_recommended_books(user):
    preferences = get_user_genre_preferences(user)

    if not preferences:
        return Book.objects.none()

    top_genres = [genre for genre, _ in preferences.most_common(2)]

    seen_books = Interaction.objects.filter(user=user).values_list('book', flat=True)

    return Book.objects.filter(
        genre__in=top_genres
    ).exclude(id__in=seen_books)