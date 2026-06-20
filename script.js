const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#status");
const resetButton = document.querySelector("#resetButton");
const newRoundButton = document.querySelector("#newRoundButton");
const clearScoresButton = document.querySelector("#clearScoresButton");
const twoPlayerButton = document.querySelector("#twoPlayerButton");
const computerButton = document.querySelector("#computerButton");
const winsX = document.querySelector("#winsX");
const winsO = document.querySelector("#winsO");
const draws = document.querySelector("#draws");
const scoreX = document.querySelector("#scoreX");
const scoreO = document.querySelector("#scoreO");

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let board = Array(9).fill("");
let currentPlayer = "X";
let roundOver = false;
let gameMode = "two-player";
let computerThinking = false;
let score = {
  X: 0,
  O: 0,
  draws: 0,
};

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
}

function findWinner() {
  for (const line of winningLines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
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
    ?? pickFirstOpen([4])
    ?? pickFirstOpen([0, 2, 6, 8])
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
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
  computerThinking = false;
  statusText.textContent = "X to move";
  cells.forEach((cell) => cell.classList.remove("win"));
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

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playTurn(index));
});

resetButton.addEventListener("click", newRound);
newRoundButton.addEventListener("click", newRound);
clearScoresButton.addEventListener("click", clearScores);
twoPlayerButton.addEventListener("click", () => setMode("two-player"));
computerButton.addEventListener("click", () => setMode("computer"));

render();
