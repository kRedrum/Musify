import calendar

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models import (
    CASCADE,
    BigIntegerField,
    BooleanField,
    CharField,
    DateField,
    ForeignKey,
    Index,
    Model,
    PositiveIntegerField,
    Q,
    TextChoices,
    UniqueConstraint,
)


# Create your models here.
class Account(Model):
    class Types(TextChoices):
        CASH = "CSH", "Cash"
        CREDIT_CARD = "CRD", "Card"

    expire = DateField(null=True)
    status = CharField(null=False, max_length=10, default="active")
    type = CharField(choices=Types.choices, null=False, max_length=4)
    number = PositiveIntegerField(null=True, max_length=19)
    currency = CharField(null=False, max_length=3, default="HUF")
    balance = BigIntegerField(null=False, blank=False, default=0)
    description = CharField(null=False, blank=True, max_length=100)
    holder = ForeignKey(settings.AUTH_USER_MODEL, on_delete=CASCADE)

    class Meta:
        ordering = ["-expire"]
        indexes = [
            Index(fields=["holder"]),
            Index(fields=["type"]),
            Index(fields=["expire"]),
        ]
        constraints = [
            UniqueConstraint(
                condition=Q(type="CRD"), fields=["number", "holder"], name="unique-card"
            )
        ]

    def clean(self) -> None:
        if hasattr(self, "currency") is True and len(self.currency) != 3:
            raise ValidationError(
                {"currency": "Currency must be 3 characters long (ISO 4217)"},
                code="invalid",
            )
        if hasattr(self, "number") is False and self.type == "CRD":
            raise ValidationError(
                {"number": "Cards must have a number"}, code="required"
            )
        if hasattr(self, "number") and self.type == "CSH":
            raise ValidationError(
                {"number": "Cash type has no account number"}, code="invalid"
            )
        return super().clean()
