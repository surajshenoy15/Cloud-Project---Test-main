from django.db import models
from django.contrib.auth.models import User

class ChargingStation(models.Model):
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    operator = models.CharField(max_length=100)
    available_ports = models.IntegerField(default=2)
    charging_types = models.JSONField()  # Store types like ["AC", "DC", "Type2"]
    power_output = models.CharField(max_length=50)  # e.g., "50 kW"
    price_per_kwh = models.DecimalField(max_digits=6, decimal_places=2)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.5)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    station_id = models.CharField(max_length=100)
    station_name = models.CharField(max_length=255)
    booking_time = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField(help_text="Duration in hours")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    charger_type = models.CharField(max_length=50)

    @property
    def total_amount(self):
        return self.price * self.duration

    def __str__(self):
        return f"{self.user.username} - {self.station_name} - {self.booking_time}"