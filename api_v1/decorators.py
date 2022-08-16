from django.http import HttpResponseRedirect, JsonResponse
from django.core.exceptions import PermissionDenied
from django.shortcuts import redirect
from django.conf import settings

from rest_framework import status

import json
import jwt

def role_required(allowed_roles=[]):
	def decorator(func):
		def wrap(request, *args, **kwargs):
			if request.user.is_authenticated:
				if request.user.role in allowed_roles: 
					return func(request, *args, **kwargs)
				else:
					return JsonResponse({'message': "Not allowed beyond here"},status=status.HTTP_403_FORBIDDEN)
			else:
				if request.headers['Authorization']:
					token = request.headers['Authorization'].split(" ")[1]
					body = json.loads(request.body.decode('utf-8'))
					data = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
					body['user'] = data['user_id']
					body = json.dumps(body).encode('utf-8')

					d = getattr(request, '_body', request.body)
					request._body = body
					return func(request, *args, **kwargs)
				return JsonResponse({'message': "Not allowed beyond here"},status=status.HTTP_403_FORBIDDEN)

		return wrap
	return decorator