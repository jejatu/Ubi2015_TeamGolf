            function checkCode()
            {
                var code = document.getElementById("c_input").textContent;
                
                if(code.length <3)
                {
                    $( "#c_div" ).effect( "shake" );
                }
                else
                {
                    //window.location.href = "page_1.html";
                    var codeToPass = 'action=passcode_availability&passcode='+code;
                    var checkSession = 'action=get_session_id&passcode='+code;
					
					$(document).ready(function(){
                    $.post({ // 
						data : codeToPass,
						success: function(responseText){ // Get the result and associated session_id if code is correct
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

                    }
                }