from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    preference = models.JSONField(default=dict)


