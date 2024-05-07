import datetime

from django.db.models import Case, Exists, IntegerField, Q, Sum, Value, When
from django.db.models.functions import Extract
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from account.models import Account

from .models import Transactions
from .serializers import TransactionSerializer

VALID_PERIODS = [7, 14, 30]


class TransactionViewSet(ModelViewSet):
    queryset = Transactions.objects.all()
    serializer_class = TransactionSerializer

    def create(self, request: Request, *args, **kwargs):
        account_id = request.data["account"]
        account: Account = Account.objects.get(id=account_id)
        account.balance -= request.data["amount"]
        account.save()
        return super().create(request, *args, **kwargs)

    def update(self, request: Request, *args, **kwargs):
        account_id = request.data["account"]
        account: Account = Account.objects.get(id=account_id)
        account.balance = request.data["amount"]
        account.save()
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *args, **kwargs):
        account_id = request.data["account"]
        account: Account = Account.objects.get(id=account_id)
        account.balance += request.data["amount"]
        account.save()
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=["DELETE"])
    def delete_transaction_period(self, request: Request):
        start = request.GET.get("start")
        end = request.GET.get("end")
        qs = Transactions.objects.filter(date__gte=start, date__lte=end)
        qs.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=["GET"])
    def get_recent_transaction(self, request: Request):
        days = int(request.GET.get("days"))
        if days not in VALID_PERIODS:
            return Response(
                status=status.HTTP_400_BAD_REQUEST,
                data="Not a valid Period. Valid Periods are {{VALID_PERIODS.join(', ')}}",
            )
        date = timezone.now().date() - days
        qs = Transactions.objects.filter(date__gte=date)
        serializer = TransactionSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def report_yearly_transaction(self, request: Request):
        year = request.data.get("year") or datetime.datetime.now().year
        qs = (
            Transactions.objects.annotate(
                year=Extract("date", "year", output_field=IntegerField()),
                month=Extract("date", "month", output_field=IntegerField()),
            )
            .values("year", "month")
            .annotate(
                total_amount=Sum("amount"),
                type=Case(
                    When(~Q(expense__isnull=True), then=Value("expense")),
                    When(~Q(income__isnull=True), then=Value("income")),
                ),
            )
            .order_by("year", "month")
        )
        print(qs)
        expense = []
        income = []
        for v in qs:
            type = v["type"]
            if type == "expense":
                expense.append(v)
            if type == "income":
                income.append(v)
        data = {
            "title": f"Transaction({year})",
            "report": [
                {"type": "expense", "data": expense},
                {"type": "income", "data": income},
            ],
        }
        return Response(data=data, status=status.HTTP_200_OK)
