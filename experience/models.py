from django.db import models

class Guest(models.Model):
    firstName = models.CharField(max_length=200)
    lastName = models.CharField(max_length=200)
    arrivalDate = models.DateTimeField('arrival date')

    def __str__(self):
        return self.firstName + ' ' + self.lastName
