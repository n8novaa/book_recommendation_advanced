from django.db import models
from django.conf import settings
from books.models import Book

class Interaction(models.Model):
    ACTION_CHOICES = [
        ('click', 'Click'),
        ('like', 'Like'),
        ('rate', 'Rate'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    value = models.FloatField(null=True, blank=True)  # for ratings
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.book} - {self.action}"