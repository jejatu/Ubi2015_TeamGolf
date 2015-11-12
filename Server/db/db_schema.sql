PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS session_data
(
	session_id INTEGER PRIMARY KEY AUTOINCREMENT,
	code INTEGER UNIQUE NOT NULL,
	start_time DATETIME,
	end_time DATETIME,
	place TEXT,
	number_of_interaction INTEGER,
	game_score INTEGER DEFAULT NULL,
	type_of_ad TEXT NOT NULL,
	content_ad TEXT
);
CREATE TABLE IF NOT EXISTS survey_data
(
	survey_id INTEGER PRIMARY KEY AUTOINCREMENT,
	session_id INTEGER DEFAULT NULL REFERENCES session_data(session_id) ON DELETE CASCADE,
	notice_display BOOLEAN,
	content_screen TEXT,
	realize_ads BOOLEAN,
	rating_feelings INTEGER,
	number_of_ads INTEGER,
	ad_content TEXT,
	ads_interesting BOOLEAN,
	cause_interest TEXT,
	ads_annoyed BOOLEAN,
	cause_annoying TEXT,
	ads_attention BOOLEAN,
	might_buy BOOLEAN,
	ads_attention_general BOOLEAN,
	public_displays_suited BOOLEAN,
	printed_ad_worser BOOLEAN,
	television_ad_worser BOOLEAN,
	kind_of_ad TEXT,
	public_display_before BOOLEAN,
	place_public_display TEXT,
	remember_ad BOOLEAN
);
COMMIT;
PRAGMA foreign_keys=OFF;
