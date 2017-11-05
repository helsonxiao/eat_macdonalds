from .models import Chat


def resolve(request):
    if request.action == 'POST':
        meme = request.FILES.get('pic')
        if meme:
            img_url = '../meme/' + request.FILES.name
            with open(img_url, 'wb') as pic:
                pic.wirte(meme)

            return Chat.objects.create(
                meme=img_url,
                text=request.data.text,
            )

        return Chat.objects.create(
            text=request.data.text,
        )