const canvas = document.getElementById("canvas");
const ROWS = 30;
const COLS = 50;
const PIXEL = 10;
const UP = "up";
const DOWN = "down";
const RIGHT = "right";
const LEFT = "left";
const SNAKE_SPEED = 200;

let _stopGame = false;

function createElementId(x, y) {
  return `x${x}y${y}`;
}

function createPixel(atRow, atCol, id) {
  let pixel = document.createElement("div");

  pixel.style.position = "absolute";
  pixel.style.border = "1px solid grey";
  pixel.style.left = PIXEL * atCol + "px";
  pixel.style.top = PIXEL * atRow + "px";
  pixel.style.width = PIXEL + "px";
  pixel.style.height = PIXEL + "px";
  pixel.style.backgroundColor = "white";

  if (id) {
    pixel.id = id;
  }

  return pixel;
}

function renderBoard() {
  for (let x = 0; x < ROWS; x++) {
    for (let y = 0; y < COLS; y++) {
      let pixelId = createElementId(x, y);
      let pixel = createPixel(x, y, pixelId);

      canvas.appendChild(pixel);
    }
  }
}

function changePixelColor(pixelAxis, color) {
  const [row, col] = pixelAxis;
  const elementId = createElementId(row, col);
  const pixel = document.getElementById(elementId);

  pixel.style.backgroundColor = color;
}

function clearPixels(pixels = [[]]) {
  for (let z = 0; z < pixels.length; z++) {
    changePixelColor(pixels[z], "white");
  }
}

function renderSnake(snakePosition = [], tail = []) {
  clearPixels([tail]);

  for (let m = 0; m < snakePosition.length; m++) {
    changePixelColor(snakePosition[m], "#000");
  }
}

function getKeyDirection(event) {
  event.preventDefault();
  event.stopPropagation();

  switch (event.keyCode) {
    case 119:
      return UP;
    case 115:
      return DOWN;
    case 97:
      return LEFT;
    case 100:
      return RIGHT;
    case 120: // x
      _stopGame = !_stopGame;
    default:
      return undefined;
  }
}

let currentDirection = RIGHT;
let currentSnakePosition = [
  [0, 0], //tail
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6], // head
];

// when changing the direction, what changes is the head
// if direction changes to either right or left, the column is affected
// if direction changes to either top or down, the row is affected
function getNextStep(direction, snakePosition) {
  // create a new array from the original but without the first element (the snake's tail).
  const newSnakePosition = snakePosition.slice(1, snakePosition.length);
  const currentHead = snakePosition[snakePosition.length - 1];
  let newHead = [...currentHead];

  if (direction === RIGHT) {
    newHead = [currentHead[0], currentHead[1] + 1];
  }

  if (direction === LEFT) {
    newHead = [currentHead[0], currentHead[1] - 1];
  }

  if (direction === UP) {
    newHead = [currentHead[0] - 1, currentHead[1]];
  }

  if (direction === DOWN) {
    newHead = [currentHead[0] + 1, currentHead[1]];
  }

  return [...newSnakePosition, newHead];
}

function makeNextStep() {
  const newSnakePosition = getNextStep(currentDirection, currentSnakePosition);

  const tail = currentSnakePosition[0];

  currentSnakePosition = newSnakePosition;

  renderSnake(currentSnakePosition, tail);

  if (!_stopGame) {
    setTimeout(makeNextStep, SNAKE_SPEED);
  }
}

function areSelfExcludingDirs(currentDir, newDir) {
  return !(
    (currentDir === RIGHT && newDir !== LEFT) ||
    (currentDir === LEFT && newDir !== RIGHT) ||
    (currentDir === UP && newDir !== DOWN) ||
    (currentDir === DOWN && newDir !== UP)
  );
}

//--- Game flow >>>

window.addEventListener("keypress", function (e) {
  const newDir = getKeyDirection(e);

  // The opposite direction of the current one is not allowed
  if (!areSelfExcludingDirs(currentDirection, newDir)) {
    currentDirection = newDir;
  }
});

renderBoard(currentSnakePosition);

setTimeout(makeNextStep, SNAKE_SPEED);
