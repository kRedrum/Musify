from django.core.exceptions import ValidationError
from django.db import models


# Create your models here.
# Create your models here.
class Income(models.Model):
    class Types(models.TextChoices):
        YEARLY = "YRLY", "Yearly"
        MONTHLY = "MNTH", "Monthly"
        WEEKLY = "WKLY", "Weekly"

    name = models.CharField(null=False, blank=False)
    amount = models.PositiveIntegerField(null=True, blank=False)
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    type = models.CharField(choices=Types.choices, blank=False, null=False)

    def clean(self) -> None:
        print(self.period_end)
        if (
            hasattr(self, "period_end")
            and hasattr(self, "period_start")
            and self.period_start is not None
            and self.period_end is not None
            and self.period_end < self.period_start
        ):
            raise ValidationError(
                {"period_end": "End must be later than start"}, code="invalid"
            )
        return super().clean()
