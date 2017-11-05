from rest_framework.routers import DefaultRouter
from django.conf.urls import url
from . import views

router = DefaultRouter()
router.register(r'chat', views.ChatViewSet)
urlpatterns = router.urls

# urlpatterns = urlpatterns + [
#     url(r'^upload_script/', views.upload_script),
# ]