PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS session_data
(
	session_id INTEGER PRIMARY KEY AUTOINCREMENT,
	code INTEGER UNIQUE NOT NULL,
	time_of_session_birth TEXT,
	time_of_code_birth TEXT
);
CREATE TABLE IF NOT EXISTS survey_data
(
	survey_id INTEGER PRIMARY KEY AUTOINCREMENT,
	session_id INTEGER DEFAULT NULL REFERENCES session_data(session_id) ON DELETE CASCADE
);
COMMIT;
PRAGMA foreign_keys=OFF;