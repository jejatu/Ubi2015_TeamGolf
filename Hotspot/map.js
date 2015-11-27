var old = null;
var moving = false;
var mouse = { x: -1, y: -1 };
var lastMouse = { x: -1, y: -1 };

$(document).mousemove(function(event) {
    mouse.x = event.pageX;
    mouse.y = event.pageY;
});

$("#map").mousedown(function(event) {
    event.preventDefault();
});

$("#map").mouseleave(function(event) {
    endMapMove();
});

function moveMap() {
  if (moving) {
    if (old === null)
      startMap();
    old[0] += mouse.x - lastMouse.x;
    old[1] += mouse.y - lastMouse.y;
    lastMouse = { x: mouse.x, y: mouse.y };
    $("#map").css("background-position", old[0] + "px " + old[1] + "px");
  }
}

function startMapMove() {
  old = $("#map").css('background-position').split(" ");
  old[0] = parseInt(old[0].replace("px",""));
  old[1] = parseInt(old[1].replace("px",""));
  lastMouse = { x: mouse.x, y: mouse.y };
  moving = true;
}

function endMapMove() {
  moving = false;
}
