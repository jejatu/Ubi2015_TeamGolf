var type = "video";
var muted = true
var images = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png", "ads/ad4.jpg",
				"ads/ad5.jpg", "ads/ad6.jpg", "ads/ad7.jpg", "ads/ad8.png",
				"ads/ad9.jpg", "ads/ad10.jpeg", "ads/ad11.jpg", "ads/ad12.jpg",
				"ads/ad13.jpg", "ads/ad14.jpg", "ads/ad15.jpg"];
var videos = ["ads/video1.mp4", "ads/video2.mp4", "ads/video3.mp4", "ads/video4.mp4",
				"ads/video5.mp4", "ads/video6.mp4", "ads/video7.mp4", "ads/video8.mp4",
				"ads/video9.mp4", "ads/video10.mp4", "ads/video11.mp4", "ads/video12.mp4",
				"ads/video13.mp4", "ads/video14.mp4", "ads/video15.mp4"];
var videos2 = ["ads/video1.webm", "ads/video2.webm", "ads/video3.webm", "ads/video4.webm",
				"ads/video5.webm", "ads/video6.webm", "ads/video7.webm", "ads/video8.webm",
				"ads/video9.webm", "ads/video10.webm", "ads/video11.webm", "ads/video12.webm",
				"ads/video13.webm", "ads/video14.webm", "ads/video15.webm"];
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