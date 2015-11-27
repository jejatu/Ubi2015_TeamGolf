function numpadPressed(value)
            {
               if(document.getElementById("c_input").textContent.length <= 2)
               {
                   
                    //Number key pressed...
                    if(value != "del" && value != "clr")
                    {
                        document.getElementById("c_input").appendChild(document.createTextNode(value));
                    }
               }
                
                //Delete pressed...
                if(value=="del")
                {
                    var current = document.getElementById("c_input").textContent;
                    var newString = current.substring(0, current.length -1);
                    document.getElementById("c_input").innerHTML = newString;
                }

                //Clear pressed...
                if(value=="clr")
                {
                    document.getElementById("c_input").innerHTML = "";
                }
            }