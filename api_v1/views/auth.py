from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator

from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User

from api_v1.serializers import *
from api_v1.models import *
from api_v1.decorators import *

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# customize token info to give username instead of id

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
	@classmethod
	def get_token(cls, user):
		token = super().get_token(user)

		# add custom claims
		token["username"] = user.username

		return token

class MyTokenObtainPairView(TokenObtainPairView):
	serializer_class = MyTokenObtainPairSerializer


class RegisterAPI(generics.GenericAPIView):
	serializer_class = RegisterSerializer

	def post(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		user = serializer.save()
		return Response({"user":"registration successful"})

@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class ProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset=User.objects.all()
    serializer_class=ProfileSerializer
    lookup_field = 'pk'

class ForgotPassword:
	pass

class ResetPassword:
	pass

@method_decorator(role_required(allowed_roles=['admin','staff','user']), name='dispatch')
class ChangePasswordView(generics.UpdateAPIView):
	serializer_class = PasswordChangeSerializer
	model = User

	def get_object(self, queryset=None):
		obj = self.request.user
		return obj

	def update(self, request, *args, **kwargs):
		self.object = self.get_object()
		serializer = self.get_serializer(data=request.data)

		if serializer.is_valid():
			if not self.object.check_password(serializer.data.get('oldpassword')):
				return Response({"oldpassword":["wrong password"]}, status=status.HTTP_400_BAD_REQUEST)
			self.object.set_password(serializer.data.get("newpassword"))
			self.object.save()
			return Response({'message':'password change successful'}, status=status.HTTP_200_OK)


@method_decorator(role_required(allowed_roles=['admin']), name='dispatch')
class GetUsers(generics.ListAPIView):
	queryset = User.objects.all()
	serializer_class = ProfileSerializer

@method_decorator(role_required(allowed_roles=['admin']), name='dispatch')
class GetUser(generics.RetrieveAPIView):
	queryset = User.objects.all()
	serializer_class = ProfileSerializer
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin']), name='dispatch')
class CreateUser(generics.CreateAPIView):
	queryset = User.objects.all()
	serializer_class = RegisterSerializer

@method_decorator(role_required(allowed_roles=['admin']), name='dispatch')
class UpdateUser(generics.UpdateAPIView):
	queryset = User.objects.all()
	serializer_class = ProfileSerializer
	lookup_field = 'pk'

@method_decorator(role_required(allowed_roles=['admin']), name='dispatch')
class DeleteUser(generics.DestroyAPIView):
	queryset = User.objects.all()
	serializer_class = ProfileSerializer
	lookup_field = 'pk'




