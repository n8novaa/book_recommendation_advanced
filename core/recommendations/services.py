from collections import defaultdict
from interactions.models import Interaction
from books.models import Book
from django.db.models import Count
import math


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

    books = Book.objects.filter(
        genre__in=top_genres
    ).exclude(
        id__in=seen_books
    ).annotate(
        interaction_count=Count('interaction')
    )

    ranked_books = sorted(
        books,
        key=lambda book: (
          preferences.get(book.genre, 0) * 2 + book.interaction_count  
        ),
        reverse=True

    )

    return ranked_books

def build_user_item_matrix():
    interactions = Interaction.objects.all().select_related('user', 'book')

    matrix = defaultdict(lambda: defaultdict(int))

    for interaction in interactions:
        user_id = interaction.user.id
        book_id = interaction.book.id

        if interaction.action == 'click':
            matrix[user_id][book_id] = min(matrix[user_id][book_id] + 1, 3)
        
        elif interaction.action == 'like':
            matrix[user_id][book_id] += 3

        elif interaction.action == 'rate':
            if interaction.value is not None:
                matrix[user_id][book_id] += interaction.value

    print("\n=== USER-ITEM MATRIX ===")
    for user, books in matrix.items():
        print(f"User {user}: {dict(books)}")

    return matrix

def cosine_similarity(user1, user2):
    common_books = set(user1.keys()) & set(user2.keys())

    if not common_books:
        return 0
    
    dot_product = sum(user1[b] * user2[b] for b in common_books)

    norm1 = math.sqrt(sum(v**2 for v in user1.values()))
    norm2 = math.sqrt(sum(v**2 for v in user2.values()))

    if norm1 == 0 or norm2 == 0:
        return 0
    
    return dot_product / (norm1 * norm2)


def test_similarity():
    matrix = build_user_item_matrix()

    users = list(matrix.keys())

    if len(users) < 2:
        print("Not enough users to compare")
        return

    u1 = users[0]
    u2 = users[1]

    sim = cosine_similarity(matrix[u1], matrix[u2])

    print(f"\nSimilarity between User {u1} and User {u2}: {sim}")