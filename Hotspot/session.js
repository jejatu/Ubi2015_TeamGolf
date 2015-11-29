// REMEMBER to include apiclient!
var DEBUG = false;

//database information
var id = 0;
var code = "";
var startTime = 0;
var place = "home";
var numberOfInteractions = 0;
var gameScore = 0;
var typeOfAd = "";
var contentAd = "";

//idle variables
var timer = 60000;
var timeoutId = null;
var idlePage = "index.html";

var invalid_codes = [];

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

function generateUUID(){
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return (c=='x' ? r : (r&0x7|0x8)).toString(16);
  });
  return uuid;
};

function startSession() {
	startTimer();
	startTime = new Date().getTime();
	if (sessionStorage.getItem("code") !== null) {
		sessionStorage.removeItem("code");
	}
	setSessionCode();
	
	if (DEBUG) {
			console.log("Started a new session at " + getRightNow());
		}
}

function setSessionCode() {
	var successCb = function(data, textStatus, jqXHR) {
		if (DEBUG) {
			console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
		}
		
		var items = data.collection.items;
		for (var i = 0; i < items; i++)
		{
			invalid_codes.push((items[i].code).toString());
		}
		
		var _code = "";
		if (invalid_codes.length > 0) {
			do {
				_code = generateCode();
			}
			while ($.inArray(code, invalid_codes) != -1);
		}
		else {
			_code = generateCode();
		}
		
		code = _code;
		sessionStorage.setItem("code", code);
		
		if (DEBUG) {
			console.log("Session pincode: ", code);
		}
	};
	
	var failCb = function(errorThrown, textStatus, jqXHR) {
		if (DEBUG) {
			console.log("ERROR: textStatus: ", textStatus, ", error: ", errorThrown);
		}
	};
	
	APIClient.getSessions(successCb, failCb);
	
	return false;
}

function generateCode() {
	var randomCode = Math.floor(Math.random() * 999);
	if (randomCode < 10) {
	return "00" + randomCode;
	}
	else if (randomCode < 100) {
	return "0" + randomCode;
	}
	return randomCode.toString();
}

function getCode() {
	return code;
}

function showCode() {
	console.log("bra");
	$("#survey_iframe").contents().find("#waitcode").hide();
	$("#survey_iframe").contents().find("#code").html("<p>" + code + "</p>");
	$("#survey_iframe").contents().find("#codeButton").show();
}

function sendSession() {
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
  sendSession();
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