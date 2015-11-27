APIClient = (function() {
// http://amundsen.com/media-types/collection/
var COLLECTIONJSON = "application/vnd.collection+json";
var UTF8 = "charset=utf-8";

var getSessions = function(successCb, failCb) {
	return $.ajax({
		url: "/api/sessions/",
		type: "GET",
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var addSession = function(sessionData, successCb, failCb) {
	return $.ajax({
		url: "/api/sessions/",
		type: "POST",
		data: JSON.stringify({template: {data: sessionData}}),
		processData: false,
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var getSession = function(sessionUrl, successCb, failCb) {
	return $.ajax({
		url: sessionUrl,
		type: "GET",
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var getSurveys = function(successCb, failCb) {
	return $.ajax({
		url: "/api/surveys/",
		type: "GET",
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var addSurvey = function(codeData, successCb, failCb) {
	return $.ajax({
		url: "/api/surveys/",
		type: "POST",
		data: JSON.stringify({template: {data: codeData}}),
		processData: false,
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var getSurvey = function(surveyUrl, successCb, failCb) {
	return $.ajax({
		url: surveyUrl,
		type: "GET",
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

var updateSurvey = function(surveyData, surveyUrl, successCb, failCb) {
	return $.ajax({
		url: surveyUrl,
		type: "PUT",
		data: JSON.stringify({template: {data: surveyData}}),
		processData: false,
		contentType: COLLECTIONJSON + "; " + UTF8
	}).done(successCb)
	.fail(failCb);
};

	return {
		getSessions: getSessions,
		addSession: addSession,
		getSession: getSession,
		getSurveys: getSurveys,
		addSurvey: addSurvey,
		getSurvey: getSurvey,
		updateSurvey: updateSurvey
	};

})();