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
	'''Format session data into json format'''
	for s in sessions:
		session = {}
		session["href"] = api.url_for(Session, session_id=s["session_id"])
		session["data"] = [	{"name": "session_id", "value": s["session_id"]},
							{"name": "code", "value": s["code"]},
							{"name": "start_time", "value": s["start_time"]},
							{"name": "end_time", "value": s["end_time"]},
							{"name": "place", "value": s["place"]},
							{"name": "number_of_interaction", "value": s["number_of_interaction"]},
							{"name": "game_score", "value": s["game_score"]},
							{"name": "type_of_ad", "value": s["type_of_ad"]},
							{"name": "content_ad", "value": s["content_ad"]} ]
		yield session

def _formatSurveyItems(surveys):
	'''Format survey data into json format'''
	for s in surveys:
		survey = {}
		survey["href"] = api.url_for(Survey, survey_id=s["survey_id"])
		survey["data"] = [	{"name": "survey_id", "value": s["survey_id"]},
							{"name": "session_id", "value": s["session_id"]},
							{"name": "notice_display", "value": s["notice_display"]},
							{"name": "content_screen", "value": s["content_screen"]},
							{"name": "realize_ads", "value": s["realize_ads"]},
							{"name": "rating_feelings", "value": s["rating_feelings"]},
							{"name": "number_of_ads", "value": s["number_of_ads"]},
							{"name": "ad_content", "value": s["ad_content"]},
							{"name": "ads_interesting", "value": s["ads_interesting"]},
							{"name": "cause_interest", "value": s["cause_interest"]},
							{"name": "ads_attention", "value": s["ads_attention"]},
							{"name": "might_buy", "value": s["might_buy"]},
							{"name": "ads_attention_general", "value": s["ads_attention_general"]},
							{"name": "public_displays_suited", "value": s["public_displays_suited"]},
							{"name": "kind_of_ad", "value": s["kind_of_ad"]},
							{"name": "remember_ad", "value": s["remember_ad"]},
							{"name": "focus", "value": s["focus"]},
							{"name": "affect_interaction", "value": s["affect_interaction"]},
							{"name": "stop_motivation", "value": s["stop_motivation"]},
							{"name": "our_location_suitable", "value": s["our_location_suitable"]},
							{"name": "suitable_location", "value": s["suitable_location"]},
							{"name": "feeling_sounds", "value": s["feeling_sounds"]},
							{"name": "best_kind_of_ads", "value": s["best_kind_of_ads"]}
		]
		yield survey

def _parseJsonRequest(request_data):
	'''Parse data from json request'''
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
		if db_sessions is None:
			return createErrorResponse(404, "Not found", "No sessions found in the database", "Sessions")

		# Format the response json(collection representation):
		collection = {}
		collection["version"] = "1.0"
		collection["href"] = api.url_for(Sessions)
		collection["links"] = [SURVEYS_LINK]
		collection["items"] = [session for session in _formatSessionItems(db_sessions)]

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
		
class Surveys(Resource):
	def get(self):
		'''
		Lists all the surveys in the database.

		INPUT:
			None
		OUTPUT:
			(a)	Media type: application/vnd.collection+json (200)
		'''
		db_surveys = g.db.getSurveys()
		if db_surveys is None:
			return createErrorResponse(404, "Not found", "No surveys found in the database", "Surveys")

		# Format the response json(collection representation):
		collection = {}
		collection["version"] = "1.0"
		collection["href"] = api.url_for(Surveys)
		collection["links"] = [SESSIONS_LINK]
		collection["items"] = [survey for survey in _formatSurveyItems(db_surveys)]

		# Create response:
		json_dump = json.dumps({"collection": collection})
		return Response(json_dump, 200, mimetype=COLLECTIONJSON)

	def post(self):
		'''
		Appends a new survey entry to the database.

		INPUT:
			(1)	Media type: application/vnd.collection+json

		OUTPUT:
			(a)	headers: location -> url (201)
		'''
		# Check if request is json:
		request_data = request.get_json(force=True)
		if not request_data:
			return createErrorResponse(415, "Unsupported Media Type", "API can handle only json using application/vnd.collection+json media type", "Surveys")

		# Retrieve data:
		pincode_data = _parseJsonRequest(request_data)

		# Validate the pincode(or skip if no code = no session):
		if "code" in pincode_data:
			session_id = g.db.getValidSession(pincode_data["code"])
			if session_id is None:
				return createErrorResponse(404, "Not found", "Pincode expired. No session can be found.", "Surveys")
		else:
			session_id = None

		# Try add a new entry:
		try:
			new_survey_id = g.db.addSurvey(session_id)
		except ValueError as error:
			return createErrorResponse(400, "Bad request", error.message, "Surveys")
		except RuntimeError as error:
			return createErrorResponse(409, "Database conflict", error.message, "Surveys")

		if not new_survey_id:
			return createErrorResponse(500, "Database error", "Unexpected failure.", "Surveys")

		url = api.url_for(Survey, survey_id=new_survey_id)
		return Response(status=201, headers={"location": url})

class Survey(Resource):
	def get(self, survey_id):
		'''
		Returns the information of a specific survey entry from the database.

		INPUT:
			(1)	int: survey_id
		OUTPUT:
			(a)	Media type: application/vnd.collection+json (200)
		'''
		# Retrieve the data from database:
		try:
			db_survey = g.db.getSurvey(int(survey_id))
		except ValueError as error:
			return createErrorResponse(400, "Invalid value", error.message, "Survey")
		except StandardError as error:
			return createErrorResponse(500, "Database error", error.message, "Survey")

		if db_survey is None:
			return createErrorResponse(404, "Not found", "Survey with id=(%d) does not exist" % (int(survey_id)), "Survey")

		# Format the response json(item representaion):
		collection = {}
		collection["version"] = "1.0"
		collection["href"] = api.url_for(Survey, survey_id=survey_id)
		collection["items"] = [survey for survey in _formatSurveyItems(db_survey)]

		# Create response:
		json_dump = json.dumps({"collection": collection})
		return Response(json_dump, 200, mimetype=COLLECTIONJSON)

	def put(self, survey_id):
		'''
		Updates a specific survey entry with data.

		INPUT:
			(1)	int: survey_id
			(2)	Media type: application/vnd.collection+json
		OUTPUT:
			(a)	No Content (204)
		'''
		# Check if request is json:
		request_data = request.get_json(force=True)
		if not request_data:
			return createErrorResponse(415, "Unsupported Media Type", "API can handle only json using application/vnd.collection+json media type", "Survey")

		# Retrieve data:
		survey_data = _parseJsonRequest(request_data)

		# Try update the survey data:
		try:
			survey_modification = g.db.updateSurvey(survey_id, survey_data)
		except ValueError as error:
			return createErrorResponse(400, "Bad request", error.message, "Survey")
		except RuntimeError as error:
			return createErrorResponse(409, "Database conflict", error.message, "Survey")

		if survey_modification is False:
			return createErrorResponse(500, "Database error", "Unexpected failure.", "Survey")

		return Response(status=204)

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
