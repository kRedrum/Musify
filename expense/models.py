from django.core.exceptions import ValidationError
from django.db import models


# Create your models here.
class Expense(models.Model):
    class RecurrenceTypes(models.TextChoices):
        YEARLY = "YRLY", "Yearly"
        MONTHLY = "MNTH", "Monthly"
        WEEKLY = "WKLY", "Weekly"

    class ExpenseType(models.TextChoices):
        ENTERTAINMENT = "Entertainment"
        GROCERIES = "Groceries"
        UTILITIES = "Utilities"
        HEALTH = "Health"
        TRANSPORT = "Transport"
        HOME = "Home"
        CLOTHING = "Clothing"
        DEBT = "Debt"
        GAS = "Gas"
        OTHER = "Other"

    type = models.CharField(choices=ExpenseType.choices, default=ExpenseType.OTHER)
    carvable = models.BooleanField(null=False, blank=False, default=False)
    amount = models.PositiveIntegerField(null=False, blank=False, default=0)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    description = models.CharField(null=False, blank=True, max_length=100)
    recurrence_type = models.CharField(
        choices=RecurrenceTypes.choices, default=RecurrenceTypes.MONTHLY
    )

    def __str__(self) -> str:
        return f"{self.type} | {self.period_start} - {self.period_end} | {self.description}"

    def clean(self) -> None:
        if (
            hasattr(self, "period_end")
            and hasattr(self, "period_start")
            and self.period_end is not None
            and self.period_start is not None
            and self.period_end < self.period_start
        ):
            raise ValidationError(
                {"period_end": "End must be later than start"}, code="invalid"
            )
        return super().clean()
