from django.urls import path

from .views import TransactionViewSet

urlpatterns = [
    path("all", TransactionViewSet.as_view({"get": "list"})),
    path("create", TransactionViewSet.as_view({"post": "create"})),
    path(
        "<int:pk>", TransactionViewSet.as_view({"get": "retrieve", "delete": "destroy"})
    ),
    path(
        "period",
        TransactionViewSet.as_view(
            {"delete": "delete_transaction_period", "get": "get_recent_transaction"}
        ),
    ),
    path("report", TransactionViewSet.as_view({"get": "report_yearly_transaction"})),
]
