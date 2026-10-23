// ============================================================
// game.js — логика игры
//
// Здесь вся "умная" часть: открытие клеток, флажки,
// проверка победы/поражения.
// ============================================================

import { createBoard, placeMines, calcNumbers } from './board.js';

/**
 * Смещения для соседей (те же 8 направлений)
 */
const DIRS = [
  [-1, -1], [-1, 0], [-1, 1],
  [ 0, -1],           [ 0, 1],
  [ 1, -1], [ 1, 0], [ 1, 1],
];

/**
 * Game — класс, который хранит всё состояние игры.
 *
 * Класс — это как шаблон. Из него создаётся объект (экземпляр),
 * у которого есть свои данные (поля) и методы (функции).
 */
export class Game {
  /**
   * constructor вызывается при создании объекта: new Game(config)
   * @param {object} config — { rows, cols, mines }
   */
  constructor(config) {
    this.rows = config.rows;
    this.cols = config.cols;
    this.totalMines = config.mines;

    // Создаём пустое поле
    this.board = createBoard(this.rows, this.cols);

    this.minesPlaced = false; // мины ещё не расставлены (ждём первого клика)
    this.gameOver = false;    // игра закончилась?
    this.won = false;         // победил?
    this.flagCount = 0;       // сколько флажков поставлено
    this.openCount = 0;       // сколько безопасных клеток открыто
  }

  /**
   * openCell — открывает клетку по координатам (row, col)
   *
   * @param {number} row
   * @param {number} col
   * @returns {string} — результат: 'mine' | 'win' | 'continue'
   */
  openCell(row, col) {
    const cell = this.board[row][col];

    // Нельзя открыть: уже открыта, флажок стоит, или игра кончилась
    if (cell.isOpen || cell.isFlagged || this.gameOver) return 'invalid';

    // Первый клик — расставляем мины (чтоб не попасть сразу)
    if (!this.minesPlaced) {
      placeMines(this.board, this.totalMines, row, col);
      calcNumbers(this.board);
      this.minesPlaced = true;
    }

    // Попали на мину — проигрыш
    if (cell.isMine) {
      cell.isOpen = true;
      this.gameOver = true;
      return 'mine';
    }

    // Открываем клетку (и, возможно, соседей — рекурсия)
    this._floodFill(row, col);

    // Проверяем победу
    // Победа = все безопасные клетки открыты
    const safeCells = this.rows * this.cols - this.totalMines;
    if (this.openCount >= safeCells) {
      this.gameOver = true;
      this.won = true;
      return 'win';
    }

    return 'continue';
  }

  /**
   * _floodFill — рекурсивно открывает пустые клетки
   *
   * Это главная "магия" сапёра: когда открываешь пустую клетку
   * (без мин рядом), автоматически открываются все соседи.
   *
   * Рекурсия = функция вызывает саму себя для соседей.
   *
   * @param {number} row
   * @param {number} col
   */
  _floodFill(row, col) {
    const cell = this.board[row][col];

    // Базовый случай рекурсии — прекращаем если:
    if (cell.isOpen) return;      // уже открыта
    if (cell.isFlagged) return;   // стоит флажок
    if (cell.isMine) return;      // мина (не трогаем)

    // Открываем клетку
    cell.isOpen = true;
    this.openCount++;

    // Если рядом есть мины — просто показываем цифру, не идём дальше
    if (cell.adjacentMines > 0) return;

    // Если мин рядом нет — рекурсивно открываем всех соседей
    for (const [dr, dc] of DIRS) {
      const nr = row + dr;
      const nc = col + dc;

      // Проверяем границы поля
      if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
        this._floodFill(nr, nc);
      }
    }
  }

  /**
   * toggleFlag — ставит или убирает флажок на клетке
   *
   * @param {number} row
   * @param {number} col
   * @returns {boolean} — true если флажок поставлен, false если убран
   */
  toggleFlag(row, col) {
    const cell = this.board[row][col];

    // Нельзя ставить флажок на открытую клетку или если игра кончилась
    if (cell.isOpen || this.gameOver) return null;

    if (cell.isFlagged) {
      // Убираем флажок
      cell.isFlagged = false;
      this.flagCount--;
    } else {
      // Ставим флажок
      cell.isFlagged = true;
      this.flagCount++;
    }

    return cell.isFlagged;
  }

  /**
   * revealMines — открывает все мины (при проигрыше)
   * Возвращает список клеток с минами, чтобы UI их покрасил
   *
   * @returns {Array} — массив клеток с минами
   */
  revealMines() {
    const mines = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        if (this.board[r][c].isMine) {
          this.board[r][c].isOpen = true;
          mines.push(this.board[r][c]);
        }
      }
    }

    return mines;
  }

  /**
   * getRemainingMines — сколько мин ещё не помечено флажками
   * Показывается в статус-баре
   */
  getRemainingMines() {
    return this.totalMines - this.flagCount;
  }
}
