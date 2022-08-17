from django.shortcuts import render
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.conf import settings
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.urls import reverse

from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
import json

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.models import User

from api_v1.serializers import *
from api_v1.models import *
from api_v1.decorators import *
from api_v1.utils import *

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

@api_view(['GET'])
@role_required(allowed_roles=['admin','staff','user'])
def getMe(request):
	if request.headers['Authorization']:
		try:
			token = request.headers['Authorization'].split(" ")[1]
			data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
			user = User.objects.get(id=data['user_id'])
			serializer = ProfileSerializer(user, many=False)
			return Response(serializer.data)
		except:
			return JsonResponse({'message':"Token Invalid"}, status=status.HTTP_403_FORBIDDEN)

	return JsonResponse({'message':'Not Authorized beyond this'},status=status.HTTP_403_FORBIDDEN)

class UpdateProfile(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = ProfileSerializer
	model = User
	
	def get_object(self, queryset=None):
		obj = self.request.user
		return obj

@api_view(['POST'])
def forgotPassword(request):
	body = json.loads(request.body.decode('utf-8'))
	try:
		user = User.objects.get(email=body['email'])
	except User.DoesNotExist:
		return JsonResponse({'message':"object does not exist"}, status=status.HTTP_404_NOT_FOUND)
	subject = 'Account Password Reset Email'
	token = token_generator.make_token(user)
	password_reset_token = urlsafe_base64_encode(force_bytes(user.id))

	link = request.headers['host']+"/api/auth/resetpassword/"+password_reset_token+"/"+token+"/"
	message = f'Hi {user.name},\n\nYou were sent this email due to a request for password reset.\nIf it was you continue with this link.\nLink: {link}\n\nThanks!'
	try:
		send_mail(subject, message, settings.EMAIL_HOST_USER, [body['email']])
	except:
		return JsonResponse({'message':'There was an error sending the email.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	return JsonResponse({'message':'Email Sent, Check the email provided'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def resetPassword(request,uidb64, token):
	try:
		pk = urlsafe_base64_decode(uidb64).decode('utf-8')
		user = User.objects.get(id=pk)
		if not token_generator.check_token(user, token):
			return JsonResponse({'message':'Invalid Token'}, status=status.HTTP_400_BAD_REQUEST)
		body = json.loads(request.body.decode('utf-8'))
		user.set_password(body['password'])
		user.save()
		return JsonResponse({'message':'Password Reset Successfully'}, status=status.HTTP_200_OK)
	except:
		return JsonResponse({'message':'Something went wrong'}, status=status.HTTP_400_BAD_REQUEST)


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




