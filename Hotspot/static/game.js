var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
canvas.width = document.getElementById("game").clientWidth;
canvas.height = document.getElementById("game").clientHeight;

var gameOver = false;

var player = {x: 300, y: 600};
var enemies = [];

var enemyTimer = null;

canvas.onmousemove = movePlayer;

function createEnemy() {
	enemies.push({x: Math.random() * canvas.width, y: 0});
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function movePlayer(event) {
  event.preventDefault();

  player = getMousePos(canvas, event);

  return false;
}

function startGame() {
  $("#start").hide();
  enemyTimer = setInterval('createEnemy()', 100);
  update(0);
}

function endGame() {
  gameOver = true;
  if (enemyTimer != null) {
    clearInterval(enemyTimer);
  }
  $("#code").html(getCode());
  $("#pin").show();
}

function update() {
  if (!gameOver) {
    window.requestAnimationFrame(update);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(player.x - 32, player.y - 32, 64, 64);

    for (var i = 0; i < enemies.length; i++) {
      enemies[i].y += 16;
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(enemies[i].x - 2, enemies[i].y - 2, 4, 4);
      if (enemies[i].x > player.x - 32 && enemies[i].x < player.x + 32 &&
          enemies[i].y > player.y - 32 && enemies[i].y < player.y + 32) {
		endGame();
      }
    }
  }
}
