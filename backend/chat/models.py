from django.conf import settings
from django.db import models


class Chat(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True)
    text = models.CharField(max_length=150, blank=True)
    meme = models.ImageField(blank=True, null=True, upload_to="meme/")
    sentiments = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.text
