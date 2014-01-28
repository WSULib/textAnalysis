#!/usr/bin/env python
"""
run.py: A simple example app for using the Annotator Store blueprint

This file creates and runs a Flask[1] application which mounts the Annotator
Store blueprint at its root. It demonstrates how the major components of the
Annotator Store (namely the 'store' blueprint, the annotation model and the
auth and authz helper modules) fit together, but it is emphatically NOT
INTENDED FOR PRODUCTION USE.

[1]: http://flask.pocoo.org
"""

from __future__ import print_function

import os
import sys
import datetime
import iso8601
import jwt
import urllib
import ast
from flask import Flask, g, current_app, request, session
from annotator import es, annotation, auth, authz, document, store
from tests.helpers import MockUser, MockConsumer, MockAuthenticator
from tests.helpers import mock_authorizer

CONSUMER_KEY = 'yellowwallpaper'
CONSUMER_SECRET = 'yellowwallpaper'
CONSUMER_TTL = 86400

here = os.path.dirname(__file__)

def main():
	app = Flask(__name__)

	cfg_file = 'annotator.cfg'
	if len(sys.argv) == 2:
		cfg_file = sys.argv[1]

	cfg_path = os.path.join(here, cfg_file)

	try:
		app.config.from_pyfile(cfg_path)
	except IOError:
		print("Could not find config file %s" % cfg_path, file=sys.stderr)
		print("Perhaps you need to copy annotator.cfg.example to annotator.cfg", file=sys.stderr)
		sys.exit(1)

	es.init_app(app)

	with app.test_request_context():
		annotation.Annotation.create_all()
		document.Document.create_all()

	@app.before_request
	def before_request():
		# In a real app, the current user and consumer would be determined by
		# a lookup in either the session or the request headers, as described
		# in the Annotator authentication documentation[1].
		#
		# [1]: https://github.com/okfn/annotator/wiki/Authentication
		# g.user = MockUser('alice')        

		# By default, this test application won't do full-on authentication
		# tests. Set AUTH_ON to True in the config file to enable (limited)
		# authentication testing.
		if current_app.config['AUTH_ON']:
			g.auth = auth.Authenticator(lambda x: MockConsumer('annotateit'))
			# print("passed validation")
		else:
			# print("did NOT pass validation")
			g.auth = MockAuthenticator()

		# Similarly, this test application won't prevent you from modifying
		# annotations you don't own, deleting annotations you're disallowed
		# from deleting, etc. Set AUTHZ_ON to True in the config file to
		# enable authorization testing.
		if current_app.config['AUTHZ_ON']:
			g.authorize = authz.authorize
			# print("authorized")
		else:
			g.authorize = mock_authorizer
			# print("something authorized fail?")

	
	@app.route('/authToken')
	def authToken():
		def generate_token(user_id):
			return jwt.encode({
			  'consumerKey': CONSUMER_KEY,
			  'userId': user_id,
			  'issuedAt': _now().isoformat() + 'Z',
			  'ttl': CONSUMER_TTL
			}, CONSUMER_SECRET)

		def _now():
			return datetime.datetime.now(iso8601.iso8601.UTC).replace(microsecond=0)

		WSUDORcookie = request.cookies.get('WSUDOR')
		unescapedWSUDORcoookie = urllib.unquote(WSUDORcookie)	
		unescapedWSUDORcoookie = unescapedWSUDORcoookie.replace('true','"true"')			
		WSUDORdict = ast.literal_eval(unescapedWSUDORcoookie)
		username = WSUDORdict['username_WSUDOR']
		displayName = WSUDORdict['displayName']
		annotation_signature = displayName+" / "+username

		return generate_token(annotation_signature)

	app.register_blueprint(store.store)

	host = os.environ.get('HOST', '127.0.0.1')
	port = int(os.environ.get('PORT', 5000))
	app.run(host=host, port=port)

if __name__ == '__main__':
	main()
