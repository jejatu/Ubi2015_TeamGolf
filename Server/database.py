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
	
	def rowToDict(self, row, cursor):
		dict = {}
		for i, col in enumerate(cursor.description):
			dict[col[0]] = row[i]
		return dict
		
	
	# === CONTROLS ===
	def getEntries(self):
		result_list = []

		with sqlite3.connect(self.db_path) as connection:
			connection.row_factory = sqlite3.Row
			cursor = connection.cursor()
			cursor.execute("PRAGMA foreign_keys = ON")
			
			# Get all the rows:
			cursor.execute("SELECT * FROM logs")
			rows = cursor.fetchall()
			
			# Return None if no entries:
			if rows is None:
				return None
				
			# Parse row data into dictionaries:
			for row in rows:
				result_list.append(self.rowToDict(row, cursor))
			
			return result_list
			