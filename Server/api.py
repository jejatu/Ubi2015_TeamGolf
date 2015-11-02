from flask import Flask, request, g
from flask.ext.restful import Api, Resource
import json
import database

# Define the application:
app = Flask(__name__)
app.debug = True
app.config['DATABASE'] = database.ServerDatabase(database.DEFAULT_DB_PATH)

# Define the api:
api = Api(app)

def createErrorResponse(status_code, title, message, resource_type=None):
	'''Creates a json error response.'''
	response = jsonify(title=title, message=message, resource_type=resource_type)
	response.status_code = status_code
	return response

@app.before_request
def set_database():
	'''Stores an instance of the database API before each request in flask.g variable accessible only from the app context'''
	g.db = app.config['DATABASE']
	
# -- RESOURCES --
class Entries(Resource):
	def get(self):
		db_entries = g.db.getEntries()
		if db_entries is None:
			return createErrorResponse(404, "Not found", "No entries found in the database", "Entries")
	
		# Format the response json:
		#to be decided
		
		# Create response:
		json_dump = json.dumps({db_entries})
		return Response(json_dump, 200)
# --- API ROUTES ---
api.add_resource(Entries, "/api/entries/", endpoint="entries")

# Shortcuts to links:
ENTRIES_LINK = {"href":"/api/entries/", "rel":"entries-all", "prompt":"Entries in the database"}

if __name__ == "__main__":
	app.run(debug=True)