from django.contrib import admin

from .models import Client, Invoice, LineItem


class LineItemInline(admin.TabularInline):
    model = LineItem
    extra = 0


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ("number", "client", "status", "due_date")
    list_filter = ("status",)
    inlines = [LineItemInline]


admin.site.register(Client)