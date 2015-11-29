PRAGMA foreign_keys=ON;
BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS session_data
(
	session_id INTEGER PRIMARY KEY AUTOINCREMENT,
	code TEXT UNIQUE,
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
	age INTEGER,
	gender TEXT,
	what_was_on_the_screen TEXT,
	did_it_raise_positive_or_negative_emotions INTEGER,
	how_many_ads_did_you_see INTEGER,
	describe_the_ads_you_saw TEXT,
	did_any_of_ads_gain_intrest TEXT,
	did_ads_annoy_why TEXT,
	ads_gained_attention INTEGER,
	found_ads_interesting INTEGER,
	might_buy INTEGER,
	disp_better_than_printed_ad INTEGER,
	disp_better_than_television_ad INTEGER,
	disp_ads_annoy_me INTEGER,
	pay_attention_to_ads INTEGER,
	often_buy_products_on_ads INTEGER,
	pub_disp_suited_for_ads INTEGER,
	where_else_seen_public_displays TEXT,
	remember_seeing_ads_on_pub_disp TEXT,
	seen_pub_disp_for_other_than_ads TEXT
);
CREATE TABLE IF NOT EXISTS lottery_data
(
	lottery_id INTEGER PRIMARY KEY AUTOINCREMENT,
	survey_id INTEGER DEFAULT NULL REFERENCES survey_data(survey_id) ON DELETE CASCADE,
	uname TEXT,
	email TEXT
);
COMMIT;
PRAGMA foreign_keys=OFF;
