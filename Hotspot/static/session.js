//database information
var id = 0;
var code = 123;
var startTime = 0;
var place = "home";
var numberOfInteractions = 0;
var gameScore = 0;
var typeOfAd = ""
var contentAd = ""

//idle variables
var timer = 2000;
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
  id = generateUUID();
  startTime = new Date().getTime();
  console.log("started session " + id + " at " + getRightNow());
}

function sendSession() {
  var session = { code: code,
                  start_time: startTime,
                  end_time: new Date().getTime(),
                  place: place,
                  number_of_interaction: numberOfInteractions,
                  game_score: gameScore,
                  type_of_ad: getTypeOfAd(),
                  content_ad: getAdsStarted()
                };
  console.log(session);
  $.ajax({
    url: '/api/sessions/',
    type: 'POST',
    data: JSON.stringify({template: {data: session}}),
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    async: false,
    success: function(msg) {
        alert(msg);
    }
});
}

function endSession() {
  sendSession();
  //window.location = idlePage;
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
