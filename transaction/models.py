from django.db import models
from django.db.models import Index

from expense.models import Expense
from income.models import Income

# Create your models here.


class Transactions(models.Model):
    expense = models.ForeignKey(
        Expense, on_delete=models.SET_NULL, null=True, default=None, blank=True
    )
    income = models.ForeignKey(
        Income, on_delete=models.SET_NULL, null=True, default=None, blank=True
    )
    account = models.ForeignKey("account.Account", on_delete=models.CASCADE, null=True)
    name = models.CharField(null=False, blank=True)
    amount = models.PositiveIntegerField(null=False, blank=False)
    date = models.DateField(null=True, blank=False)

    class Meta:
        indexes = [Index(fields=["account", "date"])]
