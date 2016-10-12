from django import forms

class FogForm(forms.Form):
    duration = forms.DecimalField(min_value=1, max_value=20, required=True)
