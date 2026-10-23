// ============================================================
// main.js — точка входа, запуск игры
//
// Здесь мы связываем всё вместе:
// - выбор сложности
// - создание игры
// - обработка кликов
// - таймер
// - рекорды в localStorage
// ============================================================

// import — импортируем нужные функции из других файлов
import { LEVELS } from './board.js';
import { Game } from './game.js';
import {
  renderBoard,
  updateCell,
  updateMineCounter,
  updateTimer,
  updateRecord,
  showModal,
  hideModal,
} from './ui.js';

// ============================================================
// Состояние приложения
// ============================================================

let currentLevel = 'easy'; // текущая сложность
let game = null;            // экземпляр игры (объект класса Game)
let timerInterval = null;   // ссылка на интервал таймера
let elapsedTime = 0;        // прошедшее время в секундах
let timerStarted = false;   // таймер запущен?

// ============================================================
// Работа с рекордами (localStorage)
//
// localStorage — хранилище браузера, данные не теряются
// после закрытия вкладки. Хранит строки в формате ключ-значение.
// ============================================================

/**
 * getRecord — читает рекорд для текущей сложности
 * @returns {number|null}
 */
function getRecord() {
  const val = localStorage.getItem(`minesweeper_record_${currentLevel}`);
  return val !== null ? parseInt(val) : null; // parseInt конвертирует строку в число
}

/**
 * saveRecord — сохраняет новый рекорд если он лучше старого
 * @param {number} time
 * @returns {boolean} — true если это новый рекорд
 */
function saveRecord(time) {
  const prev = getRecord();
  if (prev === null || time < prev) {
    localStorage.setItem(`minesweeper_record_${currentLevel}`, time);
    return true;
  }
  return false;
}

// ============================================================
// Таймер
// ============================================================

/**
 * startTimer — запускает таймер если ещё не запущен
 */
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  // setInterval — вызывает функцию каждые N миллисекунд
  timerInterval = setInterval(() => {
    elapsedTime++;
    updateTimer(elapsedTime); // обновляем цифру на экране
  }, 1000); // 1000 мс = 1 секунда
}

/**
 * stopTimer — останавливает таймер
 */
function stopTimer() {
  clearInterval(timerInterval); // отменяем интервал
  timerInterval = null;
  timerStarted = false;
}

// ============================================================
// Старт новой игры
// ============================================================

/**
 * startGame — создаёт новую игру и рисует поле
 */
function startGame() {
  // Останавливаем предыдущий таймер если был
  stopTimer();

  // Прячем модалку если была открыта
  hideModal();

  // Сбрасываем время
  elapsedTime = 0;
  updateTimer(0);

  // Читаем настройки текущей сложности
  const config = LEVELS[currentLevel];

  // Создаём объект игры (экземпляр класса Game)
  game = new Game(config);

  // Обновляем счётчик мин
  updateMineCounter(game.getRemainingMines());

  // Показываем рекорд
  updateRecord(getRecord());

  // Рисуем поле и передаём обработчики кликов
  renderBoard(game.board, handleLeftClick, handleRightClick);
}

// ============================================================
// Обработчики кликов по клеткам
// ============================================================

/**
 * handleLeftClick — что происходит при клике левой кнопкой
 * @param {number} row
 * @param {number} col
 */
function handleLeftClick(row, col) {
  if (!game || game.gameOver) return;

  // Запускаем таймер при первом клике
  startTimer();

  // Говорим игре открыть клетку, получаем результат
  const result = game.openCell(row, col);

  if (result === 'invalid') return;

  // Обновляем весь board визуально
  // (нужно перерисовать все клетки которые могли открыться рекурсией)
  refreshBoard();

  if (result === 'mine') {
    // Проигрыш
    stopTimer();
    game.revealMines(); // открываем все мины
    refreshBoard();     // перерисовываем с минами
    showModal(false, elapsedTime, getRecord());
  }

  if (result === 'win') {
    // Победа
    stopTimer();
    saveRecord(elapsedTime); // сохраняем рекорд
    updateRecord(getRecord()); // обновляем на экране
    showModal(true, elapsedTime, getRecord());
  }
}

/**
 * handleRightClick — правая кнопка мыши — флажок
 * @param {number} row
 * @param {number} col
 */
function handleRightClick(row, col) {
  if (!game || game.gameOver) return;

  // Говорим игре переключить флажок
  const result = game.toggleFlag(row, col);
  if (result === null) return;

  // Обновляем только эту клетку в DOM
  updateCell(game.board[row][col]);

  // Обновляем счётчик мин
  updateMineCounter(game.getRemainingMines());
}

// ============================================================
// Перерисовка поля
// ============================================================

/**
 * refreshBoard — перерисовывает все клетки
 * Нужно после открытия (рекурсия могла открыть много клеток)
 */
function refreshBoard() {
  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.cols; c++) {
      updateCell(game.board[r][c]);
    }
  }
}

// ============================================================
// Инициализация — навешиваем обработчики на кнопки
// ============================================================

/**
 * init — запускается один раз при загрузке страницы
 */
function init() {
  // Кнопки сложности
  const diffBtns = document.querySelectorAll('.diff-btn');

  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Убираем класс active у всех кнопок
      diffBtns.forEach(b => b.classList.remove('active'));

      // Добавляем active к нажатой
      btn.classList.add('active');

      // Запоминаем выбранную сложность
      currentLevel = btn.dataset.level;

      // Сразу стартуем новую игру с новой сложностью
      startGame();
    });
  });

  // Кнопка "Новая игра"
  document.getElementById('startBtn').addEventListener('click', startGame);

  // Кнопка в модалке "Играть снова"
  document.getElementById('modalBtn').addEventListener('click', startGame);

  // Запускаем первую игру
  startGame();
}

// Запускаем init когда DOM полностью загружен
// DOMContentLoaded — событие которое срабатывает после загрузки HTML
document.addEventListener('DOMContentLoaded', init);
