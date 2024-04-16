from rest_framework.decorators import api_view,schema, permission_classes
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema
from rest_framework.request import Request
from rest_framework.permissions import IsAuthenticated
# from django.core.exceptions import 
from rest_framework.viewsets import ModelViewSet
from account.models import Account
from rest_framework.status import HTTP_201_CREATED, HTTP_200_OK, HTTP_204_NO_CONTENT, HTTP_403_FORBIDDEN, HTTP_205_RESET_CONTENT
from account.serializers import AccountSerializer

# Create your views here.
@api_view(['GET', 'POST', 'DELETE', 'PATCH'])
@schema(AutoSchema)
# @permission_classes([IsAuthenticated])
def account_view(request: Request, pk=None) -> Response:
    if request.method == 'GET':
        if pk:
            return retrieve(request, pk)
        return list_accounts(request)
    if request.method == 'POST':
        return add_account(request)
    if request.POST.get('holder') == request.user.pk:
        if request.method == 'DELETE':
            return delete_account(request, pk)
        if request.method == 'PATCH':
            return modify_account(request)
    else:
        return Response('You are not the holder of the card', status=HTTP_403_FORBIDDEN)

def retrieve(request: Request, pk):
    queryset = Account.objects.get(pk=pk)
    serialized = AccountSerializer(queryset, many=False)
    return Response(serialized.data, status=HTTP_200_OK)

def list_accounts(request: Request) -> Response:
    user = request.user.pk
    offset = int(request.query_params.get('offset'))
    limit = int(request.query_params.get('limit'))
    # accounts = Account.objects.all()[offset:offset+limit]
    accounts = Account.objects.filter(holder=user)[offset:offset+limit]
    serialized = AccountSerializer(accounts, many=True)
    return Response(serialized.data, status=HTTP_200_OK)

def add_account(request: Request) -> Response:
    user = request.user
    account = Account(expire=request.POST.get('expire'),
                      type=request.POST.get('type'),
                      number=request.POST.get('number'),
                      balance=request.POST.get('balance'),
                      description=request.POST.get('description'),
                      holder=user)
    serialized = AccountSerializer(data=account, many=False)
    serialized.is_valid(raise_exception=True)
    return Response(data=serialized.data, status=HTTP_201_CREATED)

def delete_account(request: Request, pk) -> Response:
    pk = request.data['id']
    account = Account.objects.get(pk=pk)
    serialized = AccountSerializer(data=account, many=False)
    account.delete()
    return Response(serialized.data, status=HTTP_204_NO_CONTENT)

def modify_account(request: Request) -> Response:
    payload = request.data
    account = Account.objects.get(payload['id'])
    serialized = AccountSerializer(instance=account, data=payload)
    serialized.is_valid(raise_exception=True)
    serialized.save()
    return Response(serialized.data, status=HTTP_205_RESET_CONTENT)
