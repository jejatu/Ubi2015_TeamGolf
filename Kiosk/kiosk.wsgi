activate_this = '/var/www/UCF2015/Kiosk/Kiosk/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/var/www/UCF2015/Kiosk/')

from application import app as application
