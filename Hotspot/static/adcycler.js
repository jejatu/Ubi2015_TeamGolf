var type = "video";
var muted = true
var images = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png"];
var videos = ["ads/video1.mp4", "ads/video2.mp4", "ads/video3.mp4"];
var current = 0;
var interval = 1000;
var adsStarted = []

function cycleImages() {
  document.getElementById('image').src = images[current];
  current = (current + 1) % images.length;
  adsStarted.push(current);
}

function cycleVideos() {
	var video = document.getElementById("video");;
	document.getElementById("ad_src").src = videos[current];
	
	video.play();
	video.muted = muted;
	
	current = (current + 1) % videos.length;
	adsStarted.push(current);
}

function startAds() {
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

function getTypeOfAd() {
  return type;
}

function getAdsStarted() {
  return adsStarted.join();
}


$(function () {
	startAds();
})