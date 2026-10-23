// ============================================================
// board.js — генерация игрового поля
//
// Здесь мы создаём двумерный массив (матрицу) клеток.
// Каждая клетка — это объект с несколькими свойствами.
// ============================================================

/**
 * Настройки сложности:
 * rows — строк, cols — столбцов, mines — количество мин
 */
export const LEVELS = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 },
};

/**
 * createBoard — создаёт пустую матрицу клеток
 *
 * @param {number} rows — количество строк
 * @param {number} cols — количество столбцов
 * @returns {Array} — двумерный массив объектов-клеток
 *
 * Пример одной клетки:
 * {
 *   row: 2, col: 3,    // позиция в сетке
 *   isMine: false,     // есть ли здесь мина
 *   isOpen: false,     // открыта ли клетка
 *   isFlagged: false,  // стоит ли флажок
 *   adjacentMines: 0   // сколько мин рядом
 * }
 */
export function createBoard(rows, cols) {
  // Array.from создаёт массив из rows строк
  // В каждой строке — массив из cols клеток
  return Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => ({
      row,
      col,
      isMine: false,
      isOpen: false,
      isFlagged: false,
      adjacentMines: 0,
    }))
  );
}

/**
 * placeMines — случайно расставляет мины на поле
 *
 * @param {Array} board — матрица клеток
 * @param {number} minesCount — сколько мин расставить
 * @param {number} safeRow — строка первого клика (туда мину не ставим)
 * @param {number} safeCol — столбец первого клика
 */
export function placeMines(board, minesCount, safeRow, safeCol) {
  const rows = board.length;
  const cols = board[0].length;
  let placed = 0; // счётчик расставленных мин

  // Пока не расставили все мины — продолжаем
  while (placed < minesCount) {
    // Случайная строка от 0 до rows-1
    const r = Math.floor(Math.random() * rows);
    // Случайный столбец от 0 до cols-1
    const c = Math.floor(Math.random() * cols);

    // Не ставим мину туда, куда кликнул игрок (чтоб не проиграл сразу)
    // И не ставим туда, где уже есть мина
    if ((r === safeRow && c === safeCol) || board[r][c].isMine) {
      continue; // пропускаем и пробуем снова
    }

    board[r][c].isMine = true;
    placed++;
  }
}

/**
 * calcNumbers — считает, сколько мин рядом с каждой клеткой
 * Записывает результат в adjacentMines каждой клетки
 *
 * @param {Array} board — матрица после расстановки мин
 */
export function calcNumbers(board) {
  const rows = board.length;
  const cols = board[0].length;

  // Смещения для всех 8 соседей клетки
  // (диагонали + вертикаль + горизонталь)
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],           [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];

  // Перебираем каждую клетку поля
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Мины сами себе не считают соседей
      if (board[r][c].isMine) continue;

      let count = 0;

      // Проверяем всех 8 соседей
      for (const [dr, dc] of dirs) {
        const nr = r + dr; // сосед по строке
        const nc = c + dc; // сосед по столбцу

        // Проверяем что сосед не выходит за границы поля
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].isMine) count++;
        }
      }

      board[r][c].adjacentMines = count;
    }
  }
}
