DEBUG = false;

var survey_url = "";

function checkCode()
{
	var code = document.getElementById("c_input").textContent;

	if (code.length == 3) {
		var codeData = [{name: "code", value: code.toString()}];

		var successCb = function(data, textStatus, jqXHR) {
			if (DEBUG) {
			console.log("RECEIVED RESPONSE: data: ", data, ", textStatus: ", textStatus);
			}
			
			survey_url = jqXHR.getResponseHeader("Location");
			sessionStorage.setItem("survey_url", survey_url);
			window.location.href = "test.html"
		};

		var failCb = function(jqXHR, textStatus, errorThrown) {
			if (DEBUG) {
				console.log("ERROR: textStatus: ", textStatus, ", error: ", errorThrown);
			}
		};

		APIClient.addSurvey(codeData, successCb, failCb);
		
		return false;
	}
}
