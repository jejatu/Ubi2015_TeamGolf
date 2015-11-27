$(function() {
	var maxLeft = $("#sliderParent").width() - $("#slider").width();
	var interactivePage = "interactive.html";

  $("#slider").draggable({
    axis: 'x',
    containment: 'parent',
    drag: function(event, ui) {
      if (ui.position.left >= maxLeft) {
        window.location = interactivePage;
      }
    },
    stop: function(event, ui) {
      $(this).animate({
        left: 0
      })
    }
  });
});
