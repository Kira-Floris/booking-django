from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.utils.translation import gettext_lazy as __
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.contrib import admin
from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import serializers


class MyUserManager(BaseUserManager):
	def create_user(self, email, role, password, **other_fields):
		if not email:
			raise serializers.ValidationError('enter a valid email')
		email = self.normalize_email(email)
		user = self.model(email=email, role=role, **other_fields)
		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, role, password, **other_fields):
		other_fields.setdefault('is_superuser', True)

		if other_fields.get('is_superuser') is not True:
			raise serializers.ValidationError('superuser must have is_superuser to true')

		if role != 'admin':
			raise serializers.ValidationError('superuser must have role to admin')

		return self.create_user(email, role=role, password=password, **other_fields)



class UserObject(models.Manager):
	def get_queryset(self):
		return super(UserObject,self).get_queryset().all()

class User(AbstractUser):

	class Roles(models.TextChoices):
		admin = 'admin', 'admin'
		staff = 'staff', 'staff'
		user = 'user', 'user'

	name = models.CharField(max_length=255, unique=True)
	email = models.EmailField(max_length=255, unique=True)
	role = models.CharField(max_length=255, choices=Roles.choices, default='user')

	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	is_superuser = models.BooleanField(default=False)

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['name','role']

	def __str__(self):
		return self.name

	def save(self, *args, **kwargs):
		if self.is_superuser==True:
			self.role = 'admin'
			self.is_staff=self.is_active=True
		if self.role == 'admin':
			self.is_superuser=self.is_active=self.is_staff=True
		super().save(*args, **kwargs)


	objects = MyUserManager()
	home_users = UserObject()

def photo_path(instance, filename):
	return 'uploads/{0}.jpeg'.format(instance.name)

def get_sentinel_user():
	return get_user_model().objects.get_or_create(name='deleted')[0]

class Hotel(models.Model):
	name = models.CharField(max_length=255,unique=True, null=False, blank=False)
	description = models.TextField()
	website = models.URLField(max_length=255)
	phone = models.CharField(max_length=20)
	email = models.EmailField(max_length=255)
	address = models.CharField(max_length=255)
	street = models.CharField(max_length=255)
	city = models.CharField(max_length=255)
	country = models.CharField(max_length=255)
	lat = models.FloatField(null=True, blank=True)
	lng = models.FloatField(null=True, blank=True)
	averageRating = models.FloatField(null=True, blank=True)
	averageCost = models.FloatField(null=True, blank=True)
	photo = models.ImageField(upload_to=photo_path,default='no-photo.jpg', null=True, blank=True)
	createdAt = models.DateTimeField(auto_now_add=True)
	user = models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))

	def __str__(self):
		return self.name


class Room(models.Model):
	title = models.CharField(max_length=255, blank=False, null=False)
	description = models.TextField()
	rooms = models.IntegerField()
	bath = models.IntegerField()
	price = models.FloatField()
	days = models.IntegerField()
	photo = models.ImageField(upload_to=photo_path, default='no-photo.jpg')
	createdAt = models.DateTimeField(auto_now_add=True)
	hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
	user = models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))


	def __str__(self):
		return self.title

class RoomBook(models.Model):
	start = models.DateTimeField(default=timezone.now, null=False, blank=False)
	end = models.DateTimeField(default=timezone.now()+timedelta(1), null=False, blank=False)
	title = models.CharField(max_length=255)
	createdAt = models.DateTimeField(auto_now_add=True)
	room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True)
	days = models.IntegerField()
	cost = models.FloatField()
	user = models.ForeignKey(User, on_delete=models.SET(get_sentinel_user))

