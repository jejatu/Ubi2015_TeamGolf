var ads = ["ads/ad1.png", "ads/ad2.png", "ads/ad3.png"];
var current = 0;
var interval = 1000;

function cycle() {
  document.getElementById('ad').src = ads[current];
  current = (current + 1) % ads.length;
}

window.onload = function() {
    cycle();
    setInterval(cycle, interval);
}
