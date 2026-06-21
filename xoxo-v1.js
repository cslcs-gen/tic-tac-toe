const boardElement = document.querySelector("#board");
const statusText = document.querySelector("#status");
const resetButton = document.querySelector("#resetButton");
const shareButton = document.querySelector("#shareButton");
const newRoundButton = document.querySelector("#newRoundButton");
const clearScoresButton = document.querySelector("#clearScoresButton");
const twoPlayerButton = document.querySelector("#twoPlayerButton");
const computerButton = document.querySelector("#computerButton");
const sizeButtons = Array.from(document.querySelectorAll(".size-button"));
const winsX = document.querySelector("#winsX");
const winsO = document.querySelector("#winsO");
const draws = document.querySelector("#draws");
const scoreX = document.querySelector("#scoreX");
const scoreO = document.querySelector("#scoreO");
const SHARE_TITLE = "Tic Tac Xoxo";
const SHARE_TEXT = "Play Tic Tac Xoxo in 3x3, 4x4, or 5x5 mode.";
const SHARE_URL = "https://xotrix.buildjoynow.com/";

let boardSize = 3;
let board = createEmptyBoard(boardSize);
let cells = [];
let currentPlayer = "X";
let roundOver = false;
let gameMode = "two-player";
let computerThinking = false;
let score = {
  X: 0,
  O: 0,
  draws: 0,
};

function createEmptyBoard(size) {
  return Array(size * size).fill("");
}

function createWinningLines(size) {
  const lines = [];

  for (let row = 0; row < size; row += 1) {
    lines.push(Array.from({ length: size }, (_, column) => row * size + column));
  }

  for (let column = 0; column < size; column += 1) {
    lines.push(Array.from({ length: size }, (_, row) => row * size + column));
  }

  lines.push(Array.from({ length: size }, (_, index) => index * size + index));
  lines.push(Array.from({ length: size }, (_, index) => index * size + (size - 1 - index)));

  return lines;
}

function createBoardCells() {
  boardElement.textContent = "";
  boardElement.style.setProperty("--board-size", boardSize);
  boardElement.setAttribute("aria-label", `${boardSize} by ${boardSize} Tic Tac Xoxo board`);

  cells = board.map((_, index) => {
    const cell = document.createElement("button");
    cell.className = "cell";
    cell.type = "button";
    cell.setAttribute("role", "gridcell");
    cell.addEventListener("click", () => playTurn(index));
    boardElement.append(cell);
    return cell;
  });
}

function render() {
  cells.forEach((cell, index) => {
    cell.classList.toggle("x", board[index] === "X");
    cell.classList.toggle("o", board[index] === "O");
    cell.disabled = Boolean(board[index]) || roundOver || computerThinking;
    cell.setAttribute("aria-label", `Cell ${index + 1}${board[index] ? `, ${board[index]}` : ""}`);
  });

  winsX.textContent = score.X;
  winsO.textContent = score.O;
  draws.textContent = score.draws;
  scoreX.classList.toggle("active", currentPlayer === "X" && !roundOver);
  scoreO.classList.toggle("active", currentPlayer === "O" && !roundOver);
  twoPlayerButton.classList.toggle("active", gameMode === "two-player");
  computerButton.classList.toggle("active", gameMode === "computer");
  sizeButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.size) === boardSize);
  });
}

function findWinner() {
  for (const line of createWinningLines(boardSize)) {
    const [a] = line;
    if (board[a] && line.every((index) => board[index] === board[a])) {
      return { player: board[a], line };
    }
  }

  if (board.every(Boolean)) {
    return { player: "draw", line: [] };
  }

  return null;
}

function playTurn(index) {
  if (board[index] || roundOver || computerThinking) {
    return;
  }

  takeSquare(index);
}

function takeSquare(index) {
  board[index] = currentPlayer;
  const result = findWinner();

  if (result?.player === "draw") {
    roundOver = true;
    score.draws += 1;
    statusText.textContent = "Round drawn";
  } else if (result) {
    roundOver = true;
    score[result.player] += 1;
    statusText.textContent = `${result.player} wins`;
    result.line.forEach((cellIndex) => cells[cellIndex].classList.add("win"));
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `${currentPlayer} to move`;
    queueComputerMove();
  }

  render();
}

function queueComputerMove() {
  if (gameMode !== "computer" || currentPlayer !== "O" || roundOver) {
    return;
  }

  computerThinking = true;
  statusText.textContent = "Computer thinking";
  render();

  window.setTimeout(() => {
    const move = chooseComputerMove();
    computerThinking = false;
    if (move !== -1) {
      takeSquare(move);
    }
    render();
  }, 350);
}

function chooseComputerMove() {
  return findBestMove("O")
    ?? findBestMove("X")
    ?? pickFirstOpen(getCenterIndexes())
    ?? pickFirstOpen(getCornerIndexes())
    ?? pickRandomOpen();
}

function findBestMove(player) {
  for (let index = 0; index < board.length; index += 1) {
    if (board[index]) {
      continue;
    }

    board[index] = player;
    const result = findWinner();
    board[index] = "";

    if (result?.player === player) {
      return index;
    }
  }

  return null;
}

function pickFirstOpen(indexes) {
  return indexes.find((index) => !board[index]) ?? null;
}

function getCenterIndexes() {
  if (boardSize % 2 === 1) {
    return [Math.floor(board.length / 2)];
  }

  const upperLeftCenter = (boardSize / 2 - 1) * boardSize + (boardSize / 2 - 1);
  return [
    upperLeftCenter,
    upperLeftCenter + 1,
    upperLeftCenter + boardSize,
    upperLeftCenter + boardSize + 1,
  ];
}

function getCornerIndexes() {
  return [
    0,
    boardSize - 1,
    board.length - boardSize,
    board.length - 1,
  ];
}

function pickRandomOpen() {
  const open = board
    .map((value, index) => value ? null : index)
    .filter((index) => index !== null);

  if (!open.length) {
    return -1;
  }

  return open[Math.floor(Math.random() * open.length)];
}

function newRound() {
  board = createEmptyBoard(boardSize);
  currentPlayer = "X";
  roundOver = false;
  computerThinking = false;
  statusText.textContent = "X to move";
  createBoardCells();
  render();
}

function clearScores() {
  score = {
    X: 0,
    O: 0,
    draws: 0,
  };
  newRound();
}

function setMode(mode) {
  gameMode = mode;
  clearScores();
}

function setBoardSize(size) {
  boardSize = size;
  clearScores();
}

resetButton.addEventListener("click", newRound);
newRoundButton.addEventListener("click", newRound);
clearScoresButton.addEventListener("click", clearScores);
twoPlayerButton.addEventListener("click", () => setMode("two-player"));
computerButton.addEventListener("click", () => setMode("computer"));
sizeButtons.forEach((button) => {
  button.addEventListener("click", () => setBoardSize(Number(button.dataset.size)));
});

async function shareGame() {
  const shareData = {
    title: SHARE_TITLE,
    text: SHARE_TEXT,
    url: SHARE_URL,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(SHARE_URL);
    shareButton.title = "Link copied";
    shareButton.setAttribute("aria-label", "Tic Tac Xoxo link copied");
    window.setTimeout(() => {
      shareButton.title = "Share Tic Tac Xoxo";
      shareButton.setAttribute("aria-label", "Share Tic Tac Xoxo");
    }, 1600);
  } catch (error) {
    window.location.href = `mailto:?subject=${encodeURIComponent(SHARE_TITLE)}&body=${encodeURIComponent(`${SHARE_TEXT} ${SHARE_URL}`)}`;
  }
}

if (shareButton) {
  shareButton.addEventListener("click", shareGame);
}

createBoardCells();
render();
