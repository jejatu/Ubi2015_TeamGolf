// REMEMBER to include apiclient!
var DEBUG = false;

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

var survey_data = [
{name: "survey_id", value: 0},
{name: "session_id", value: 0},
{name: "notice_display", value: null},
{name: "content_screen", value: ""},
{name: "realize_ads", value: null},
{name: "rating_feelings", value: 0},
{name: "number_of_ads", value: 0},
{name: "ad_content", value: ""},
{name: "ads_interesting", value: null},
{name: "cause_interest", value: ""},
{name: "ads_attention", value: null},
{name: "might_buy", value: null},
{name: "ads_attention_general", value: null},
{name: "public_displays_suited", value: null},
{name: "kind_of_ad", value: ""},
{name: "remember_ad", value: null},
{name: "focus", value: ""},
{name: "affect_interaction", value: ""},
{name: "stop_motivation", value: ""},
{name: "our_location_suitable", value: null},
{name: "suitable_location", value: ""},
{name: "feeling_sounds", value: ""},
{name: "best_kind_of_ads", value: ""}
];

//idle variables
var timer = 30000;
var timeoutId = null;
var idlePage = "index.html";
var survey_sent = false;

//Question page:
var curr_page = 0;
var pages = [".q1", ".q2", ".q3", ".q4", ".q5", ".q6", ".q7"];

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

function loadNextPage() {
	if (curr_page == pages.length-2) {
		serializeAnswers();
		sendSurvey();
		$(pages[curr_page]).hide();
		curr_page += 1;
		$(pages[curr_page]).show();
		return false;
	}

	if (curr_page < pages.length-1) {
		if ($("#button1").is(":visible")) {
			if (!$("#qname").val()) {
				$("#required_name").css("visibility", "visible");
				return false;
			}
			if (!$("#qemail").val()) {
				$("#required_email").css("visibility", "visible");
				return false;
			}
		}
		else {
			$("#required_name").css("visibility", "hidden");
			$("#required_email").css("visibility", "hidden");
		}
		$(pages[curr_page]).hide();
		curr_page += 1;
		$(pages[curr_page]).show();
	}
	
	return false;
}

function loadPreviousPage() {
	if (curr_page > 0) {
		$(pages[curr_page]).hide();
		curr_page -= 1;
		$(pages[curr_page]).show();
	}
	return false;
}

function startSession() {
	startTimer();
	startTime = new Date().getTime();
	console.log("here2");
	getSurvey();
}

function serializeAnswers() {
	if ($("#eng").is(":visible")) {
		var fields = $("#form_eng").serializeArray();
		
		$.each(fields, function(i, field) {
			for (var j = 0; j < survey_data.length; j++) {
				if (field.name == survey_data[j].name) {
					if (field.value == "true") {
						survey_data[j].value = true;
					}
					else if (field.value == "false") {
						survey_data[j].value = false;
					}
					else if (survey_data[j].value != "") {
						survey_data[j].value += "," + field.value;
					}
					else {
						survey_data[j].value = parseInt(field.value, 10);
					}
				}
			}
		});
	}
}

function getSurvey() {
	var successCb = function(data, textStatus, jqXHR) {
		if (DEBUG) {
		console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
		}
		jqData = data.collection.items[0].data;
		survey_data[0].value = jqData[0].value;
		survey_data[1].value = jqData[1].value;
	};
	
	var failCb = function(jqXHR, textStatus, errorThrown) {
		if (DEBUG) {
			console.log("ERROR: textStatus: ", textStatus, ", error: ", errorThrown);
		}
	};
	
	APIClient.getSurvey(sessionStorage.getItem("survey_url"), successCb, failCb);
	
	return false;
}

function sendSurvey() {
	var successCb = function(data, textStatus, jqXHR) {
		if (DEBUG) {
		console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
		}
		survey_sent = true;
	};
	
	var failCb = function(jqXHR, textStatus, errorThrown) {
		if (DEBUG) {
			console.log("ERROR: textStatus: ", textStatus, ", error: ", errorThrown);
		}
	};
	
	APIClient.updateSurvey(survey_data, sessionStorage.getItem("survey_url"), successCb, failCb);
	
	return false;
}

function endSession() {
  if (!survey_sent) {
	serializeAnswers();
	sendSurvey();
  }
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
	// Navigation:
	$(".nbutton").on("click", loadNextPage);
	$(".bbutton").on("click", loadPreviousPage);
	$("#backToMain").on("click", endSession);
	
	startSession();
	console.log("here1");
})
