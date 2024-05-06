from django.urls import path

from .views import IncomeViewSet

urlpatterns = [
    path("<int:pk>", IncomeViewSet.as_view({"get": "retrieve"})),
    path("all", IncomeViewSet.as_view({"get": "list"})),
    path("create", IncomeViewSet.as_view({"post": "create"})),
]
