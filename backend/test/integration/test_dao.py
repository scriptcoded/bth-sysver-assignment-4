from more_itertools import side_effect
from src.util.validators import getValidator
from src.util.dao import DAO
from src.controllers.usercontroller import UserController
from pymongo.errors import WriteError
from bson.objectid import ObjectId
import json
from unittest import mock
import pytest

@pytest.fixture
def sut():
    collection_name = 'test'
    validator_name = 'user'

    # Mocked getValidator so that we can control what validator to use
    # regardless of the collection name
    def mocked_getValidator(_: str):
        return getValidator(validator_name)

    # Patch getValidator in src.util.dao to use our mocked getValidator
    with mock.patch('src.util.dao.getValidator', side_effect=mocked_getValidator):
        sut = DAO(collection_name)

        yield sut

        sut.drop()

@pytest.mark.parametrize('firstName, lastName, email, tasks, expectSuccess', [
    ('a', 'b', 'c', [], True),
    ('a', 'b', 'c', [ObjectId('000000000000000000000000')], True),
    (None, 'b', 'c', [], False),
    ('a', None, 'c', [], False),
    ('a', 'b', None, [], False),
    ('a', 'b', 'c', None, False),
    (1, 'b', 'c', [], False),
    ('a', 2, 'c', [], False),
    ('a', 'b', 3, [], False),
    ('a', 'b', 'c', ['bad id'], False),
    ('a', 'b', 'c', [None], False),
    ('a', 'b', 'c', 'not an array', False)
])
def test_create(firstName, lastName, email, tasks, expectSuccess, sut):
    model = {
        'firstName': firstName,
        'lastName': lastName,
        'email': email,
        'tasks': tasks
    }

    if expectSuccess:
        result = sut.create(model)
        assert '_id' in result
        assert 'firstName' in result
        assert 'lastName' in result
        assert 'email' in result
        assert 'tasks' in result
    else:
        with pytest.raises(WriteError):
            sut.create(model)
