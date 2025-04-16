from django.core.management.base import BaseCommand
from api.models import ChargingStation

class Command(BaseCommand):
    help = 'Load initial charging station data'

    def handle(self, *args, **kwargs):
        stations = [
            {
                'name': 'Tata Power Charging Hub',
                'location': 'Indiranagar',
                'address': '100 Feet Road, Indiranagar, Bangalore',
                'latitude': '12.9784',
                'longitude': '77.6408',
                'operator': 'Tata Power',
                'available_ports': 4,
                'charging_types': ['DC', 'Type2', 'CCS2'],
                'power_output': '50 kW',
                'price_per_kwh': 12.00,
                'rating': 4.8,
            },
            {
                'name': 'BESCOM EV Station',
                'location': 'Koramangala',
                'address': '80 Feet Road, Koramangala, Bangalore',
                'latitude': '12.9279',
                'longitude': '77.6271',
                'operator': 'BESCOM',
                'available_ports': 3,
                'charging_types': ['AC', 'Type2'],
                'power_output': '22 kW',
                'price_per_kwh': 8.00,
                'rating': 4.2,
            },
            {
                'name': 'Ather Grid',
                'location': 'HSR Layout',
                'address': '27th Main, HSR Layout, Bangalore',
                'latitude': '12.9116',
                'longitude': '77.6474',
                'operator': 'Ather Energy',
                'available_ports': 2,
                'charging_types': ['AC', 'DC'],
                'power_output': '25 kW',
                'price_per_kwh': 15.00,
                'rating': 4.6,
            },
            {
                'name': 'ChargeZone Hub',
                'location': 'Whitefield',
                'address': 'ITPL Main Road, Whitefield, Bangalore',
                'latitude': '12.9698',
                'longitude': '77.7500',
                'operator': 'ChargeZone',
                'available_ports': 6,
                'charging_types': ['DC', 'CCS2', 'CHAdeMO'],
                'power_output': '60 kW',
                'price_per_kwh': 14.00,
                'rating': 4.4,
            },
            {
                'name': 'Magenta ChargeGrid',
                'location': 'Electronic City',
                'address': 'Phase 1, Electronic City, Bangalore',
                'latitude': '12.8399',
                'longitude': '77.6770',
                'operator': 'Magenta Power',
                'available_ports': 4,
                'charging_types': ['AC', 'DC', 'Type2'],
                'power_output': '30 kW',
                'price_per_kwh': 10.00,
                'rating': 4.3,
            },
        ]

        for station_data in stations:
            ChargingStation.objects.get_or_create(**station_data)
        
        self.stdout.write(self.style.SUCCESS('Successfully loaded initial data'))