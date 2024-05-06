from rest_framework.decorators import api_view, permission_classes, schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_205_RESET_CONTENT,
    HTTP_403_FORBIDDEN,
)
from rest_framework.viewsets import ModelViewSet

from account.models import Account
from account.serializers import AccountListSerializer, AccountSerializer


@api_view(["GET"])
def retrieve(request: Request, pk):
    queryset = Account.objects.get(pk=pk)
    serialized = AccountSerializer(queryset, many=False)
    return Response(serialized.data, status=HTTP_200_OK)


@api_view(["GET"])
def list_accounts(request: Request) -> Response:
    user = request.user.pk
    offset = int(request.query_params.get("offset"))
    limit = int(request.query_params.get("limit"))
    accounts = Account.objects.filter(holder=user)[offset : offset + limit]
    instance = {"nrOfAccounts": len(accounts), "accounts": accounts}
    serialized = AccountListSerializer(instance=instance, many=False)
    return Response(serialized.data, status=HTTP_200_OK)


@api_view(["POST"])
def add_account(request: Request) -> Response:
    user = request.user
    account = Account(
        expire=request.POST.get("expire"),
        type=request.POST.get("type"),
        number=request.POST.get("number"),
        balance=request.POST.get("balance"),
        description=request.POST.get("description"),
        holder=user,
    )
    serialized = AccountSerializer(data=account, many=False)
    serialized.is_valid(raise_exception=True)
    return Response(data=serialized.data, status=HTTP_201_CREATED)


@api_view(["DELETE"])
def delete_account(request: Request, pk) -> Response:
    if request.POST.get("holder") != request.user.pk:
        return Response("You are not the holder of the card", status=HTTP_403_FORBIDDEN)
    pk = request.data["id"]
    account = Account.objects.get(pk=pk)
    serialized = AccountSerializer(data=account, many=False)
    account.delete()
    return Response(serialized.data, status=HTTP_204_NO_CONTENT)


@api_view(["PUT"])
def modify_account(request: Request) -> Response:
    if request.POST.get("holder") != request.user.pk:
        return Response("You are not the holder of the card", status=HTTP_403_FORBIDDEN)
    payload = request.data
    account = Account.objects.get(payload["id"])
    serialized = AccountSerializer(instance=account, data=payload)
    serialized.is_valid(raise_exception=True)
    serialized.save()
    return Response(serialized.data, status=HTTP_205_RESET_CONTENT)
