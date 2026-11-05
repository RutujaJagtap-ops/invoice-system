import uuid
from decimal import ROUND_HALF_UP, Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.utils import timezone

GST_RATES = (0, 5, 12, 18, 28)
GSTIN_VALIDATOR = RegexValidator(
    r"^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$", "Enter a valid 15-character GSTIN."
)


def validate_gst_rate(value):
    if value not in GST_RATES:
        raise ValidationError("GST rate must be one of 0, 5, 12, 18 or 28.")


def money(value):
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class Client(models.Model):
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="clients")
    name = models.CharField(max_length=120)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    gstin = models.CharField(max_length=15, blank=True, validators=[GSTIN_VALIDATOR])
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class Invoice(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        SENT = "sent", "Sent"
        PAID = "paid", "Paid"

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invoices")
    client = models.ForeignKey(Client, on_delete=models.PROTECT, related_name="invoices")
    number = models.CharField(max_length=20)
    issue_date = models.DateField()
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.DRAFT)
    gst_rate = models.DecimalField(max_digits=5, decimal_places=2, default=18, validators=[validate_gst_rate])
    notes = models.TextField(blank=True)
    share_token = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["owner", "number"], name="unique_invoice_number_per_owner")
        ]

    def __str__(self):
        return self.number

    @classmethod
    def next_number(cls, owner, issue_date):
        prefix = f"INV-{issue_date.year}-"
        last = (
            cls.objects.filter(owner=owner, number__startswith=prefix)
            .order_by("-number")
            .values_list("number", flat=True)
            .first()
        )
        sequence = int(last.rsplit("-", 1)[1]) + 1 if last else 1
        return f"{prefix}{sequence:04d}"

    @property
    def subtotal(self):
        return sum((item.amount for item in self.items.all()), Decimal("0.00"))

    @property
    def gst_amount(self):
        return money(self.subtotal * self.gst_rate / 100)

    @property
    def total(self):
        return self.subtotal + self.gst_amount

    @property
    def is_overdue(self):
        return self.status == self.Status.SENT and self.due_date < timezone.localdate()


class LineItem(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    description = models.CharField(max_length=255)
    quantity = models.DecimalField(max_digits=8, decimal_places=2, validators=[MinValueValidator(Decimal("0.01"))])
    unit_price = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(Decimal("0"))])

    class Meta:
        ordering = ["id"]

    @property
    def amount(self):
        return money(self.quantity * self.unit_price)