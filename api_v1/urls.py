from django.urls import path, include

from api_v1.views.views import *
from api_v1.views.auth import *
from api_v1.views.utils import *

urlpatterns = [
    path('utils/contact/', sendemail, name='contact'),
    path('utils/uniquecities', getUniqueCities, name='uniquecities'),

    path('hotels/', getHotels.as_view(), name='gethotels'),
    path('hotels/create/', createHotel.as_view(), name='createhotel'),
    path('hotels/<str:pk>', getHotel.as_view(), name='gethotel'),
    path('hotels/update/<str:pk>', updateHotel.as_view(), name='updatehotel'),
    path('hotels/delete/<str:pk>', deleteHotel.as_view(), name='deletehotel'),

    path('rooms/', getRooms.as_view(), name='getrooms'),
    path('hotels/<str:hotelId>/rooms/', getRooms.as_view(), name='getrooms'),
    path('rooms/', createRoom.as_view(), name='createroom'),
    path('rooms/<str:pk>', getRoom.as_view(), name='getroom'),
    path('rooms/<str:pk>', updateRoom.as_view(), name='updateroom'),
    path('rooms/<str:pk>', deleteRoom.as_view(), name='deleteroom'),

    path('book/rooms/', getRoomBooks.as_view(), name='getroombooks'),
    path('rooms/<str:roomId>/book/', getRoomBooks.as_view(), name='getroombooks'),
    path('book/rooms/', createRoomBook.as_view(), name='createroombook'),
    path('book/rooms/<str:pk>', getRoomBook.as_view(), name='getroombook'),
    path('book/rooms/<str:pk>', updateRoomBook.as_view(), name='updateroombook'),
    path('book/rooms/<str:pk>', deleteRoomBook.as_view(), name='deleteroombook'),

    path('auth/login/', MyTokenObtainPairView.as_view(), name='login'),
    path('auth/register/', RegisterAPI.as_view(), name='register'),
    path('auth/getme/', getMe, name='getme'),
    path('auth/updatedetails/', UpdateProfile.as_view(), name='profile'),
    path('auth/updatepassword/', ChangePasswordView.as_view(), name='changepassword'),
    path('auth/forgotpassword/', forgotPassword, name='forgotpassword'),
    path('auth/resetpassword/<str:uidb64>/<str:token>/', resetPassword, name='resetpassword'),
]
