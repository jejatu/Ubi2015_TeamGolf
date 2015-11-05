var type = "video";
var images = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png"];
var videos = ["ads/video1.mp4", "ads/video2.mp4", "ads/video3.mp4"];
var current = 0;
var interval = 1000;

function cycleImages() {
  document.getElementById('image').src = images[current];
  current = (current + 1) % images.length;
}

function cycleVideos() {
  document.getElementById('video').src = videos[current];
  document.getElementById('video').play();
  current = (current + 1) % images.length;
}

window.onload = function() {
  $("#image").hide();
  $("#video").hide();

  if (type === "image") {
    $("#image").show();
    cycleImages();
    setInterval(cycleImages, interval);
  }
  else if (type === "video") {
    $("#video").show();
    cycleVideos();
    document.getElementById('video').onended = function() {
      cycleVideos();
    };
  }
}
