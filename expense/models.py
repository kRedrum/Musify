from django.db import models
from django.core.exceptions import ValidationError

# Create your models here.
class Expense(models.Model):

    class RecurrenceTypes(models.TextChoices):
        YEARLY = 'YRLY', 'Yearly'
        MONTHLY = 'MNTH', 'Monthly'
        WEEKLY = 'WKLY', 'Weekly'

    class ExpenseType(models.TextChoices):
        GROCERIES = 'GRCRS', 'Groceries'
        UTILITIES = 'UTLTS', 'Utilities'
        HEALTH = 'HLTH', 'Health'
        TRANSPORT = 'TRNPRT', 'Transport'
        HOME = 'HOME', 'Home'
        CLOTHING = 'CLTH', 'Clothing'
        DEBT = 'DBT', 'Debt'
        GAS = 'GS', 'Gas'
        OTHER = 'OTHR', 'Other'

    type = models.CharField(choices=ExpenseType.choices, max_length=6, default=ExpenseType.OTHER)
    carvable = models.BooleanField(null=False, blank=False, default=False)
    amount = models.PositiveIntegerField(null=False, blank=False, default=0)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    description = models.CharField(null=False, blank=True, max_length=100)
    recurrence_type = models.CharField(choices=RecurrenceTypes.choices, default=RecurrenceTypes.MONTHLY)

    def clean(self) -> None:
        if hasattr(self, 'period_end') and hasattr(self, 'period_start') and self.period_end is not None and self.period_start is not None and self.period_end < self.period_start:
            raise ValidationError({"period_end": "End must be later than start"}, code="invalid")
        return super().clean()