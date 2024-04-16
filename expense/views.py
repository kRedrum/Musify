from rest_framework import status
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .models import Expense
from .serializers import ExpenseSerializer
from rest_framework.request import Request
from django.utils import timezone

# Create your views here.
class ExpenseViewSet(ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        current_date = timezone.now().date()
        default_params = {
            'type': None,
            'account': None,
            'carvable': None,
            'recurrence_type': None,
            'period_start': None,
            'period_end': current_date,
        }

        # dictionary comprehension
        params = { key: self.request.GET.get(key, default) for key, default in default_params.items() }

        if params['period_start']:
            return self.queryset.filter(period_start__gte=params['period_start'], period_end__lte=params['period_end'])

        if params['account']:
            return self.queryset.filter(account=params['account'])
        
        if params['type']:
            # check if in enum
            return self.queryset.filter(type=params['type'])

        if params['carvable']:
            return self.queryset.filter(carvable=params['carvable'])

        if params['recurrence_type']:
            # check if in enum
            return self.queryset.filter(reccurence_type=params['recurrence_type'])

        return self.queryset
    
    def delete_by_period(self, request: Request):
        self.queryset.filter(period_start__gte=request.POST.get('period_start'), 
                             period_end__lte=request.POST.get('period_end'), 
                             ).delete()
        return Response(status=status.HTTP_200_OK, data="Deleted")

    def delete_by_type(self):
        # delete record with certain type in given period
        pass
    