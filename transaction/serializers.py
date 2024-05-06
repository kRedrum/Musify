from rest_framework.serializers import BaseSerializer, IntegerField, ModelSerializer

from .models import Transactions


class TransactionSerializer(ModelSerializer):
    class Meta:
        model = Transactions
        fields = "__all__"
