<?php
$survey_id = SQLite3::escapeString($_POST["survey_id"]);
$uname = SQLite3::escapeString($_POST["uname"]);
$email = SQLite3::escapeString($_POST["email"]);

try {
	$db = new PDO("sqlite:/Library/WebServer/Documents/UCF2015/API/db/logs.db");
} catch(PDOException $e) {
	echo $e->getMessage();
}

if (!empty($uname) && !empty($email))
{
	//$stmt = $db->execute("INSERT INTO lottery_data (survey_id,uname,email) VALUES($survey_id,$uname,$email)");
	$stmt = $db->prepare("INSERT INTO lottery_data (survey_id,uname,email) VALUES(:value1,:value2,:value3)");
	$stmt->bindParam(":value1", $survey_id, PDO::PARAM_INT);
	$stmt->bindParam(":value2", $uname, PDO::PARAM_STR);
	$stmt->bindParam(":value3", $email, PDO::PARAM_STR);
	$stmt->execute();
}

?>