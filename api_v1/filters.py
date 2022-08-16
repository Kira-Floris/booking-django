from django_filters import FilterSet, AllValuesFilter
from django_filters import NumberFilter, ModelMultipleChoiceFilter

from .models import *

class HotelFilter(FilterSet):
	class Meta:
		model = Hotel
		fields = ('name','description','city','address','street','country')

class RoomFilter(FilterSet):
	class Meta:
		model = Room
		fields = ('title','description')