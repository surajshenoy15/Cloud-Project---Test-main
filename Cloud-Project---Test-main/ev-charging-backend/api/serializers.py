from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Booking, ChargingStation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')
        read_only_fields = ('id',)

class ChargingStationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChargingStation
        fields = [
            'id', 'name', 'latitude', 'longitude', 'operator',
            'charging_types', 'available_ports', 'power_output',
            'price_per_kwh', 'is_active', 'rating'
        ]

class BookingSerializer(serializers.ModelSerializer):
    station = serializers.SerializerMethodField()
    formatted_date = serializers.SerializerMethodField()
    formatted_time = serializers.SerializerMethodField()
    total_amount = serializers.SerializerMethodField()
    station_details = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = [
            'id', 'station_id', 'station_name', 'booking_time', 'duration',
            'status', 'price', 'charger_type', 'station', 'formatted_date',
            'formatted_time', 'total_amount', 'station_details'
        ]
        read_only_fields = ['id', 'booking_time', 'status']

    def get_station(self, obj):
        return {
            'name': obj.station_name,
            'location': obj.station_id,
            'type': obj.charger_type,
            'price': str(obj.price)
        }

    def get_formatted_date(self, obj):
        return obj.booking_time.strftime('%Y-%m-%d')

    def get_formatted_time(self, obj):
        return obj.booking_time.strftime('%H:%M')

    def get_total_amount(self, obj):
        return float(obj.price) * obj.duration

    def get_station_details(self, obj):
        try:
            station = ChargingStation.objects.get(id=obj.station_id)
            return {
                'name': station.name,
                'location': station.location,
                'operator': station.operator,
                'power_output': station.power_output,
                'price_per_kwh': str(station.price_per_kwh)
            }
        except ChargingStation.DoesNotExist:
            return None