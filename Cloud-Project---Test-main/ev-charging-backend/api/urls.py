from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    register_user,
    login_user,
    ChargingStationList,
    create_booking,
    BookingViewSet
)

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')

api_patterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('stations/', ChargingStationList.as_view(), name='station-list'),
    path('booking/create/', create_booking, name='create-booking'),
]

urlpatterns = [
    path('api/', include(api_patterns)),
]