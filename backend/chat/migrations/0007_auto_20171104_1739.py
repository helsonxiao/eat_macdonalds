# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0006_auto_20171104_1738'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chat',
            name='meme',
            field=models.ImageField(blank=True, upload_to='meme/', null=True),
        ),
        migrations.AlterField(
            model_name='chat',
            name='meme_result',
            field=models.ImageField(blank=True, upload_to='meme_result/', null=True),
        ),
    ]
