from collections import defaultdict
from interactions.models import Interaction
from books.models import Book


def get_user_genre_preferences(user):
    interactions = Interaction.objects.filter(user=user).select_related('book')

    scores = defaultdict(int)

    for interaction in interactions:
        genre = interaction.book.genre

        if not genre:
            continue

        if interaction.action == 'click':
            scores[genre] += 1
        
        elif interaction.action == 'like':
            scores[genre] += 3
        
        elif interaction.action == 'rate' and interaction.value:
            scores[genre] += interaction.value
    
    return scores

    

def get_recommended_books(user):
    preferences = get_user_genre_preferences(user)

    if not preferences:
        return Book.objects.none()
    
    sorted_genres = sorted(preferences, key=preferences.get, reverse=True)

    top_genres = sorted_genres[:2]

    seen_books = Interaction.objects.filter(user=user).values_list('book', flat=True)

    return Book.objects.filter(
        genre__in=top_genres
    ).exclude(id__in=seen_books)