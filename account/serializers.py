from datetime import date

from rest_framework.serializers import ListField, ModelSerializer, ValidationError

from .models import Account


class AccountSerializer(ModelSerializer):
    class Meta:
        model = Account
        fields = "__all__"

    def validate(self, attrs):
        if attrs["type"] == "IBAN" and 15 < len(attrs["number"]) < 34:
            raise ValidationError(
                {"number": "Ibans must have a number"}, code="required"
            )
        if attrs["type"] == "CSH" and len(attrs["number"]) > 0:
            raise ValidationError(
                {"number": "Cash type has no account number"}, code="invalid"
            )
        return super().validate(attrs)


class AccountListSerializer(ModelSerializer):
    # nrOfAccounts = Account.objects.count()
    accounts = ListField(child=AccountSerializer())
