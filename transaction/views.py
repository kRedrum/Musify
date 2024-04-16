from rest_framework.decorators import action
from rest_framework.request import Request
from rest_framework.viewsets import ModelViewSet
from .models import Transactions
from account.models import Account
from django.utils import timezone
from .serializers import TransactionSerializer
from rest_framework import status
from rest_framework.response import Response    

VALID_PERIODS = [7, 14, 30]

class TransactionViewSet(ModelViewSet):
    queryset = Transactions.objects.all()
    serializer_class = TransactionSerializer

    def create(self, request: Request, *args, **kwargs):
        account_id = request.data['account']
        account: Account = Account.objects.get(id=account_id)
        account.balance -= request.data['amount'] 
        account.save()
        return super().create(request, *args, **kwargs)    

    def update(self, request: Request, *args, **kwargs):
        account_id = request.data['account']
        account: Account = Account.objects.get(id=account_id)
        account.balance = request.data['amount']
        account.save()
        return super().update(request, *args, **kwargs)

    def destroy(self, request: Request, *args, **kwargs):
        account_id = request.data['account']
        account: Account = Account.objects.get(id=account_id)
        account.balance += request.data['amount']
        account.save()
        return super().destroy(request, *args, **kwargs)

    @action(detail=False, methods=['GET'])
    def get_recent_transaction(self, request: Request):
        days = int(request.GET.get("days"))
        if days not in VALID_PERIODS:
            return Response(status=status.HTTP_400_BAD_REQUEST, data="Not a valid Period. Valid Periods are {{VALID_PERIODS.join(', ')}}")
        date = timezone.now().date() - days
        qs = Transactions.objects.filter(date__gte=date)
        serializer = TransactionSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

