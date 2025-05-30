import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

type CellState = 'hidden' | 'revealed' | 'flagged' | 'question';
interface Cell {
  state: CellState;
  value: number | null;
}

type GameLevel = 'beginner' | 'intermediate' | 'expert';
const LEVEL_SETTINGS = {
  beginner: { rows: 8, cols: 8, mines: 10 },
  intermediate: { rows: 9, cols: 9, mines: 15 },
  expert: { rows: 10, cols: 10, mines: 20 }
};

export const useGameStore = defineStore('game', () => {
  // states
  const rows = ref(LEVEL_SETTINGS.beginner.rows);
  const cols = ref(LEVEL_SETTINGS.beginner.cols);
  const totalMines = ref(LEVEL_SETTINGS.beginner.mines);
  const currentLevel = ref<GameLevel>('beginner');

  const field = ref<Cell[][]>([]);
  const gameState = ref<'idle' | 'playing' | 'win' | 'lose'>('idle');
  const flagsCount = ref(0);
  const timeElapsed = ref(0);
  const timerInterval = ref<NodeJS.Timeout | null>(null);
  const recordTime = ref(0);

  // getters
  const remainingMines = computed(() => {
    const remaining = totalMines.value - flagsCount.value;
    return remaining >= 0 ? remaining : 0;
  });

  const formattedTime = computed(() => {
    const minutes = Math.floor(timeElapsed.value / 60);
    const seconds = timeElapsed.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  const formattedRecordTime = computed(() => {
    const minutes = Math.floor(recordTime.value / 60);
    const seconds = recordTime.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // actions

  // инициализация поля (пустой field нужных размеров)
  const initField = () => {
    field.value = Array.from({ length: rows.value }, () =>
      Array.from({ length: cols.value }, () => ({ state: 'hidden', value: null }))
    );
  };

  const generateField = () => {
    initField();

    let minesPlaced = 0;
    while (minesPlaced < totalMines.value) {
      const x = Math.floor(Math.random() * rows.value);
      const y = Math.floor(Math.random() * cols.value);

      if (field.value[x][y].value !== -1) {
        field.value[x][y].value = -1;
        minesPlaced++;
      }
    }

    field.value.forEach((row, x) =>
      row.forEach((cell, y) => {
        if (cell.value !== -1) {
          cell.value = countNeighbours(x, y, field.value);
        }
      })
    );
  };

  // подсчет мин в соседних полях
  function countNeighbours(x: number, y: number, field: Cell[][]): number {
    let count = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < rows.value && ny >= 0 && ny < cols.value) {
          if (field[nx][ny].value === -1) count++;
        }
      }
    }
    return count;
  }

  // установщик уровня
  function setLevel(level: GameLevel) {
    const settings = LEVEL_SETTINGS[level];
    rows.value = settings.rows;
    cols.value = settings.cols;
    totalMines.value = settings.mines;
    currentLevel.value = level;
    loadRecord(level);
    resetGame();
  }

  // старт игры + обработка первого клика
  const startGame = (firstClickX: number, firstClickY: number) => {
    if (gameState.value !== 'idle') return;
    resetGame();
    gameState.value = 'playing';

    do {
      generateField();
    } while (field.value[firstClickX][firstClickY].value === -1);

    startTimer();
    openCell(firstClickX, firstClickY);
  };

  const openCell = (x: number, y: number) => {
    if (gameState.value !== 'playing' || field.value[x][y].state !== 'hidden') {
      startGame(x, y);
      return;
    }

    field.value[x][y].state = 'revealed';

    if (field.value[x][y].value === -1) return gameOver(false);
    if (field.value[x][y].value === 0) openNeighbors(x, y);

    checkWin();
  };

  const handleCellPress = (x: number, y: number, isLongPress: boolean) => {
    if (isLongPress) {
      toggleCellMark(x, y); // Переключение между flagged/question/hidden
    } else {
      openCell(x, y); // Открытие клетки
    }
  };

  // открытие соседей
  const openNeighbors = (x: number, y: number) => {
    [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1]
    ].forEach(([dx, dy]) => {
      const nx = x + dx,
        ny = y + dy;
      if (
        nx >= 0 &&
        nx < rows.value &&
        ny >= 0 &&
        ny < cols.value &&
        field.value[nx][ny].state === 'hidden'
      ) {
        field.value[nx][ny].state = 'revealed';
        if (field.value[nx][ny].value === 0) openNeighbors(nx, ny);
      }
    });
  };

  // цикл flagged - question - hidden
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

    checkWin();
  }

  // открывает все мины
  function revealAllMines() {
    for (let x = 0; x < rows.value; x++) {
      for (let y = 0; y < cols.value; y++) {
        if (field.value[x][y].value === -1) {
          field.value[x][y].state = 'revealed';
        }
      }
    }
  }

  // старт таймера
  function startTimer() {
    timeElapsed.value = 0;
    timerInterval.value = setInterval(() => {
      timeElapsed.value++;
    }, 1000);
  }

  // остановка таймера
  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }

  // сохранение рекорда в LocalStorage
  function saveRecord(level: GameLevel, time: number) {
    const key = `record_${level}`;
    const currentRecord = localStorage.getItem(key);
    if (!currentRecord || time < parseInt(currentRecord, 10)) {
      localStorage.setItem(key, time.toString());
      recordTime.value = time; // Обновляем локальное состояние
    }
  }

  // загрузка рекорда из LocalStorage
  function loadRecord(level: GameLevel) {
    const key = `record_${level}`;
    const savedRecord = localStorage.getItem(key);
    recordTime.value = savedRecord ? parseInt(savedRecord, 10) : 0;
  }

  // конец игры
  function gameOver(isWin: boolean) {
    stopTimer();
    gameState.value = isWin ? 'win' : 'lose';

    if (!isWin) {
      revealAllMines();
    } else {
      saveRecord(currentLevel.value, timeElapsed.value); // Сохранение рекорда при победе
    }
  }

  // проверка на победу
  function checkWin() {
    for (let x = 0; x < rows.value; x++) {
      for (let y = 0; y < cols.value; y++) {
        const cell = field.value[x][y];
        if (
          (cell.value !== -1 && cell.state !== 'revealed') || // Все не-мины должны быть открыты
          (cell.value === -1 && cell.state === 'revealed') // Мины не должны быть открыты
        ) {
          return;
        }
      }
    }
    gameOver(true); // Победа
  }

  // ресет игры
  function resetGame() {
    stopTimer();
    gameState.value = 'idle';
    timeElapsed.value = 0;
    flagsCount.value = 0;
    field.value = [];
    generateField();
  }

  return {
    field,
    gameState,
    flagsCount,
    timeElapsed,
    recordTime,
    remainingMines,
    formattedTime,
    formattedRecordTime,
    currentLevel,
    rows,
    cols,
    totalMines,
    handleCellPress,
    initField,
    generateField,
    openCell,
    toggleCellMark,
    resetGame,
    startGame,
    setLevel
  };
});
