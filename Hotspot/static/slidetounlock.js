var maxLeft = $("#sliderParent").width() - $("#slider").width();
var nextPage = "interactive.html";

$(function() {
  $("#slider").draggable({
    axis: 'x',
    containment: 'parent',
    drag: function(event, ui) {
      if (ui.position.left >= maxLeft) {
        window.location = nextPage;
      }
    },
    stop: function(event, ui) {
      $(this).animate({
        left: 0
      })
    }
  });
});
