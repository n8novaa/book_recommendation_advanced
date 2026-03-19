from collections import Counter
from interactions.models import Interaction

def get_user_genre_preferences(user):
    interactions = Interaction.objects.filter(user=user).select_related('book')

    genres = []

    for interaction in interactions:
        if interaction.book and interaction.book.genre:
            genres.append(interaction.book.genre)

    return Counter(genres)
