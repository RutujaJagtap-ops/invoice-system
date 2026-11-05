from datetime import datetime, time, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from billing.models import Client, Invoice, LineItem

CLIENTS = [
    ("Acme Textiles Pvt Ltd", "accounts@acmetextiles.in", "27AABCA1234C1Z5"),
    ("Banyan Foods", "finance@banyanfoods.in", "29AAGCB7383J1Z4"),
    ("Chaitra Studio", "hello@chaitrastudio.in", ""),
    ("Deccan Logistics", "ap@deccanlogistics.in", "07AAACN2082N1Z8"),
    ("Evergreen Realty", "billing@evergreenrealty.in", ""),
]

# (client index, issued N days ago, payment terms in days, status, GST %, [(description, qty, price)])
INVOICES = [
    (0, 150, 15, "paid", 18, [("Website redesign", 1, 85000)]),
    (1, 120, 15, "paid", 18, [("Brand identity", 1, 45000), ("Logo variations", 3, 4000)]),
    (2, 95, 30, "paid", 12, [("Monthly retainer", 1, 30000)]),
    (0, 70, 15, "paid", 18, [("Landing page", 1, 32000)]),
    (3, 50, 30, "paid", 18, [("UX audit", 2, 15000)]),
    (4, 35, 15, "sent", 18, [("Mobile app UI", 1, 120000)]),
    (1, 28, 30, "sent", 18, [("Social media kit", 1, 18000)]),
    (2, 20, 30, "sent", 12, [("Monthly retainer", 1, 30000)]),
    (3, 10, 15, "sent", 18, [("Dashboard design", 1, 64000)]),
    (0, 3, 15, "draft", 18, [("Maintenance", 4, 2500)]),
    (4, 1, 15, "draft", 5, [("Illustrations", 6, 1800)]),
]


class Command(BaseCommand):
    help = "Create the demo user with sample clients and invoices (safe to re-run)."

    @transaction.atomic
    def handle(self, *args, **options):
        user, _ = get_user_model().objects.get_or_create(
            username="demo",
            defaults={"first_name": "Aarav", "last_name": "Mehta", "email": "demo@invoicesystem.in"},
        )
        user.set_password("demo12345")
        user.save()
        user.invoices.all().delete()
        user.clients.all().delete()

        clients = [Client.objects.create(owner=user, name=n, email=e, gstin=g) for n, e, g in CLIENTS]
        today = timezone.localdate()

        for client_index, age, terms, status, gst_rate, items in INVOICES:
            issued = today - timedelta(days=age)
            stamp = timezone.make_aware(datetime.combine(issued, time(10, 0)))
            invoice = Invoice.objects.create(
                owner=user,
                client=clients[client_index],
                number=Invoice.next_number(user, issued),
                issue_date=issued,
                due_date=issued + timedelta(days=terms),
                status=status,
                gst_rate=gst_rate,
                sent_at=None if status == "draft" else stamp,
                paid_at=stamp + timedelta(days=terms // 2) if status == "paid" else None,
            )
            LineItem.objects.bulk_create(
                LineItem(invoice=invoice, description=d, quantity=q, unit_price=p) for d, q, p in items
            )

        self.stdout.write(self.style.SUCCESS("Seeded: login demo / demo12345"))