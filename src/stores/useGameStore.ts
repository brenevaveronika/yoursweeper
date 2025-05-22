import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type CellState = 'hidden' | 'revealed' | 'flagged' | 'question';
interface Cell {
  state: CellState;
  value: number | null;
}

export const useGameStore = defineStore('game', () => {
  // константы туть
  const ROWS = 9;
  const COLS = 9;
  const TOTAL_MINES = 9;

  // states
  const field = ref<Cell[][]>([]);
  const gameState = ref<'idle' | 'playing' | 'win' | 'lose'>('idle');
  const minesCount = ref(TOTAL_MINES);
  const flagsCount = ref(0);
  const timeElapsed = ref(0);
  const timerInterval = ref<NodeJS.Timeout | null>(null);

  // getters
  const remainingMines = computed(() => {
    const remaining = minesCount.value - flagsCount.value;
    return remaining >= 0 ? remaining : 0;
  });

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeElapsed.value / 60);
    const seconds = timeElapsed.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // actions
  function initField() {
    if (field.value.length > 0) return;

    const newField = [];
    for (let i = 0; i < 9; i++) {
      newField.push([]);
      for (let j = 0; j < 9; j++) {
        newField[i].push({
          state: 'hidden',
          value: null
        });
      }
    }
    field.value = newField;
  }

  function generateField(): Cell[][] {
    const newField: Cell[][] = [];

    for (let i = 0; i < ROWS; i++) {
      newField.push([]);
      for (let j = 0; j < COLS; j++) {
        newField[i].push({ state: 'hidden', value: null });
      }
    }

    let minesPlaced = 0;
    while (minesPlaced < TOTAL_MINES) {
      const x = Math.floor(Math.random() * ROWS);
      const y = Math.floor(Math.random() * COLS);

      if (newField[x][y].value !== -1) {
        newField[x][y].value = -1;
        minesPlaced++;
      }
    }

    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {
        if (newField[x][y].value !== -1) {
          newField[x][y].value = countNeighbours(x, y, newField);
        }
      }
    }

    return newField;
  }

  function countNeighbours(x: number, y: number, field: Cell[][]): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < ROWS && ny >= 0 && ny < COLS) {
          if (field[nx][ny].value === -1) count++;
        }
      }
    }
    return count;
  }

  function startGame(firstClickX: number, firstClickY: number) {
    do {
      field.value = generateField();
    } while (field.value[firstClickX][firstClickY].value === -1);

    gameState.value = 'playing';
    startTimer();
    openCell(firstClickX, firstClickY);
  }

  function openCell(x: number, y: number) {
    if (gameState.value === 'idle') {
      startGame(x, y);
      return;
    }

    if (gameState.value !== 'playing' || field.value[x][y].state !== 'hidden') {
      return;
    }

    field.value[x][y].state = 'revealed';

    if (field.value[x][y].value === -1) {
      gameOver(false);
      return;
    }

    if (field.value[x][y].value === 0) {
      openNeighbors(x, y);
    }

    checkWin();
  }

  function openNeighbors(x: number, y: number) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && nx < ROWS && ny >= 0 && ny < COLS) {
        if (field.value[nx][ny].state === 'hidden') {
          field.value[nx][ny].state = 'revealed';

          if (field.value[nx][ny].value === 0) {
            openNeighbors(nx, ny);
          }
        }
      }
    }
  }

  function toggleCellMark(x: number, y: number) {
    const cell = field.value[x][y];

    if (cell.state === 'hidden') {
      cell.state = 'flagged';
      flagsCount.value++;
    } else if (cell.state === 'flagged') {
      cell.state = 'question';
      flagsCount.value--;
    } else if (cell.state === 'question') {
      cell.state = 'hidden';
    }

    checkWin(); // Проверяем победу после изменения пометки
  }

  function revealAllMines() {
    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {
        if (field.value[x][y].value === -1) {
          field.value[x][y].state = 'revealed';
        }
      }
    }
  }

  function startTimer() {
    timeElapsed.value = 0;
    timerInterval.value = setInterval(() => {
      timeElapsed.value++;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }

  function gameOver(isWin: boolean) {
    stopTimer();
    gameState.value = isWin ? 'win' : 'lose';

    if (!isWin) {
      revealAllMines();
    }
  }

  function checkWin() {
    let allNonMinesRevealed = true;
    let allMinesFlagged = true;

    for (let x = 0; x < ROWS; x++) {
      for (let y = 0; y < COLS; y++) {
        const cell = field.value[x][y];

        if (cell.value !== -1 && cell.state !== 'revealed') {
          allNonMinesRevealed = false;
        }

        if (cell.value === -1 && cell.state !== 'flagged') {
          allMinesFlagged = false;
        }
      }
    }

    if (allNonMinesRevealed || allMinesFlagged) {
      gameOver(true);
    }
  }

  function resetGame() {
    stopTimer();
    gameState.value = 'idle';
    timeElapsed.value = 0;
    flagsCount.value = 0;
    field.value = [];
    initField();
  }

  return {
    field,
    gameState,
    minesCount,
    flagsCount,
    timeElapsed,
    remainingMines,
    formattedTime,
    initField,
    generateField,
    openCell,
    toggleCellMark,
    resetGame,
    startGame
  };
});
