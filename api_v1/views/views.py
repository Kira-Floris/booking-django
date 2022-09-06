from django.shortcuts import render
from django.db.models import Q
from django.core.exceptions import ValidationError
from django.utils.decorators import method_decorator
from django.http import Http404

from rest_framework import status, generics, mixins, status, views as generic_view
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import SearchFilter
from rest_framework.exceptions import PermissionDenied
from rest_framework import filters

from django_filters.rest_framework import DjangoFilterBackend

from api_v1.models import *
from api_v1.decorators import *
from api_v1.serializers import *
from api_v1.filters import *


class getHotels(generics.ListAPIView):
	serializer_class = HotelSerializer
	queryset = Hotel.objects.all()
	filter_backends = [DjangoFilterBackend,filters.OrderingFilter]
	filter_class = HotelFilter
	ordering_fields = ['averageCost']


class getHotel(generics.RetrieveAPIView):
	serializer_class = HotelSerializer
	queryset = Hotel.objects.all()
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class createHotel(generics.CreateAPIView):
	serializer_class = HotelSerializer
	queryset = Hotel.objects.all()

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class updateHotel(generics.RetrieveUpdateAPIView):
	serializer_class = HotelSerializer
	queryset = Hotel.objects.all()
	lookup_field = 'pk'


@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class updatePhotoHotel(generics.RetrieveUpdateAPIView):
	serializer_class = HotelPhotoSerializer
	queryset = Hotel.objects.all()
	lookup_field = 'pk'


@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class deleteHotel(generics.RetrieveDestroyAPIView):
	serializer_class = HotelSerializer
	queryset = Hotel.objects.all()
	lookup_field = 'pk'


# views for 
# Rooms
class getRooms(generics.ListAPIView):
	serializer_class = RoomSerializer
	filter_backends = [DjangoFilterBackend]

	def get_queryset(self):
		if self.kwargs['hotelId']:
			return RoomBook.objects.filter(room=self.kwargs['roomId'])
		return RoomBook.objects.all()

class getRoom(generics.RetrieveAPIView):
	serializer_class = RoomSerializer
	queryset = Room.objects.all()
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class createRoom(generics.CreateAPIView):
	serializer_class = RoomSerializer
	queryset = Room.objects.all()

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class updateRoom(generics.RetrieveUpdateAPIView):
	serializer_class = RoomSerializer
	queryset = Room.objects.all()
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class updatePhotoRoom(generics.RetrieveUpdateAPIView):
	serializer_class = RoomPhotoSerializer
	queryset = Room.objects.all()
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin','staff']), name='dispatch')
class deleteRoom(generics.RetrieveDestroyAPIView):
	serializer_class = RoomSerializer
	queryset = Room.objects.all()
	lookup_field = 'pk'


# views for 
# BOOKING ROOMS
@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class getRoomBooks(generics.ListAPIView):
	serializer_class = RoomBookSerializer
	filter_backends = [DjangoFilterBackend]

	def get_queryset(self):
		if self.request.user.role=='user':
			return RoomBook.objects.filter(user=self.request.user)
		if self.kwargs['roomId']:
			return RoomBook.objects.filter(room=self.kwargs['roomId'])
		return RoomBook.objects.all()

@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class getRoomBook(generics.RetrieveAPIView):
	serializer_class = RoomBookSerializer

	def get_object(self, pk):
		try:
			roombook = RoomBook.objects.get(pk=pk)
			serializer = RoomBookSerializer(roombook)
			if(self.request.user!=roombook.user and self.request.user.role!='admin' and self.request.user!='staff'):
				raise PermissionDenied("cannot get anonymous")
			return roombook
		except RoomBook.DoesNotExist:
			raise Http404


@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class createRoomBook(generics.CreateAPIView):
	serializer_class = RoomBookSerializer
	queryset = RoomBook.objects.all()

@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class updateRoomBook(generics.RetrieveUpdateAPIView):
	serializer_class = RoomBookSerializer
	
	def get_object(self, pk):
		try:
			roombook = RoomBook.objects.get(pk=pk)
			serializer = RoomBookSerializer(roombook)
			if(self.request.user!=roombook.user and self.request.user.role!='admin' and self.request.user!='staff'):
				raise PermissionDenied("cannot get anonymous")
			return roombook
		except RoomBook.DoesNotExist:
			raise Http404

@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class deleteRoomBook(generics.RetrieveDestroyAPIView):
	serializer_class = RoomBookSerializer
	
	def get_object(self, pk):
		try:
			roombook = RoomBook.objects.get(pk=pk)
			serializer = RoomBookSerializer(roombook)
			if(self.request.user!=roombook.user and self.request.user.role!='admin' and self.request.user!='staff'):
				raise PermissionDenied("cannot get anonymous")
			return roombook
		except RoomBook.DoesNotExist:
			raise Http404

