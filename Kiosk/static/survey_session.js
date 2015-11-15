// REMEMBER to include apiclient!
var DEBUG = true;

//Survey database variables:
var survey_id = 0;
var session_id = 0;
var notice_display = null;
var content_screen = "";
var realize_ads = null;
var rating_feelings = 0;
var number_of_ads = 0;
var ad_content = "";
var ads_interesting = null;
var cause_interest = "";
var ads_attention = null;
var might_buy = null;
var ads_attention_general = null;
var public_displays_suited = null;
var kind_of_ad = "";
var remember_ad = null;
var focus = "";
var affect_interaction = "";
var stop_motivation = "";
var our_location_suitable = null;
var suitable_location = "";
var feeling_sounds = "";
var best_kind_of_ads = "";

//idle variables
var timer = 30000;
var timeoutId = null;
var idlePage = "index.html";

$(document).mousedown(function(event) {
    numberOfInteractions++;
});

function getRightNow() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  var hh = today.getHours();
  var min = today.getMinutes();
  var sec = today.getSeconds();

  if(dd < 10)
    dd='0'+dd;

  if(mm < 10)
    mm='0'+mm;

  if(hh < 10)
    hh='0'+hh;

  if(min < 10)
    min='0'+min;

  if(sec < 10)
    sec='0'+sec;

  var datetime = yyyy+'-'+mm+'-'+dd+'-'+hh+':'+min+":"+sec;

  return datetime;
}

function startSession() {
	startTimer();
	startTime = new Date().getTime();
	
	console.log("started session " + id + " at " + getRightNow());
}

function sendSurvey() {
	var sessionData = [	
		{name: "code", value: code},
		{name: "start_time", value: startTime},
		{name: "end_time", value: new Date().getTime()},
		{name: "place", value: place},
		{name: "number_of_interaction", value: numberOfInteractions},
		{name: "game_score", value: gameScore},
		{name: "type_of_ad", value: getTypeOfAd()},
		{name: "content_ad", value: getAdsStarted()}
	];
	
	var successCb = function(data, textStatus, jqXHR) {
		if (DEBUG) {
		console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
		}
	};
	
	var failCb = function(jqXHR, textStatus, errorThrown) {
		if (DEBUG) {
			console.log("ERROR: textStatus: ", textStatus, ", error: ", errorThrown);
		}
	};
	
	APIClient.addSession(sessionData, successCb, failCb);
	
	return false;
}

function endSession() {
  sendSurvey();
  window.location = idlePage;
}

function startTimer() {
  timeoutId = setTimeout('executeTimer()', timer);
}

function resetTimer() {
  clearTimeout(timeoutId);
  timeoutId = setTimeout('executeTimer()', timer);
}

function executeTimer() {
  endSession();
}

$(function() {

})
