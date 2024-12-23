from django.contrib.auth.models import User
from rest_framework.serializers import ValidationError
from rest_framework.test import APITestCase


class AccountTests(APITestCase):
    url_path = "/api/v1/account/"

    def setUp(self) -> None:
        self.user = User.objects.create_user(username="username", password="Pas$w0rd")
        User.objects.create_user(username="test", password="test")
        self.client.login(username="username", password="Pas$w0rd")
        return super().setUp()

    # Create your tests here.
    def test_empty_card_number(self) -> None:
        payload = {
            "expire": "2034-03-10",
            "type": "IBAN",
            "holder": self.user.pk,
            "balance": 100000,
            "description": "Mastercard",
        }
        self.client.post(self.url_path, data=payload)
        self.assertRaisesMessage(
            expected_exception=ValidationError,
            expected_message="Credit or Debit cards must have a number",
        )

    def test_delete_other_user_acccount(self) -> None:
        pass

    def test_delete_user_account(self) -> None:
        payload = {
            "expire": "2035-03-10",
            "type": "IBAN",
            "holder": self.user.pk,
            "number": 12345678912345678,
            "balance": 100000,
            "description": "Mastercard",
        }
        account = self.client.post(self.url_path, data=payload)
        response = self.client.delete(self.url_path, data=account.content.id)
        self.assertEqual(response.status_code, 403)

    def test_update_user_account(self) -> None:
        payload = {
            "expire": "2035-03-10",
            "type": "IBAN",
            "holder": self.user.pk,
            "number": 12345678912345678,
            "balance": 100000,
            "description": "Mastercard",
        }
        response = self.client.patch(self.url_path, data=payload)
        self.assertDictEqual(payload, response)

    def test_update_other_user_account(self) -> None:
        pass

    def test_create_accont(self) -> None:
        payload = {
            "expire": "2035-03-10",
            "type": "IBAN",
            "holder": self.user.pk,
            "number": 12345678912345678,
            "balance": 100000,
            "description": "Mastercard",
        }
        response = self.client.post(self.url_path, data=payload)
        self.assertEqual(response.status_code, 200)

    def test_past_expiration_date(self) -> None:
        payload = {
            "expire": "2015-03-10",
            "type": "IBAN",
            "holder": self.user.pk,
            "number": 12345678912345678,
            "balance": 100000,
            "description": "Mastercard",
        }
        response = self.client.post(self.url_path, data=payload)
        self.assertEquals(response.status_code, 400)
