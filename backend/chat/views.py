import json

from .models import Chat

from rest_framework.response import Response
from rest_framework import viewsets, filters
from .serializers import ChatSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.parsers import MultiPartParser, FormParser

import os.path


class ChatViewSet(viewsets.ModelViewSet):
    serializer_class = ChatSerializer
    queryset = Chat.objects.all()
    search_fields = '__all__'
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    # filter_fields = ('user',)
    parser_classes = (MultiPartParser, FormParser,)

    def create(self, request, *args, **kwargs):
        image = request.FILES.get('image')
        if image:
            meme_dir = 'meme/'
            if not os.path.exists(meme_dir):
                os.makedirs(meme_dir)

            image_url = meme_dir + request.FILES['image'].name
            with open(image_url, 'wb+') as temp_file:
                for chunk in image.chunks():
                    temp_file.write(chunk)

            new_chat = Chat.objects.create(
                text=request.data.get('text', ''),
                meme=request.data.get('meme', image_url),
                sentiments=json.loads(request.data.get('sentiments', '')),
                # user=request.user,
            )
            serializer = ChatSerializer(new_chat)
            return Response(serializer.data)

        new_chat = Chat.objects.create(
            text=request.data.get('text', ''),
            meme=request.data.get('meme'),
            sentiments=json.loads(request.data.get('sentiments', '')),
            # user=request.user,
        )
        serializer = ChatSerializer(new_chat)
        return Response(serializer.data)

