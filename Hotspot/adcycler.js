var type = "image";
var muted = true;
var images = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png",
				"ads/ad5.jpg", "ads/ad8.png",
				"ads/ad9.jpg", "ads/ad10.jpeg", "ads/ad11.jpg", "ads/ad12.jpg",
				"ads/ad13.jpg", "ads/ad14.jpg", "ads/ad15.jpg"];
var videos = ["ads/video1.mp4", "ads/video2.mp4", "ads/video3.mp4",
				"ads/video5.mp4", "ads/video7.mp4", "ads/video8.mp4",
				"ads/video10.mp4", "ads/video11.mp4"];
var videos2 = ["ads/video1.webm", "ads/video2.webm", "ads/video3.webm",
				"ads/video5.webm", "ads/video7.webm", "ads/video8.webm",
				"ads/video10.webm", "ads/video11.webm"];
var current = 0;
var interval = 15000;
var adsStarted = [];

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function startAds() {
  $(".img_content").hide();
  $(".video_content").hide();

  if (type === "image") {
    $(".img_content").show();
	current = getRandomInt(0, images.length - 1);
    cycleImages();
    setInterval(cycleImages, interval);
  }
  else if (type === "video") {
    $(".video_content").show();
	current = getRandomInt(0, videos.length - 1);
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