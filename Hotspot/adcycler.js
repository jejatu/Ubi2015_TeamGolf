var type = "video";
var muted = true
var images = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png"];
var videos = ["ads/video1.mp4", "ads/video2.mp4", "ads/video3.mp4"];
var videos2 = ["ads/video1.webm", "ads/video2.webm", "ads/video3.webm"];
var current = 0;
var interval = 6000;
var adsStarted = []

function cycleImages() {
  document.getElementById('image').src = images[current];
  current = (current + 1) % images.length;
  adsStarted.push(current);
}

function cycleVideos() {
	var video = document.getElementById("video");
	var mp4_source = document.getElementById("mp4_src");
	var webm_source = document.getElementById("webm_src");
	
	mp4_source.src = videos[current];
	webm_source.src = videos2[current];
	
	video.load();
	video.play();
	video.muted = muted;
	
	current = (current + 1) % videos.length;
	adsStarted.push(current);
}

function startAds() {
  $(".img_content").hide();
  $(".video_content").hide();

  if (type === "image") {
    $(".img_content").show();
    cycleImages();
    setInterval(cycleImages, interval);
  }
  else if (type === "video") {
    $(".video_content").show();
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