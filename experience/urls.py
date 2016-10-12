from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^fog/$', views.fog, name='fog'),
]

# url(r'^admin/', admin.site.urls),
