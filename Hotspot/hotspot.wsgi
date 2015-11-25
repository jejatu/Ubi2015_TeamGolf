activate_this = '/var/www/UCF2015/Hotspot/Hotspot/bin/activate_this.py'
execfile(activate_this, dict(__file__=activate_this))

import sys
sys.path.insert(0, '/var/www/UCF2015/Hotspot')

from application import app as application
