from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView

from .views import (
    ClientViewSet, DashboardSummaryView, InvoiceViewSet, MeView, PublicInvoiceView,
)

router = DefaultRouter()
router.register("clients", ClientViewSet, basename="client")
router.register("invoices", InvoiceViewSet, basename="invoice")

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view()),
    path("auth/me/", MeView.as_view()),
    path("dashboard/summary/", DashboardSummaryView.as_view()),
    path("public/invoices/<uuid:token>/", PublicInvoiceView.as_view()),
    *router.urls,
]