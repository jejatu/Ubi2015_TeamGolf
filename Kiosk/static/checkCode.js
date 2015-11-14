function checkCode()
{
  var code = document.getElementById("c_input").textContent;

  if (code.length == 3) {
    //window.location.href = "page_1.html";
    var survey = {code: code.toString()};

    $(document).ready(function() {
      $.ajax({
        url: '/api/surveys/',
        type: 'POST',
        data : JSON.stringify({template: {data: survey}}),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function(responseText) { // Get the result and associated session_id if code is correct
          //if no such code is found...
          if(responseText == 0){
              document.getElementById("c_input").innerHTML = "";
              alert("Hups, antamaasi koodia ei tunnistettu! (koodi: " + code + ")");
          }
          //if code is found...
          else if(responseText > 0){
              //get the associated session id for the given code, and pass as parameter to 1st page
              $.post({
                  data: checkSession,
                  success: function(session_id){
                      window.location.href = "page_1.html?session_id="+session_id;
                  }
              });
          }
          //if all goes to hell
          else{
              alert('Oh noes, jotain meni vikaan tietokantayhteydessä: ' + responseText);
          }
        }
      });
    });
  }
}
