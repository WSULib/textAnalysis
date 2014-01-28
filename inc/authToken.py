import os
import sys
import datetime
import iso8601
import jwt

CONSUMER_KEY = 'yellowwallpaper'
CONSUMER_SECRET = 'yellowwallpaper'
CONSUMER_TTL = 86400

user_id = sys.argv[1]

def authToken(user_id):
	def generate_token(user_id):
		return jwt.encode({
		  'consumerKey': CONSUMER_KEY,
		  'userId': user_id,
		  'issuedAt': _now().isoformat() + 'Z',
		  'ttl': CONSUMER_TTL
		}, CONSUMER_SECRET)

	def _now():
		return datetime.datetime.now(iso8601.iso8601.UTC).replace(microsecond=0)

	print generate_token(user_id)
	return generate_token(user_id)


if __name__ == "__main__":
	authToken(user_id)

