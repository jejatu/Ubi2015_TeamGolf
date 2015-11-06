from flask import Flask, request, g, Response, jsonify
from flask.ext.restful import Api, Resource
from werkzeug.exceptions import NotFound,  UnsupportedMediaType
import json
import database

# Media type constants:
# http://amundsen.com/media-types/collection/
COLLECTIONJSON = "application/vnd.collection+json"

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
	
# == HELPERS ==
def _formatSessionItems(sessions):
	for s in sessions:
		session = {}
		session["href"] = api.url_for(Session, session_id=s["session_id"])
		session["data"] = [	{"name": "session_id", "value": s["session_id"]},
							{"name": "code", "value": s["code"]},
							{"name": "time_of_session_birth", "value": s["time_of_session_birth"]},
							{"name": "time_of_code_birth", "value": s["time_of_code_birth"]} ]
		yield session

def _formatSurveyItems(surveys):
	for s in surveys:
		survey = {}
		survey["href"] = api.url_for(Survey, survey_id=s["survey_id"])
		survey["data"] = [	{"name": "survey_id", "value": s["survey_id"]},
							{"name": "session_id", "value": s["session_id"]} ]
		yield survey					

def _parseJsonRequest(request_data):
	formatted_data = {}
	for element in request_data["template"]["data"]:
		formatted_data[element["name"]] = element["value"]
	return formatted_data
		
# == RESOURCES ==
class Sessions(Resource):
	def get(self):
		'''
		Lists all the sessions in the database.
		
		INPUT: 
			None
		OUTPUT:
			(a) Media type: application/vnd.collection+json (200)
		'''
		db_sessions = g.db.getSessions()
		print "lol"
		if db_sessions is None:
			return createErrorResponse(404, "Not found", "No sessions found in the database", "Sessions")
	
		# Format the response json(collection representation):
		collection = {}
		collection["version"] = "1.0"
		collection["href"] = api.url_for(Sessions)
		collection["links"] = [SURVEYS_LINK]
		collection["items"] = [session for session in _formatSessionItems(db_sessions)]
		print "lol"
		# Create response:
		json_dump = json.dumps({"collection": collection})
		return Response(json_dump, 200, mimetype=COLLECTIONJSON)

	def post(self):
		'''
		Appends a new session entry to the database.
		
		INPUT:
			(1) Media type: application/vnd.collection+json
		OUTPUT:
			(a) headers: location -> url (201)
		'''
		# Check if request is json:
		request_data = request.get_json(force=True)
		if not request_data:
			return createErrorResponse(415, "Unsupported Media Type", "API can handle only json using application/vnd.collection+json media type", "Sessions")
		
		# Retrieve data:
		session_data = _parseJsonRequest(request_data)
		
		# Try add a new entry:
		try:
			new_session_id = g.db.addSession(session_data)
		except ValueError as error:
			return createErrorResponse(400, "Bad request", error.message, "Sessions")
		except RuntimeError as error:
			return createErrorResponse(409, "Database conflict", error.message, "Sessions")
			
		if not new_session_id:
			return createErrorResponse(500, "Database error", "Unexpected failure.", "Sessions")
			
		url = api.url_for(Session, session_id=new_session_id)
		return Response(status=201, headers={"location": url})
		
class Session(Resource):
	def get(self, session_id):
		'''
		Returns the information of a specific session entry from the database.
		
		INPUT:
			(1) int: session_id
		OUTPUT:
			(a) Media type: application/vnd.collection+json (200)
		'''
		# Retrieve the data from database:
		try:
			db_session = g.db.getSession(int(session_id))
		except ValueError as error:
			return createErrorResponse(400, "Invalid value", error.message, "Session")
		except StandardError as error:
			return createErrorResponse(500, "Database error", error.message, "Session")
		
		if db_session is None:
			return createErrorResposne(404, "Not found", "Session with id=(%d) does not exist" % (int(session_id)), "Session")
		
		# Format the response json(item representaion):
		collection = {}
		collection["version"] = "1.0"
		collection["href"] = api.url_for(Session, session_id=session_id)
		collection["items"] = [session for session in _formatSessionItems(db_session)]
		
		# Create response:
		json_dump = json.dumps({"collection": collection})
		return Response(json_dump, 200, mimetype=COLLECTIONJSON)
		
	def put(self, session_id):
		'''
		Updates a specific session entry.
		
		INPUT:
			(1) int: session_id
			(2) Media type: application/vnd.collection+json
		OUTPUT:
			(a) No Content (204)
		'''
		pass

class Surveys(Resource):
	def get(self):
		'''
		Lists all the surveys in the database.
		
		INPUT: 
			None
		OUTPUT:
			Media type: application/vnd.collection+json (200)
		'''
		pass
	
	def post(self):
		'''
		Appends a new survey entry to the database.
		
		INPUT:
			Media type: application/vnd.collection+json
		OUTPUT:
			headers: location -> url (201)
		'''
		pass
		
class Survey(Resource):
	def get(self, survey_id):
		'''
		Returns the information of a specific survey entry from the database.
		
		INPUT:
			<int>survey_id
		OUTPUT:
			Media type: application/vnd.collection+json (200)
		'''
		pass
	
	def put(self, survey_id):
		'''
		Updates a specific survey entry.
		
		INPUT:
			<int>survey_id
			Media type: application/vnd.collection+json
		OUTPUT:
			No Content (204)
		'''
		pass
		
# == API ROUTES ==
# Session
api.add_resource(Sessions, "/api/sessions/", endpoint="sessions")
api.add_resource(Session, "/api/sessions/<session_id>/", endpoint="session")

# Survey
api.add_resource(Surveys, "/api/surveys/", endpoint="surveys")
api.add_resource(Survey, "/api/surveys/<survey_id>", endpoint="survey")

# Shortcuts to links:
SESSIONS_LINK = {"href":"/api/sessions/", "rel":"sessions-all", "prompt":"Sessions in the database"}
SURVEYS_LINK = {"href":"/api/surveys/", "rel":"surveys-all", "prompt":"Surveys in the database"}

if __name__ == "__main__":
	app.run(debug=True)