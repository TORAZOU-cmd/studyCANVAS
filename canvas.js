const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.save();

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
const paddleY = canvas.height - paddleHeight - 10;
let rightPressed = false;
let leftPressed = false;
let score = 0;
let lives = 3;
let gameSet = false;

const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", keyDownHandler, false); /*  */
document.addEventListener("keyup", keyupHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(e) {
  switch (e.key) {
    case "Right":
    case "ArrowRight":
      rightPressed = true;
      break;
    case "Left":
    case "ArrowLeft":
      leftPressed = true;
      break;
  }
}

function keyupHandler(e) {
  switch (e.key) {
    case "Right":
    case "ArrowRight":
      rightPressed = false;
      break;
    case "Left":
    case "ArrowLeft":
      leftPressed = false;
      break;
  }
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
    if (paddleX < 0) paddleX = 0;
    if (paddleX > canvas.width - paddleWidth) {
      paddleX = canvas.width - paddleWidth;
    }
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            // alert("YOU WIN, CONGRATULATIONS!");
            resetGame("CONGRATULATIONS!");
            return true;
          }
        }
      }
    }
  }
  return false;
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Score:" + score, 8, 20);
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095dd";
  ctx.fillText("Lives:" + lives, canvas.width - 65, 20);
}

function drawShadow(color = "black", shadowX = 5, shadowY = 5) {
  ctx.shadowColor = color;
  ctx.shadowOffsetX = shadowX;
  ctx.shadowOffsetY = shadowY;
  ctx.shadowBlur = 10;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(x, y, ballRadius, x - 5, y - 5, 0);
  grad.addColorStop(0, "#0095dd");
  grad.addColorStop(1, "#ddd");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  const grad = ctx.createRadialGradient(
    paddleX + 15,
    paddleY + 15,
    75,
    paddleX + 5,
    paddleY + 5,
    0
  );
  grad.addColorStop(0, "#0095dd");
  grad.addColorStop(0.5, "#0095dd");
  grad.addColorStop(1, "#ddd");
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        const grad = ctx.createRadialGradient(
          brickX + 15,
          brickY + 15,
          75,
          brickX + 5,
          brickY + 5,
          0
        );
        grad.addColorStop(0, "#0095dd");
        grad.addColorStop(0.5, "#0095dd");
        grad.addColorStop(1, "#ddd");
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function resetGame(text) {
  ctx.font = "bold 48px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "midlle";
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
}

function draw() {
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > paddleY - ballRadius + 5) {
    if (x > paddleX && x < paddleX + paddleWidth) dy = -Math.abs(dy);
    if (y + dy > canvas.height - ballRadius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (!lives) {
          resetGame("GAME OVER");
          return setTimeout(() => {
            location.reload();
            // requestAnimationFrame(draw);
          }, 3000);
        } else {
          x = canvas.width / 2;
          y = canvas.height - 30;
          dx = 2;
          dy = -2;
          paddleX = (canvas.width - paddleWidth) / 2;
        }
      }
    }
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawShadow("orange");
  drawBall();
  drawPaddle();
  drawBricks();
  gameSet = collisionDetection();
  if (gameSet) {
    return setTimeout(() => {
      location.reload();
      // requestAnimationFrame(draw);
    }, 3000);
  }
  drawScore();
  drawLives();
  x += dx;
  y += dy;
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  }
  if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  requestAnimationFrame(draw);
}

draw();
