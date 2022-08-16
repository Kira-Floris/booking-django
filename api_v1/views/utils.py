from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail, EmailMessage, BadHeaderError
from django.conf import settings
from django.core.exceptions import ValidationError
import json

from rest_framework.response import Response

from api_v1.serializers import *
from api_v1.models import *

@api_view(['POST'])
def sendemail(request):
	serializer = ContactSerializer(data=request.data)
	if request.method == "POST":
		if serializer.is_valid():
			payloads = json.dumps(request.data)
			payload = json.loads(payloads)
			email = payload['email']
			names = payload['names']
			subject = payload['subject']
			message = payload['message']
			msg = message + "\n\nFrom: " +names+ "\nEmail: "+email

			try:
				send_mail(subject, msg, email, [settings.EMAIL_HOST_USER])
			except BadHeaderError:
				return Response(BadHeaderError, status=status.HTTP_400_BAD_REQUEST)

			return Response({'message':'Thanks '+names+', your message was received, and we will respond to the email provided.'})
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
	
@api_view(['GET'])
def getUniqueCities(request):
	cities = Hotels.objects.all().values_list('city')
	cities = set(cities)
	serializers = CitiesSerializer(cities, many=True)
	return Response(serializer.data)
