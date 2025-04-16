from django.contrib import admin
from .models import ChargingStation, Booking

@admin.register(ChargingStation)
class ChargingStationAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'operator', 'available_ports', 'power_output', 'price_per_kwh', 'rating', 'is_active')
    list_filter = ('operator', 'charging_types', 'is_active')
    search_fields = ('name', 'location', 'address')
    ordering = ('name',)

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'station_name', 'user', 'booking_time', 'total_amount', 'status')
    list_filter = ('status', 'station_name', 'booking_time')  # Fixed field name
    search_fields = ('station_name', 'user__username')
    readonly_fields = ('booking_time',)
    ordering = ('-booking_time',)
    
    def total_amount(self, obj):
        return obj.total_amount
    total_amount.short_description = 'Total Amount'