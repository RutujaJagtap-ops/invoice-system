from collections import Counter, defaultdict
from decimal import Decimal

from django.utils import timezone
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.generics import RetrieveAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Client, Invoice
from .serializers import ClientSerializer, InvoiceSerializer, PublicInvoiceSerializer

ZERO = Decimal("0.00")


class StandardPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class OwnedModelViewSet(viewsets.ModelViewSet):
    """Every query is scoped to the requesting user; owner is stamped on create."""

    pagination_class = StandardPagination

    def get_queryset(self):
        return super().get_queryset().filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ClientViewSet(OwnedModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "email"]
    ordering_fields = ["name", "email"]
    def perform_destroy(self, instance):
        if instance.invoices.exists():
            raise ValidationError("This client has invoices. Delete or reassign them first.")
        instance.delete()


class InvoiceViewSet(OwnedModelViewSet):
    queryset = Invoice.objects.select_related("client").prefetch_related("items")
    serializer_class = InvoiceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["number", "client__name"]
    ordering_fields = ["issue_date", "due_date", "created_at"]
    ordering = ["-created_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        client = self.request.query_params.get("client", "")
        if client.isdigit():
            queryset = queryset.filter(client_id=client)
        status = self.request.query_params.get("status")
        if status == "overdue":
            return queryset.filter(status=Invoice.Status.SENT, due_date__lt=timezone.localdate())
        if status in Invoice.Status.values:
            return queryset.filter(status=status)
        return queryset

    def perform_destroy(self, instance):
        if instance.status != Invoice.Status.DRAFT:
            raise ValidationError("Only draft invoices can be deleted.")
        instance.delete()

    def _transition(self, source, target, stamp_field):
        invoice = self.get_object()
        if invoice.status != source:
            raise ValidationError(f"Only {source} invoices can be marked {target}.")
        invoice.status = target
        setattr(invoice, stamp_field, timezone.now())
        invoice.save(update_fields=["status", stamp_field])
        return Response(self.get_serializer(invoice).data)

    @action(detail=True, methods=["post"])
    def send(self, request, pk=None):
        return self._transition(Invoice.Status.DRAFT, Invoice.Status.SENT, "sent_at")

    @action(detail=True, methods=["post"], url_path="mark-paid")
    def mark_paid(self, request, pk=None):
        return self._transition(Invoice.Status.SENT, Invoice.Status.PAID, "paid_at")


def last_months(today, count=6):
    year, month, keys = today.year, today.month, []
    for _ in range(count):
        keys.append(f"{year}-{month:02d}")
        year, month = (year - 1, 12) if month == 1 else (year, month - 1)
    return keys[::-1]


class DashboardSummaryView(APIView):
    """Computed in Python for demo scale; move to DB aggregation if the data grows."""

    def get(self, request):
        invoices = list(Invoice.objects.filter(owner=request.user).prefetch_related("items"))
        sent = [i for i in invoices if i.status == Invoice.Status.SENT]
        overdue = [i for i in sent if i.is_overdue]

        revenue = defaultdict(Decimal)
        for invoice in invoices:
            if invoice.status == Invoice.Status.PAID:
                revenue[timezone.localtime(invoice.paid_at).strftime("%Y-%m")] += invoice.total

        today = timezone.localdate()
        counts = Counter(i.status for i in invoices)
        return Response({
            "outstanding": sum((i.total for i in sent), ZERO),
            "overdue_amount": sum((i.total for i in overdue), ZERO),
            "overdue_count": len(overdue),
            "paid_this_month": revenue[today.strftime("%Y-%m")],
            "counts": {status: counts[status] for status in Invoice.Status.values},
            "monthly_revenue": [{"month": key, "total": revenue[key]} for key in last_months(today)],
        })


class MeView(APIView):
    def get(self, request):
        user = request.user
        return Response({
            "id": user.id,
            "username": user.username,
            "name": user.get_full_name() or user.username,
            "email": user.email,
        })


class PublicInvoiceView(RetrieveAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = PublicInvoiceSerializer
    queryset = (
        Invoice.objects.select_related("client", "owner")
        .prefetch_related("items")
        .exclude(status=Invoice.Status.DRAFT)
    )
    lookup_field = "share_token"
    lookup_url_kwarg = "token"



    