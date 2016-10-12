from django.shortcuts import render

from .models import Guest
from .forms import FogForm
from .fog import startFog

def index(request):
    guestList = Guest.objects.all()
    context = {
        'guestList': guestList,
    }
    return render(request, 'experience/index.html', context)

def guestList(request):
    pass


def fog(request):
    if request.method == 'POST':
        form = FogForm(request.POST)

        if form.is_valid():
            duration = form.cleaned_data['duration']
            startFog(duration)
            # return HttpResponseRedirect()

    else:
        form = FogForm()

    return render(request, 'experience/fog.html', {'form': form})
