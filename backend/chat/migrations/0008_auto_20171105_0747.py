# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0007_auto_20171104_1739'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='chat',
            name='meme_result',
        ),
        migrations.RemoveField(
            model_name='chat',
            name='text_result',
        ),
        migrations.AddField(
            model_name='chat',
            name='sentiments',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
