// REMEMBER to include apiclient!
var DEBUG = true;

var survey_data = [
{name: "survey_id", value: 0},
{name: "session_id", value: 0},
{name: "age", value: 0},
{name: "gender", value: ""},
{name: "what_was_on_the_screen", value: ""},
{name: "did_it_raise_positive_or_negative_emotions", value: 0},
{name: "how_many_ads_did_you_see", value: 0},
{name: "describe_the_ads_you_saw", value: ""},
{name: "did_any_of_ads_gain_intrest", value: ""},
{name: "did_ads_annoy_why", value: ""},
{name: "ads_gained_attention", value: 0},
{name: "found_ads_interesting", value: 0},
{name: "might_buy", value: 0},
{name: "disp_better_than_printed_ad", value: 0},
{name: "disp_better_than_television_ad", value: 0},
{name: "disp_ads_annoy_me", value: 0},
{name: "pay_attention_to_ads", value: 0},
{name: "often_buy_products_on_ads", value: 0},
{name: "pub_disp_suited_for_ads", value: 0},
{name: "where_else_seen_public_displays", value: ""},
{name: "remember_seeing_ads_on_pub_disp", value: ""},
{name: "seen_pub_disp_for_other_than_ads", value: ""},
];

//idle variables
var timer = 1600000;
var timeoutId = null;
var idlePage = "index.html";
var survey_sent = false;
var surveyRetrieved = false;

//Question page:
var curr_page = 0;
var pages = [".q1", ".q2", ".q3", ".q4", ".q5", ".q6",".q7",".q8", ".q9", ".q10", ".q11", ".q12", ".q13",".q14",".q15",".q16", ".q17", ".q18", ".q19", ".q20", ".q21",".q22"];

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
		if (surveyRetrieved) {
			sendLottery();
		}
		$(pages[curr_page]).hide();
		curr_page += 1;
		$(pages[curr_page]).show();
		return false;
	}

	if (curr_page < pages.length-2) {
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
	surveyRetrieved = false;
	getSurvey();
}

function serializeAnswers() {
	var fields = $("#form_eng").serializeArray();
	$.each(fields, function(i, field) {
		console.log(field);
		console.log(field.value);
		for (var j = 0; j < survey_data.length; j++) {
			if (field.name == survey_data[j].name) {
				if (field.value == "true") {
					survey_data[j].value = true;
				}
				else if (field.value == "false") {
					survey_data[j].value = false;
				}
				else if (!isNaN(field.value)) {
					survey_data[j].value = parseInt(field.value, 10);
				}
				else if (survey_data[j].value != "") {
					survey_data[j].value += "," + field.value;
				}
				else {
					if (field.value != "") {
						survey_data[j].value = field.value;
					}
				}
			}
		}
	});
}

function getSurvey() {
	var successCb = function(data, textStatus, jqXHR) {
		if (DEBUG) {
		console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
		}
		jqData = data.collection.items[0].data;
		survey_data[0].value = jqData[0].value;
		survey_data[1].value = jqData[1].value;
		document.getElementById("qsurvey_id").value = survey_data[0].value;
		surveyRetrieved = true;
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

function sendLottery() {
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
	
	var lotterydata = $("#form_php").serializeArray();
	
	
	APIClient.addLottery(lotterydata, successCb, failCb);
	
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
})
