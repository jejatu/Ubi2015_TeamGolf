var left = $("#slider").position.left;
var width = $(window).width() * 0.25;
var nextPage = "interactive.html";

$(function() {
  $("#slider").draggable({
		axis: 'x',
		containment: 'parent',
		drag: function(event, ui) {
			if (ui.position.left > width) {
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
