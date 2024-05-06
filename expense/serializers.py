from rest_framework.serializers import ModelSerializer

from .models import Expense


class ExpenseSerializer(ModelSerializer):
    class Meta:
        model = Expense
        fields = "__all__"
