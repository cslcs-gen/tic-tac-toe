const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#status");
const resetButton = document.querySelector("#resetButton");
const newRoundButton = document.querySelector("#newRoundButton");
const clearScoresButton = document.querySelector("#clearScoresButton");
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
let score = {
  X: 0,
  O: 0,
  draws: 0,
};

function render() {
  cells.forEach((cell, index) => {
    cell.classList.toggle("x", board[index] === "X");
    cell.classList.toggle("o", board[index] === "O");
    cell.disabled = Boolean(board[index]) || roundOver;
    cell.setAttribute("aria-label", `Cell ${index + 1}${board[index] ? `, ${board[index]}` : ""}`);
  });

  winsX.textContent = score.X;
  winsO.textContent = score.O;
  draws.textContent = score.draws;
  scoreX.classList.toggle("active", currentPlayer === "X" && !roundOver);
  scoreO.classList.toggle("active", currentPlayer === "O" && !roundOver);
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
  if (board[index] || roundOver) {
    return;
  }

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
  }

  render();
}

function newRound() {
  board = Array(9).fill("");
  currentPlayer = "X";
  roundOver = false;
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

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => playTurn(index));
});

resetButton.addEventListener("click", newRound);
newRoundButton.addEventListener("click", newRound);
clearScoresButton.addEventListener("click", clearScores);

render();
