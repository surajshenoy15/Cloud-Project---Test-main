from rest_framework import status, generics
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Q
from .models import ChargingStation, Booking
from .serializers import UserSerializer, ChargingStationSerializer, BookingSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Booking
from .serializers import BookingSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'user': serializer.data
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            'user': UserSerializer(user).data
        })
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class ChargingStationList(generics.ListAPIView):
    serializer_class = ChargingStationSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = ChargingStation.objects.filter(is_active=True)
        charging_type = self.request.query_params.get('charging_type', None)
        min_power = self.request.query_params.get('min_power', None)
        max_price = self.request.query_params.get('max_price', None)

        if charging_type:
            queryset = queryset.filter(charging_types__contains=[charging_type])
        if min_power:
            queryset = queryset.filter(power_output__gte=min_power)
        if max_price:
            queryset = queryset.filter(price_per_kwh__lte=max_price)

        return queryset

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_booking(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Remove select_related since station is not a foreign key
        return Booking.objects.filter(user=self.request.user).order_by('-booking_time')

    def perform_create(self, serializer):
        # Use station_id and station_name directly since they're fields in the Booking model
        serializer.save(
            user=self.request.user,
            station_id=self.request.data.get('station_id'),
            station_name=self.request.data.get('station_name')
        )

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'pending':
            booking.status = 'cancelled'
            booking.save()
            return Response({'status': 'booking cancelled'})
        return Response(
            {'error': 'Booking cannot be cancelled'}, 
            status=status.HTTP_400_BAD_REQUEST
        )