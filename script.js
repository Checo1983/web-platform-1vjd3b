function getTetrisNextBlock() {
  const sequence = ['I', 'J', 'O', 'T', 'Z', 'S', 'L'];
  const rand = Math.floor(Math.random() * 7);
  const name = sequence.splice(rand, 1)[0];
  const matrix = tetrisBlock[name];
  const col = 4;
  const row = -1;

  return { name: name, matrix: matrix, col: col, row: row };
}

function validMove() {
  for (let x = 0; x < tetrisNextBlock.matrix.length; x++) {
    for (let y = 0; y < tetrisNextBlock.matrix[x].length; y++) {
      if (
        tetrisNextBlock.matrix[x][y] &&
        (tetrisNextBlock.row + x >= tetrisField.length ||
          tetrisField[tetrisNextBlock.row + x][tetrisNextBlock.col + y] ||
          tetrisNextBlock.col + y >= tetrisField[0].length ||
          tetrisNextBlock.col + y < 0)
      ) {
        return false;
      }
    }
  }
  return true;
}

function placeTetris() {
  for (let x = 0; x < tetrisNextBlock.matrix.length; x++) {
    for (let y = 0; y < tetrisNextBlock.matrix[x].length; y++) {
      if (tetrisNextBlock.matrix[x][y]) {
        if (tetrisNextBlock.row < 0) {
          displayGameOver();
        }
        tetrisField[tetrisNextBlock.row + x][tetrisNextBlock.col + y] =
          tetrisNextBlock.name;
      }
    }
  }

  for (let row = tetrisField.length - 1; row >= 0; ) {
    if (tetrisField[row].every(cell => !!cell)) {
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < tetrisField[r].length; c++) {
          tetrisField[r][c] = [r - 1][c];
        }
      }
    } else {
      row--;
    }
  }
  tetrisNextBlock = getTetrisNextBlock();
}
function displayGameOver() {
  cancelAnimationFrame(reqTetUpdate);
  gameOver = true;

  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);

  context.fillStyle = 'white';
  context.globalAlpha = 1;
  context.font = '30px monospace';
  context.textBaseline = 'middle';
  context.textAlign = 'center';
  context.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
}
const tetrisBlock = {
  I: [[0, 0, 0], [1, 1, 1], [0, 0, 0]],
  J: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
  L: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  O: [[1, 1], [1, 1]]
};

const tetrisBlockColour = {
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  S: 'yellow',
  Z: 'green',
  T: 'red',
  O: 'purple'
};

const tetrisField = [];

for (let row = 0; row < 10; row++) {
  tetrisField[row] = [];
  for (let col = 0; col < 10; col++) {
    tetrisField[row][col] = 0;
  }
}
const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
const grid = 30;

let reqTetUpdate = null;
let gameOver = false;
let tetrisNextBlock = getTetrisNextBlock();
let count = 0;

function cyclic() {
  reqTetUpdate = requestAnimationFrame(cyclic);
  context.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      if (tetrisField[x][y]) {
        context.fillStyle = tetrisBlockColour[tetrisField[x][y]];
        context.fillRect(y * grid, x * grid, grid - 1, grid - 1);
      }
    }
  }

  if (tetrisNextBlock) {
    if (++count > 30) {
      count = 0;
      tetrisNextBlock.row++;

      if (!validMove()) {
        tetrisNextBlock.row--;
        placeTetris();
      }
    }
    context.fillStyle = tetrisBlockColour[tetrisNextBlock.name];

    for (let x = 0; x < tetrisNextBlock.matrix.length; x++) {
      for (let y = 0; y < tetrisNextBlock.matrix[x].length; y++) {
        if (tetrisNextBlock.matrix[x][y]) {
          context.fillRect(
            (y + tetrisNextBlock.col) * grid,
            (x + tetrisNextBlock.row) * grid,
            grid - 1,
            grid - 1
          );
        }
      }
    }
  }
}

document.addEventListener('keydown', function(e) {
  if (gameOver) return;
  if (e.key === 'ArrowLeft') {
    const col = tetrisNextBlock.col;
    tetrisNextBlock.col--;
    if (!validMove()) {
      tetrisNextBlock.col = col;
    }
  }

  if (e.key === 'ArrowRight') {
    const col = tetrisNextBlock.col;
    tetrisNextBlock.col++;
    if (!validMove()) {
      tetrisNextBlock.col = col;
    }
  }

  if (e.key === 'ArrowDown') {
    const row = tetrisNextBlock.col;
    tetrisNextBlock.row++;
    if (!validMove()) {
      tetrisNextBlock.row = row;
    }
  }

  if (e.key === 'ArrowUp') {
    const matrix = tetrisNextBlock.matrix;
    const N = tetrisNextBlock.matrix.length - 1;
    const result = tetrisNextBlock.matrix.map((row, i) =>
      row.map((val, j) => tetrisNextBlock.matrix[N - j][i])
    );
    tetrisNextBlock.matrix = result;
    if (!validMove()) {
      tetrisNextBlock.matrix = matrix;
    }
  }
});

reqTetUpdate = requestAnimationFrame(cyclic);
