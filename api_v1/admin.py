from django.contrib import admin

# Register your models here.
from api_v1.models import *

ls = [User, Hotel, Room, RoomBook]

for item in ls:
	admin.site.register(item)
