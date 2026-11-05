from django.db import transaction
from rest_framework import serializers

from .models import Client, Invoice, LineItem

AMOUNT = {"max_digits": 14, "decimal_places": 2, "read_only": True}


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ["id", "name", "email", "phone", "gstin", "address"]


class LineItemSerializer(serializers.ModelSerializer):
    amount = serializers.DecimalField(**AMOUNT)

    class Meta:
        model = LineItem
        fields = ["id", "description", "quantity", "unit_price", "amount"]
        read_only_fields = ["id"]


class InvoiceSerializer(serializers.ModelSerializer):
    items = LineItemSerializer(many=True, allow_empty=False)
    client_name = serializers.CharField(source="client.name", read_only=True)
    subtotal = serializers.DecimalField(**AMOUNT)
    gst_amount = serializers.DecimalField(**AMOUNT)
    total = serializers.DecimalField(**AMOUNT)
    is_overdue = serializers.BooleanField(read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "id", "number", "client", "client_name", "issue_date", "due_date", "status",
            "gst_rate", "notes", "share_token", "sent_at", "paid_at", "items",
            "subtotal", "gst_amount", "total", "is_overdue",
        ]
        read_only_fields = ["number", "status", "share_token", "sent_at", "paid_at"]

    def validate_client(self, client):
        if client.owner_id != self.context["request"].user.id:
            raise serializers.ValidationError("Select one of your own clients.")
        return client

    def validate(self, attrs):
        if self.instance and self.instance.status == Invoice.Status.PAID:
            raise serializers.ValidationError("Paid invoices cannot be edited.")
        issue_date = attrs.get("issue_date") or getattr(self.instance, "issue_date", None)
        due_date = attrs.get("due_date") or getattr(self.instance, "due_date", None)
        if issue_date and due_date and due_date < issue_date:
            raise serializers.ValidationError({"due_date": "Due date cannot be before the issue date."})
        return attrs

    @staticmethod
    def _save_items(invoice, items):
        invoice.items.all().delete()
        LineItem.objects.bulk_create(LineItem(invoice=invoice, **item) for item in items)

    @transaction.atomic
    def create(self, validated_data):
        items = validated_data.pop("items")
        number = Invoice.next_number(validated_data["owner"], validated_data["issue_date"])
        invoice = Invoice.objects.create(number=number, **validated_data)
        self._save_items(invoice, items)
        return invoice

    @transaction.atomic
    def update(self, instance, validated_data):
        items = validated_data.pop("items", None)
        invoice = super().update(instance, validated_data)
        if items is not None:
            self._save_items(invoice, items)
        return invoice


class PublicInvoiceSerializer(InvoiceSerializer):
    issuer_name = serializers.SerializerMethodField()

    class Meta(InvoiceSerializer.Meta):
        fields = [
            "number", "client_name", "issuer_name", "issue_date", "due_date", "status",
            "gst_rate", "notes", "items", "subtotal", "gst_amount", "total", "is_overdue",
        ]

    def get_issuer_name(self, invoice):
        return invoice.owner.get_full_name() or invoice.owner.username