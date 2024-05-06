from django.utils import timezone
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet

from .models import Income
from .serializers import IncomeSerializer


# Create your views here.
class IncomeViewSet(ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

    def get_queryset(self):
        current_date = timezone.now().date()
        default_params = {
            "type": None,
            "account": None,
            "period_start": None,
            "period_end": current_date,
        }

        # dictionary comprehension
        params = {
            key: self.request.GET.get(key, default)
            for key, default in default_params.items()
        }

        if params["period_start"]:
            return self.queryset.filter(
                period_start__gte=params["period_start"],
                period_end__lte=params["period_end"],
            )

        if params["account"]:
            return self.queryset.filter(account=params["account"])

        if params["type"]:
            return self.queryset.filter(type=params["type"])

        return self.queryset

    def delete_by_period(self):
        # delete record in given period
        pass

    def delete_by_type(self):
        # delete record with certain type in given period
        pass
