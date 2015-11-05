import sqlite3, os

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
		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Check if entry exists already:
			cursor.execute("SELECT * FROM session_data WHERE code = ? AND time_of_session_birth = ? AND time_of_code_birth = ?", 
							(session_dict["code"], session_dict["time_of_session_birth"], session_dict["time_of_code_birth"]))
			row = cursor.fetchone()
			if row is not None:
				raise RuntimeError("Session exists already.")
			
			# Add session to the database:
			cursor.execute("INSERT INTO session_data (code, time_of_session_birth, time_of_code_birth) VALUES(?, ?, ?)",
							(session_dict["code"], session_dict["time_of_session_birth"], session_dict["time_of_code_birth"]))
						
			if (cursor.rowcount) > 0:
				return cursor.lastrowid
			else:
				return None
		
	def updateSession(self, session_dict):
		'''
		Modifies an existing session entry in the database with data values from a dictionary.
		
		INPUT:
			(1) dictionary: session_dict
				keys: session_id, code, time_of_session_birth, time_of_code_birth
		OUTPUT:
			(a) returns session_id of the updated entry
			(b) return None if entry cannot be modified
		'''
		pass
		
	def deleteSession(self, session_id):
		'''
		Removes a session entry from the database.
		
		INPUT:
			(1) int: session_id
		OUTPUT:
			(a) returns True if removal was successful
			(b) return False if entry cannot be removed
		'''
		pass
		
	def getSessions(self):
		'''
		Returns all the sessions in the database.
		
		INPUT: 
			None
		OUTPUT:
			(a) returns list of dictionaries:
				keys: session_id, code, time_of_session_birth, time_of_code_birth
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
				keys = session_id, code, time_of_session_birth, time_of_code_birth
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
			
	# Survey:
	def addSession(self, session_dict):
		'''
		'''
		pass
		
	def updateSession(self, session_dict):
		'''
		'''
		pass
		
	def deleteSession(self, session_id):
		'''
		'''
		pass
		
	def getSurveys(self):
		'''
		'''
		pass
		
	def getSurvey(self, survey_id):
		'''
		'''
		pass
		
		
		