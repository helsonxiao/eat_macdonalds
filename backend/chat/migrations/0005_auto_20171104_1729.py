# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0004_auto_20171104_1728'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='meme',
            field=models.ImageField(upload_to='meme', blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='chat',
            name='meme_result',
            field=models.ImageField(upload_to='meme_result', blank=True, null=True),
        ),
    ]
