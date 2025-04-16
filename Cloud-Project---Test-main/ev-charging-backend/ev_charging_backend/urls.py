from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'api/bookings', views.BookingViewSet, basename='booking')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),  # Include router URLs
    path('api/register/', views.register_user),
    path('api/login/', views.login_user),
    path('api/stations/', views.ChargingStationList.as_view()),
]