class MockConsumer(object):
    def __init__(self, key='yellowwallpaper'):
        self.key = key
        self.secret = 'yellowwallpaper'
        self.ttl = 86400

class MockUser(object):
    def __init__(self, id='', consumer=None):
        self.id = id
        self.consumer = MockConsumer(consumer if consumer is not None else 'mockconsumer')
        self.is_admin = False


class MockAuthenticator(object):
    def request_user(self, request):
        return MockUser()

def mock_authorizer(*args, **kwargs):
    return True
