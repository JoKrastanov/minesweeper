import { Cell } from "./cell";
import { mineNumberColors } from "./numberColors";
import { Timer } from "./timer";

const boardHTML = document.querySelector(".board") as HTMLDivElement;
const nrOfRows = 16;
const nrOfCols = 16;
const nrOfBombs = 40;
const board: Cell[][] = new Array(nrOfRows).fill([]).map(() => new Array(nrOfCols).fill(0));

const timerContainer = document.querySelector(".timer-container") as HTMLDivElement;
const flagContainer = document.querySelector(".flag-progress") as HTMLDivElement;

const timerHTML = document.querySelector(".timer") as HTMLParagraphElement;
const flagCountHTML = document.querySelector(".flag-count") as HTMLParagraphElement;
const button = document.querySelector(".start-game") as HTMLButtonElement;
const message = document.querySelector(".message") as HTMLParagraphElement;

let nrOfRemainingFlags = 0;
let timer: Timer;

const startGame = () => {
  nrOfRemainingFlags = nrOfBombs;
  timer = new Timer(timerHTML);
  prepareHTMLElements();
  createBoard(nrOfRows, nrOfCols, nrOfBombs);
}

timerContainer.style.display = "none";
flagContainer.style.display = "none";
button?.addEventListener("click", startGame)

const prepareHTMLElements = () => {
  button.style.display = "none";
  message.style.display = "none";
  message.innerHTML = "";
  boardHTML.innerHTML = "";
  timerContainer.style.display = "flex";
  flagContainer.style.display = "flex";
  flagCountHTML.innerText = nrOfRemainingFlags.toString();
}

const placeBombs = (rows: number, cols: number, bombCount: number) => {
  let placedBombs = 0;

  while (placedBombs < bombCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!board[row][col].getIsBomb()) {
      board[row][col].setIsBomb(true);
      addAdjacentBombs(row, col);
      placedBombs++;
    }
  }
}

const createBoard = (rows: number, cols: number, nrOfBombs: number) => {
  boardHTML.style.setProperty("grid-template-rows", `repeat(${rows}, 1fr)`);
  boardHTML.style.setProperty("grid-template-columns", `repeat(${cols}, 1fr)`);

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < cols; j++) {
      const cellDiv = document.createElement("div");
      cellDiv.classList.add("cell");
      cellDiv.setAttribute("row", `${i}`);
      cellDiv.setAttribute("col", `${j}`);
      cellDiv.classList.add("unrevealed");
      const cell = new Cell(j, i, cellDiv);
      setupCellEvents(cell);

      boardHTML.appendChild(cellDiv);
      board[i][j] = cell;
    }
  }

  placeBombs(rows, cols, nrOfBombs);
};

const setupCellEvents = (cell: Cell) => {
  const cellDiv = cell.getHTML();
  cellDiv.onclick = () => {
    revealCell(cell);
  }

  cellDiv.oncontextmenu = (e) => {
    e.preventDefault();
    if (cell.getIsRevealed()) {
      return;
    }
    if (cell.getIsFlagged()) {
      nrOfRemainingFlags++;
      cell.setIsFlagged(false);
      cellDiv.classList.remove("flagged");
      cellDiv.innerHTML = "";
    } else {
      nrOfRemainingFlags--;
      cellDiv.appendChild(createFlagElement());
      cell.setIsFlagged(true);
      cellDiv.classList.add("flagged");
    }
    flagCountHTML.innerText = nrOfRemainingFlags.toString();
    if (nrOfRemainingFlags <= 0) {
      checkAndPossiblyWinGame();
      return;
    }
  }
}

const revealCell = (cell: Cell) => {
  if (cell.getIsRevealed() || cell.getIsFlagged()) {
    return;
  }

  const cellDiv = cell.getHTML();
  cellDiv.classList.remove("unrevealed");
  cellDiv.classList.add("revealed");
  cell.setIsRevealed(true);

  if (cell.getIsBomb()) {
    cellDiv.appendChild(createBombElement());
    setGameOver("Game Over! You hit a bomb!");
    return;
  }

  const adjacentBombs = cell.getNrAdjacentBombs();
  if (adjacentBombs > 0) {
    cellDiv.appendChild(createNrOfBombsElement(adjacentBombs));
    return;
  }

  const [col, row] = [cell.getX(), cell.getY()];
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i === row && j === col) continue;
      if (i >= 0 && i < nrOfRows && j >= 0 && j < nrOfCols) {
        revealCell(board[i][j]);
      }
    }
  }
};

const checkAndPossiblyWinGame = () => {
  const allBombsAreFlagged = board.every(
    (row) => {
      return row.every(
        (cell) => {
          if (!cell.getIsBomb()) {
            return true;
          }
          return cell.getIsBomb() && cell.getIsFlagged();
        }
      )
    }
  );
  if (allBombsAreFlagged) {
    setGameOver("Congratulations! You won!");
  }
}

const setGameOver = (messageStr: string) => {
  board.forEach(
    (row) => {
      row.forEach(
        (cell) => {
          cell.getHTML().onclick = null;
          cell.getHTML().oncontextmenu = null;
        })
    })
  timer.stopTimer();
  button.style.display = "block";
  message.style.display = "block";
  console.log(messageStr);
  message.innerHTML = messageStr;
}

const addAdjacentBombs = (row: number, col: number) => {
  const numRows = board.length;
  const numCols = board[0].length;

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || j < 0 || i >= numRows || j >= numCols || (i === row && j === col)) {
        continue;
      }

      if (!board[i][j].getIsBomb()) {
        board[i][j].setNrAdjacentBombs(board[i][j].getNrAdjacentBombs() + 1);
      }
    }
  }
};

const createFlagElement = () => {
  const flag = document.createElement("img");
  flag.classList.add("flag");
  flag.src = "public/assets/flag.png";
  return flag;
}

const createBombElement = () => {
  const bomb = document.createElement("img");
  bomb.classList.add("bomb");
  bomb.src = "public/assets/bomb.png";
  return bomb;
}

const createNrOfBombsElement = (nrOfBombs: number) => {
  const bombCount = document.createElement("div");
  bombCount.classList.add("bomb-count");
  bombCount.innerText = nrOfBombs.toString();
  bombCount.style.color = mineNumberColors[nrOfBombs];
  return bombCount;
}