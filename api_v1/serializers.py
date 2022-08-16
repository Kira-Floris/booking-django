from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id','name','email','password')
		extra_kwargs = {'password':{'write_only':True}}

	def create(self, validated_data):
		user = User.objects.create_user(validated_data['username']
			, validated_data['email']
			, make(validated_data['password']))
		return user

class ProfileSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ('id','name','email')


class HotelSerializer(serializers.ModelSerializer):
	class Meta:
		model = Hotel
		fields = '__all__'

class HotelPhotoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Hotel
		fields = ('photo')

class RoomSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = '__all__'

class RoomPhotoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Room
		fields = ('photo')

class RoomBookSerializer(serializers.ModelSerializer):
	class Meta:
		model = RoomBook
		fields = ('start','end','title','days','cost','user','room')

class ContactSerializer(serializers.Serializer):
	email = serializers.CharField(allow_blank=False, allow_null=False)
	names = serializers.CharField(max_length=200, allow_null=True)
	subject = serializers.CharField(max_length=200,allow_blank=False, allow_null=False)
	message = serializers.CharField(allow_blank=False, allow_null=False)


class PasswordChangeSerializer(serializers.Serializer):
	oldpassword = serializers.CharField(required=True)
	newpassword = serializers.CharField(required=True)

class CitiesSerializer(serializers.Serializer):
	city = serializers.CharField()