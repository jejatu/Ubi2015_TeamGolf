PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS session_data
(
	session_id INTEGER PRIMARY KEY AUTOINCREMENT,
	code INTEGER UNIQUE NOT NULL,
	start_time Time,
	end_time Time,
	place TEXT,
	number_of_interaction INTEGER,
	game_score INTEGER DEFAULT NULL,
	type_of_ad TEXT UNIQUE NOT NULL,
	content_ad TEXT
);
CREATE TABLE IF NOT EXISTS survey_data
(
	survey_id INTEGER PRIMARY KEY AUTOINCREMENT,
	session_id INTEGER DEFAULT NULL REFERENCES session_data(session_id) ON DELETE CASCADE
COMMIT;
PRAGMA foreign_keys=OFF;