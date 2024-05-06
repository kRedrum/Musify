from django.urls import path

from .views import ExpenseViewSet

urlpatterns = [
    path("", ExpenseViewSet.as_view({"get": "retrieve"})),
    path("all", ExpenseViewSet.as_view({"get": "list"})),
    path("create", ExpenseViewSet.as_view({"post": "create"})),
]
