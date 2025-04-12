const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreEl = document.getElementById("score");
const levelEl = document.getElementById("level");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restartBtn");

let player, bullets, enemies, score, level, gameOver, keys;
let enemySpeed = 1;

const levelThemes = [
  { background: "black", speed: 1 },
  { background: "#001f3f", speed: 2 },
  { background: "#7f0000", speed: 3 }
];

function initGame() {
  player = { x: canvas.width / 2 - 25, y: canvas.height - 60, width: 50, height: 20 };
  bullets = [];
  enemies = [];
  score = 0;
  level = 1;
  gameOver = false;
  keys = {};

  spawnEnemies();
  updateHUD();
  restartBtn.style.display = "none";
  statusEl.textContent = "Playing...";

  requestAnimationFrame(gameLoop);
}

function spawnEnemies() {
  enemies = [];
  for (let i = 0; i < 6 + level * 2; i++) {
    enemies.push({
      x: 80 * (i % 6) + 20,
      y: Math.floor(i / 6) * 40 + 20,
      width: 40,
      height: 20,
      speed: levelThemes[level - 1].speed
    });
  }
}

function updateHUD() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  canvas.style.background = levelThemes[level - 1].background;
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === " ") shoot();
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function shoot() {
  bullets.push({
    x: player.x + player.width / 2 - 2.5,
    y: player.y,
    width: 5,
    height: 10,
    speed: 7
  });
}

function update() {
  if (keys["ArrowLeft"]) player.x -= 5;
  if (keys["ArrowRight"]) player.x += 5;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  bullets.forEach((b, i) => {
    b.y -= b.speed;
    if (b.y < 0) bullets.splice(i, 1);
  });

  enemies.forEach((e) => {
    e.y += e.speed;
    if (e.y + e.height > canvas.height) endGame();
  });

  bullets.forEach((b, bi) => {
    enemies.forEach((e, ei) => {
      if (
        b.x < e.x + e.width &&
        b.x + b.width > e.x &&
        b.y < e.y + e.height &&
        b.y + b.height > e.y
      ) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score += 10;
        updateHUD();
      }
    });
  });

  enemies.forEach((e) => {
    if (
      e.x < player.x + player.width &&
      e.x + e.width > player.x &&
      e.y < player.y + player.height &&
      e.y + e.height > player.y
    ) {
      endGame();
    }
  });

  // Level up every 60 points
  if (score >= 60 * level && level < 3) {
    level++;
    spawnEnemies();
    updateHUD();
  }

  if (enemies.length === 0) {
    spawnEnemies();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  ctx.fillStyle = "white";
  bullets.forEach((b) => ctx.fillRect(b.x, b.y, b.width, b.height));

  ctx.fillStyle = "red";
  enemies.forEach((e) => ctx.fillRect(e.x, e.y, e.width, e.height));
}

function gameLoop() {
  if (!gameOver) {
    update();
    draw();
    requestAnimationFrame(gameLoop);
  }
}

function endGame() {
  gameOver = true;
  statusEl.textContent = "Game Over!";
  restartBtn.style.display = "inline-block";
}

restartBtn.addEventListener("click", initGame);

initGame();
