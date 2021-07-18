from django.contrib import admin

# Register your models here.
from store.models import user

admin.site.register(user, admin.ModelAdmin)
