from src.controllers.usercontroller import UserController

from unittest import mock
import pytest

def test_get_user_by_email_correct():
    mocked_dao = mock.MagicMock()
    mocked_dao.find.return_value = [{ "email": "test@example.com" }]

    usercontroller = UserController(mocked_dao)

    # Just make sure it does not raise
    assert usercontroller.get_user_by_email("test@example.com")

def test_get_user_by_email_incorrect():
    mocked_dao = mock.MagicMock()
    usercontroller = UserController(mocked_dao)

    with pytest.raises(ValueError):
        usercontroller.get_user_by_email("test@example")

def test_get_user_by_email_matches():
    mocked_dao = mock.MagicMock()
    mocked_dao.find.return_value = [{ "email": "test@example.com" }]

    usercontroller = UserController(mocked_dao)

    assert usercontroller.get_user_by_email("test@example.com")["email"] == "test@example.com"

def test_get_user_by_email_no_user():
    mocked_dao = mock.MagicMock()
    mocked_dao.find.return_value = []

    usercontroller = UserController(mocked_dao)

    assert usercontroller.get_user_by_email("test@example.com") == None

def test_get_user_by_email_multiple_users():
    mocked_dao = mock.MagicMock()
    mocked_dao.find.return_value = [{ "email": "test1@example.com" }, { "email": "test2@example.com" }]

    usercontroller = UserController(mocked_dao)

    assert usercontroller.get_user_by_email("test@example.com")["email"] == "test1@example.com"
