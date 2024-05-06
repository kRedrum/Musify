from django.urls import path

from .views import add_account, delete_account, list_accounts, modify_account, retrieve

urlpatterns = [
    path("", add_account),
    path("", list_accounts),
    path("detail/<int:pk>/", retrieve, name="retrieve_account"),
    path("detail/<int:pk>/", delete_account, name="retrieve_account"),
    path("detail/<int:pk>/", modify_account, name="retrieve_account"),
]
