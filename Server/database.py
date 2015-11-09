import sqlite3, os, datetime

DEFAULT_DB_PATH = "Server/db/logs.db"
DEFAULT_SCHEMA = "Server/db/db_schema.sql"

class ServerDatabase(object):
	# Initialization:
	def __init__(self, db_path=DEFAULT_DB_PATH):
		super(ServerDatabase, self).__init__()
		self.db_path = db_path
		connection = sqlite3.connect(self.db_path)
		connection.close()
	
	# Purge database:
	def clean(self):
		os.remove(self.db_path)
	
	# Initialize tables from schema:
	def initTables(self, schema=DEFAULT_SCHEMA):
		connection = sqlite3.connect(self.db_path)
		with open(schema) as f:
			sql_data = f.read()
			cursor = connection.cursor()
			cursor.executescript(sql_data)

	# Dump data:
	def dumpData(self, dump):
		connection = sqlite3.connect(self.db_path)
		with open(dump) as f:
			sql_data = f.read()
			cursor = connection.cursor()
			cursor.executescript(sql_data)
	
	# Format database row data into dictionary:
	def rowToDict(self, row, cursor):
		dict = {}
		for i, col in enumerate(cursor.description):
			dict[col[0]] = row[i]
		return dict
		
	
	# === CONTROLS ===
	# Session:
	def addSession(self, session_dict):
		'''
		Adds a session entry to the database containing data from a dictionary.
		
		INPUT: 
			(1) dictionary: session_dict
				keys: code, time_of_session_birth, time_of_code_birth
		OUTPUT:
			(a) returns session_id of the newly created entry
			(b) returns None if entry cannot be created
		'''
		sql1 = "SELECT * FROM session_data WHERE code = ? AND start_time = ? AND end_time = ? AND place = ?"
		sql2 = "INSERT INTO session_data (code, start_time, end_time, place, number_of_interaction, game_score, type_of_ad, content_ad) VALUES(?, ?, ?, ?, ?, ?, ?, ?)"
		
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Check if entry exists already:
			cursor.execute(sql1,(session_dict["code"], session_dict["start_time"], session_dict["end_time"], session_dict["place"]))
			row = cursor.fetchone()
			if row is not None:
				raise RuntimeError("Session exists already.")
			
			# Add session to the database:
			cursor.execute(sql2,(session_dict["code"], session_dict["start_time"], session_dict["end_time"], session_dict["place"],
								 session_dict["number_of_interaction"], session_dict["game_score"], session_dict["type_of_ad"], session_dict["content_ad"]))
						
			if (cursor.rowcount) > 0:
				return cursor.lastrowid
			else:
				return None
		
	def updateSession(self, session_dict):
		'''
		Modifies an existing session entry in the database with data values from a dictionary.
		
		INPUT:
			(1) dictionary: session_dict
				keys: session_id, code, start_time, end_time, place, number_of_interaction, game_score, type_of_ad, content_ad
		OUTPUT:
			(a) returns session_id of the updated entry
			(b) return None if entry cannot be modified
		'''
		# Not implemented.
		return None
		
	def getSessions(self):
		'''
		Returns all the sessions in the database.
		
		INPUT: 
			None
		OUTPUT:
			(a) returns list of dictionaries:
				keys: session_id, code, start_time, end_time, place, number_of_interaction, game_score, type_of_ad, content_ad
			(b)	returns None if no sessions found
		'''
		result_list = []

		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Get all the rows:
			cursor.execute("SELECT * FROM session_data")
			rows = cursor.fetchall()
			
			# Return None if no entries:
			if rows is None:
				return None
				
			# Parse row data into dictionaries:
			for row in rows:
				result_list.append(self.rowToDict(row, cursor))
			
			return result_list
			
	def getSession(self, session_id):
		'''
		Returns the information of a specific session entry from the database.
		
		INPUT:
			(1) int: session_id
		OUTPUT:
			(a) returns dictionary:
				keys = session_id, code, start_time, end_time, place, number_of_interaction, game_score, type_of_ad, content_ad
			(b)	returns None if no session found
		'''
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Find and get the session row:
			cursor.execute("SELECT * FROM session_data WHERE session_id = ?", (session_id,))
			row = cursor.fetchone()
			
			# Return None if no entries, else dictionary:
			if row is None:
				return None
			else:
				return [self.rowToDict(row, cursor)]
		
	def getValidSession(self, pin_code):
		'''
		Checks if pin code matches a session entry in the database and is not expired.
		
		INPUT:
			(1)	int: pin_code
		OUTPUT:
			(a)	returns session_id of the valid session
			(b)	returns None if no valid session is found
		'''
		with sqlite3.connect(self.db_path, detect_types=sqlite3.PARSE_DECLTYPES) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Find and get the session row:
			cursor.execute("SELECT * FROM session_data WHERE code = ?", (pin_code,))
			rows = cursor.fetchall()
			
			# Return None if no entries, else dictionary:
			if rows is None:
				return None
			
			curr_time = datetime.datetime.now()
			
			# Compare results and return id if a valid session is found:
			for row in rows:
				dict = self.rowToDict(row, cursor)
				if curr_time - dict["end_time"] < datetime.timedelta(hours=1):
					return dict["session_id"]
					
			return None
		
	# Survey:
	def addSurvey(self, session_id):
		'''
		Adds a survey entry to the database containing data from a dictionary.
		
		INPUT: 
			(1) dictionary: survey_dict
				keys: session_id, notice_display, content_screen, realize_ads, rating_feelings, number_of_ads,
						ad_content, ads_interesting, cause_interest, ads_annoyed, cause_annoying, ads_attention,
						might_buy, ads_attention_general, public_display_suited, printed_ad_worser, television_ad_worser,
						kind_of_ad, public_display_before, place_public_display, remember_ad
		OUTPUT:
			(a) returns survey_id of the newly created entry
			(b) returns None if entry cannot be created
		'''
		sql1 = "SELECT * FROM survey_data WHERE session_id = ?"
		sql2 = "INSERT INTO survey_data (session_id) VALUES(?)"
		
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			if session_id is not None:
				# Check if entry exists already:
				cursor.execute(sql1,(session_id,))
				row = cursor.fetchone()
				if row is not None:
					raise RuntimeError("Survey exists already.")
			
			# Add session to the database:
			cursor.execute(sql2,(session_id,))
						
			if (cursor.rowcount) > 0:
				return cursor.lastrowid
			else:
				return None
		
	def updateSurvey(self, survey_id, survey_dict):
		'''
		Modifies an existing survey entry in the database with data values from a dictionary.
		
		INPUT:
			(1) dictionary: survey_dict
				keys: survey_id, session_id, notice_display, content_screen, realize_ads, rating_feelings, number_of_ads,
						ad_content, ads_interesting, cause_interest, ads_annoyed, cause_annoying, ads_attention,
						might_buy, ads_attention_general, public_display_suited, printed_ad_worser, television_ad_worser,
						kind_of_ad, public_display_before, place_public_display, remember_ad
		OUTPUT:
			(a) returns survey_id of the updated entry
			(b) return None if entry cannot be modified
		'''
		#todo: validate survey_dict so can assure it contains all required data.
		
		sql1 = "SELECT * FROM survey_data WHERE survey_id = ?"
		sql2 = "UPDATE survey_data SET notice_display = ?, content_screen = ?, realize_ads = ?, rating_feelings = ?, number_of_ads = ?, ad_content = ?, ads_interesting = ?, cause_interest = ?, ads_annoyed = ?, cause_annoying = ?, ads_attention = ?, might_buy = ?, ads_attention_general = ?, public_display_suited = ?, printed_ad_worser = ?, television_ad_worser = ?, kind_of_ad = ?, public_display_before = ?, place_public_display = ?, remember_ad = ? WHERE survey_id = ?"
		
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Check that entry exists:
			cursor.execute(sql1,(survey_id,))
			row = cursor.fetchone()
			if row is None:
				raise RuntimeError("Survey does not exists.")
			
			# Modify the survey entry in the database:
			cursor.execute(sql2,(survey_dict["notice_display"],survey_dict["content_screen"],survey_dict["realize_ads"],survey_dict["rating_feelings"],
								 survey_dict["number_of_ads"],survey_dict["ad_content"],survey_dict["ads_interesting"],survey_dict["cause_interest"],
								 survey_dict["ads_annoyed"],survey_dict["cause_annoying"],survey_dict["ads_attention"],survey_dict["might_buy"],
								 survey_dict["ads_attention_general"],survey_dict["public_display_suited"],survey_dict["printed_ad_worser"],survey_dict["television_ad_worser"],
								 survey_dict["kind_of_ad"],survey_dict["public_display_before"],survey_dict["place_public_display"],survey_dict["remember_ad"],
								 survey_id))
						
			if (cursor.rowcount) > 0:
				return True
			else:
				return False
		
	def getSurveys(self):
		'''
		Returns all the surveys in the database.
		
		INPUT: 
			None
		OUTPUT:
			(a) returns list of dictionaries:
				keys: survey_id, session_id, notice_display, content_screen, realize_ads, rating_feelings, number_of_ads,
						ad_content, ads_interesting, cause_interest, ads_annoyed, cause_annoying, ads_attention,
						might_buy, ads_attention_general, public_display_suited, printed_ad_worser, television_ad_worser,
						kind_of_ad, public_display_before, place_public_display, remember_ad
			(b)	returns None if no sessions found
		'''
		result_list = []

		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Get all the rows:
			cursor.execute("SELECT * FROM survey_data")
			rows = cursor.fetchall()
			
			# Return None if no entries:
			if rows is None:
				return None
				
			# Parse row data into dictionaries:
			for row in rows:
				result_list.append(self.rowToDict(row, cursor))
			
			return result_list
		
	def getSurvey(self, survey_id):
		'''
		Returns the information of a specific survey entry from the database.
		
		INPUT:
			(1) int: survey_id
		OUTPUT:
			(a) returns dictionary:
				keys = survey_id, session_id, notice_display, content_screen, realize_ads, rating_feelings, number_of_ads,
						ad_content, ads_interesting, cause_interest, ads_annoyed, cause_annoying, ads_attention,
						might_buy, ads_attention_general, public_display_suited, printed_ad_worser, television_ad_worser,
						kind_of_ad, public_display_before, place_public_display, remember_ad
			(b)	returns None if no session found
		'''
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Find and get the survey row:
			cursor.execute("SELECT * FROM survey_data WHERE survey_id = ?", (survey_id,))
			row = cursor.fetchone()
			
			# Return None if no entries, else dictionary:
			if row is None:
				return None
			else:
				return [self.rowToDict(row, cursor)]
		