import sys
from os import path
sys.path.append(path.dirname(path.dirname(path.abspath(__file__))))
from werkzeug.serving import run_simple
from werkzeug.wsgi import DispatcherMiddleware
from Server.api import app
from Hotspot.application import app as hotspot
from Kiosk.application import app as kiosk

application = DispatcherMiddleware(app, {'/hotspot': hotspot, '/kiosk': kiosk})

if __name__ == '__main__':
	run_simple('localhost', 5000, application, use_reloader=True, use_debugger=True, use_evalex=True, threaded=True)
	