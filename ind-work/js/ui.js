// ============================================================
// ui.js — всё что связано с DOM и интерфейсом
//
// DOM (Document Object Model) — это представление HTML-страницы
// в виде объектов. JS может их читать и менять.
// ============================================================

/**
 * renderBoard — строит HTML-сетку из массива board
 *
 * @param {Array} board — двумерный массив клеток из game.js
 * @param {Function} onLeftClick — что делать при левом клике
 * @param {Function} onRightClick — что делать при правом клике
 */
export function renderBoard(board, onLeftClick, onRightClick) {
  // Находим элемент с id="board" в HTML
  const boardEl = document.getElementById('board');

  // Очищаем поле (на случай новой игры)
  boardEl.innerHTML = '';

  const rows = board.length;
  const cols = board[0].length;

  // Устанавливаем CSS Grid: столько столбцов сколько cols
  boardEl.style.gridTemplateColumns = `repeat(${cols}, 36px)`;

  // Перебираем все строки и столбцы
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Создаём div-элемент для каждой клетки
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');

      // Сохраняем координаты в data-атрибутах
      // (потом при клике достанем обратно)
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;

      // Левый клик — открыть клетку
      cellEl.addEventListener('click', () => onLeftClick(r, c));

      // Правый клик — поставить флажок
      // contextmenu — это событие правой кнопки мыши
      cellEl.addEventListener('contextmenu', (e) => {
        e.preventDefault(); // отключаем стандартное меню браузера
        onRightClick(r, c);
      });

      boardEl.appendChild(cellEl); // добавляем в DOM
    }
  }
}

/**
 * updateCell — обновляет внешний вид одной клетки в DOM
 *
 * @param {object} cell — объект клетки из board
 */
export function updateCell(cell) {
  // Находим нужный div по data-атрибутам
  const cellEl = document.querySelector(
    `[data-row="${cell.row}"][data-col="${cell.col}"]`
  );
  if (!cellEl) return;

  // Сбрасываем содержимое
  cellEl.textContent = '';
  cellEl.className = 'cell'; // убираем все классы кроме базового

  if (cell.isFlagged) {
    // Флажок — показываем эмодзи
    cellEl.textContent = '🚩';
    cellEl.classList.add('flagged');
    return;
  }

  if (!cell.isOpen) return; // закрытая клетка — ничего не меняем

  // Клетка открыта
  cellEl.classList.add('open');

  if (cell.isMine) {
    // Мина
    cellEl.textContent = '💣';
    cellEl.classList.add('mine');
    return;
  }

  if (cell.adjacentMines > 0) {
    // Цифра — сколько мин рядом
    cellEl.textContent = cell.adjacentMines;
    // data-num используется в CSS для цвета цифры
    cellEl.dataset.num = cell.adjacentMines;
  }
  // Если 0 — клетка пустая, ничего не пишем
}

/**
 * updateMineCounter — обновляет счётчик оставшихся мин
 * @param {number} count
 */
export function updateMineCounter(count) {
  document.getElementById('mineCount').textContent = count;
}

/**
 * updateTimer — обновляет таймер на экране
 * @param {number} seconds
 */
export function updateTimer(seconds) {
  document.getElementById('timer').textContent = seconds;
}

/**
 * updateRecord — показывает рекорд
 * @param {number|null} record — время в секундах или null
 */
export function updateRecord(record) {
  const el = document.getElementById('record');
  el.textContent = record !== null ? `${record}с` : '—';
}

/**
 * showModal — показывает модальное окно победы/поражения
 *
 * @param {boolean} won — победил или проиграл
 * @param {number} time — время игры в секундах
 * @param {number|null} record — предыдущий рекорд
 */
export function showModal(won, time, record) {
  const overlay = document.getElementById('modalOverlay');
  const emoji   = document.getElementById('modalEmoji');
  const title   = document.getElementById('modalTitle');
  const msg     = document.getElementById('modalMsg');

  if (won) {
    emoji.textContent = '🎉';
    title.textContent = 'Победа!';

    // Проверяем новый рекорд
    const isRecord = record === null || time < record;
    msg.textContent = isRecord
      ? `Новый рекорд: ${time} секунд! 🏆`
      : `Время: ${time} секунд. Рекорд: ${record}с`;
  } else {
    emoji.textContent = '💥';
    title.textContent = 'Бум!';
    msg.textContent = 'Попал на мину. Попробуй ещё раз!';
  }

  // Добавляем класс .show — CSS делает модалку видимой (opacity: 1)
  overlay.classList.add('show');
}

/**
 * hideModal — скрывает модальное окно
 */
export function hideModal() {
  document.getElementById('modalOverlay').classList.remove('show');
}
