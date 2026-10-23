# 💣 Сапёр (Minesweeper)

Браузерная реализация классической игры «Сапёр» на чистом JavaScript (Vanilla JS) без использования сторонних фреймворков и библиотек.

---

## Описание проекта

**Цель проекта** — создать полноценную интерактивную браузерную игру, демонстрирующую практические навыки работы с JavaScript: DOM-манипуляции, обработку событий, рекурсивные алгоритмы, модульную архитектуру кода и работу с браузерным хранилищем.

**Суть игры:** игрок открывает клетки на минном поле. Цифры в открытых клетках показывают, сколько мин находится в непосредственном соседстве. Задача — открыть все безопасные клетки, не нажав на мину. Правой кнопкой мыши можно ставить флажки на подозрительные клетки.

---

## Функции приложения

- 🎮 Три уровня сложности: Лёгкий (9×9, 10 мин), Средний (16×16, 40 мин), Сложный (16×30, 99 мин)
- 🚩 Расстановка и снятие флажков правой кнопкой мыши
- ⏱ Таймер, стартующий только с первого клика по клетке
- 🏆 Хранение рекордов для каждого уровня сложности через `localStorage`
- 💥 Анимированное модальное окно при победе и поражении
- 🔢 Живой счётчик оставшихся (не помеченных флажками) мин
- ✅ Гарантия безопасности первого клика — мины расставляются уже после него
- 🎨 Тёмная тема, адаптивный дизайн для телефонов и планшетов
- 💫 CSS-анимации при открытии клеток и при проигрыше

---

## Структура проекта

```
minesweeper/
│
├── index.html          # HTML-разметка страницы
├── style.css           # Все стили (тёмная тема, анимации, адаптивность)
├── README.md           # Документация
│
└── js/
    ├── main.js         # Точка входа: запуск, обработка событий, таймер, рекорды
    ├── game.js         # Логика игры: класс Game, открытие клеток, флажки
    ├── board.js        # Генерация поля, расстановка мин, подсчёт соседей
    └── ui.js           # Работа с DOM: рендер поля, обновление клеток, модалка
```

Каждый файл отвечает ровно за одну задачу — это называется **принципом единственной ответственности**. Такой код легко читать, отлаживать и развивать.

---

## Установка и запуск

### Вариант 1 — Live Server в VS Code (рекомендуется)

1. Скачай и распакуй архив проекта
2. Открой папку `minesweeper/` в [Visual Studio Code](https://code.visualstudio.com/)
3. Установи расширение **Live Server** (автор: Ritwick Dey) через вкладку Extensions
4. Нажми правой кнопкой на `index.html` → **Open with Live Server**
5. Игра автоматически откроется в браузере по адресу `http://127.0.0.1:5500`

### Вариант 2 — Python HTTP-сервер

```bash
# Перейди в папку проекта
cd minesweeper

# Python 3
python -m http.server 8080

# Открой в браузере:
# http://localhost:8080
```

> ⚠️ **Важно:** просто открыть `index.html` двойным кликом **не сработает**. Браузер блокирует загрузку ES6-модулей (`import`/`export`) напрямую из файловой системы из соображений безопасности. Всегда запускай через локальный сервер.

---

## Как играть

| Действие | Результат |
|----------|-----------|
| **Левый клик** по закрытой клетке | Открыть клетку |
| **Правый клик** по закрытой клетке | Поставить флажок 🚩 |
| **Правый клик** по клетке с флажком | Убрать флажок |
| Кнопка **«Новая игра»** | Перезапустить текущую сложность |
| Кнопки **Лёгкий / Средний / Сложный** | Сменить уровень и начать заново |

---

## Разбор кода по файлам

---

### 📄 `index.html` — разметка страницы

HTML-файл описывает структуру страницы. JavaScript потом находит нужные элементы и управляет ими.

```html
<!-- Кнопки выбора сложности -->
<div class="difficulty-btns">
  <button class="diff-btn active" data-level="easy">Лёгкий</button>
  <button class="diff-btn" data-level="medium">Средний</button>
  <button class="diff-btn" data-level="hard">Сложный</button>
</div>
```

**Что такое `data-level`?**
Это пользовательский атрибут (`data-*`). В нём хранится значение сложности (`easy`, `medium`, `hard`). JS читает его так:

```javascript
btn.dataset.level  // вернёт "easy", "medium" или "hard"
```

Это удобно: не нужно смотреть на текст кнопки — достаточно прочитать атрибут.

```html
<!-- Статус-бар -->
<div class="status-bar">
  <div class="status-item">
    <span class="status-icon">💣</span>
    <span id="mineCount">0</span>   <!-- сюда JS пишет число мин -->
  </div>
  <div class="status-item">
    <span class="status-icon">⏱</span>
    <span id="timer">0</span>       <!-- сюда JS пишет секунды -->
  </div>
  <div class="status-item">
    <span class="status-icon">🏆</span>
    <span id="record">—</span>      <!-- сюда JS пишет рекорд -->
  </div>
</div>
```

У каждого `<span>` есть `id` — уникальный идентификатор. JS находит их через `document.getElementById('mineCount')` и меняет текст внутри.

```html
<!-- Игровое поле — пустой div, JS заполнит его клетками -->
<div class="board" id="board"></div>
```

```html
<!-- Модальное окно — скрыто по умолчанию (CSS: opacity: 0) -->
<div class="modal-overlay" id="modalOverlay">
  <div class="modal" id="modal">
    <div class="modal-emoji" id="modalEmoji"></div>   <!-- 🎉 или 💥 -->
    <h2 class="modal-title" id="modalTitle"></h2>     <!-- Победа! / Бум! -->
    <p class="modal-msg" id="modalMsg"></p>            <!-- детали -->
    <button class="modal-btn" id="modalBtn">Играть снова</button>
  </div>
</div>
```

```html
<!-- Подключение JS как ES6-модуля -->
<script type="module" src="js/main.js"></script>
```

`type="module"` — важный атрибут. Он говорит браузеру что это ES6-модуль, а значит в файле можно использовать `import` и `export`. Без него браузер не поймёт эти команды.

---

### 🎨 `style.css` — стили и анимации

#### CSS-переменные

```css
:root {
  --bg: #0f0f1a;         /* цвет фона страницы */
  --surface: #1a1a2e;    /* цвет панелей */
  --accent: #e94560;     /* красный акцент */
  --text: #eaeaea;       /* цвет текста */
  --cell-bg: #1e1e3a;    /* закрытая клетка */
  --cell-open: #0d0d1f;  /* открытая клетка */
  --shadow: rgba(233, 69, 96, 0.3); /* тень */
}
```

`:root` — это корневой элемент страницы (фактически `<html>`). Переменные объявленные здесь доступны везде в CSS. Чтобы использовать переменную — пишут `var(--bg)`. Это удобно: хочешь сменить цветовую схему — меняешь только в одном месте.

#### Градиентный заголовок

```css
.title {
  background: linear-gradient(135deg, #e94560, #f7b731);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

Трюк: применяем градиентный фон к тексту, потом делаем сам текст прозрачным — сквозь него виден градиент. Результат: красивый разноцветный заголовок.

#### CSS Grid для игрового поля

```css
.board {
  display: grid;       /* включаем сетку */
  gap: 3px;            /* расстояние между клетками */
}
```

Количество столбцов JS задаёт динамически через `style`:
```javascript
boardEl.style.gridTemplateColumns = `repeat(${cols}, 36px)`;
// Например: repeat(9, 36px) — 9 столбцов по 36 пикселей
```

#### Анимации

```css
/* Открытие клетки — пружинный эффект */
@keyframes pop {
  0%   { transform: scale(0.8); opacity: 0.5; }
  60%  { transform: scale(1.1); }
  100% { transform: scale(1);   opacity: 1; }
}

/* Тряска клетки при попадании на мину */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-4px); }
  75%       { transform: translateX(4px); }
}
```

`@keyframes` описывает покадровую анимацию. `transform: scale()` — масштабирование. `transform: translateX()` — сдвиг по горизонтали. Класс `.open` применяет `pop`, класс `.mine` — `shake`.

#### Цвета цифр через `data`-атрибут

```css
.cell[data-num="1"] { color: var(--c1); }  /* голубой */
.cell[data-num="2"] { color: var(--c2); }  /* зелёный */
.cell[data-num="3"] { color: var(--c3); }  /* красный */
/* ... и так до 8 */
```

CSS выбирает стиль в зависимости от значения атрибута `data-num`. JS устанавливает его: `cellEl.dataset.num = cell.adjacentMines`. Классический приём — логика в JS, оформление в CSS.

#### Модальное окно

```css
.modal-overlay {
  position: fixed;  /* прилипает к экрану, не скроллится */
  inset: 0;         /* сокращение для top:0; right:0; bottom:0; left:0 */
  opacity: 0;
  pointer-events: none;  /* невидимо и некликабельно */
  transition: opacity 0.3s ease;
}

.modal-overlay.show {
  opacity: 1;
  pointer-events: all;  /* при классе .show — видимо и активно */
}
```

JS просто добавляет или убирает класс `.show` — CSS сам плавно показывает или скрывает модалку. Это чистое разделение: JS управляет состоянием, CSS — визуалом.

---

### 📦 `board.js` — генерация поля

Этот файл отвечает только за создание данных поля. Никакого DOM здесь нет.

#### Настройки уровней

```javascript
export const LEVELS = {
  easy:   { rows: 9,  cols: 9,  mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard:   { rows: 16, cols: 30, mines: 99 },
};
```

`export` — делает объект доступным для других файлов через `import`. Значения полностью совпадают с оригинальной игрой от Microsoft.

#### `createBoard(rows, cols)` — создание пустой матрицы

```javascript
export function createBoard(rows, cols) {
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
```

**Как это работает:**

`Array.from({ length: N }, callback)` создаёт массив из N элементов, где каждый элемент — результат вызова `callback`. Здесь вызываем его дважды: внешний создаёт строки, внутренний для каждой строки создаёт столбцы.

Результат — двумерный массив (массив массивов). Чтобы добраться до клетки в строке 3, столбце 5: `board[3][5]`.

Каждая клетка — это объект с пятью полями:

| Поле | Тип | Смысл |
|------|-----|-------|
| `row` | number | Номер строки |
| `col` | number | Номер столбца |
| `isMine` | boolean | Есть ли мина |
| `isOpen` | boolean | Открыта ли клетка |
| `isFlagged` | boolean | Стоит ли флажок |
| `adjacentMines` | number | Сколько мин рядом |

#### `placeMines(board, minesCount, safeRow, safeCol)` — расстановка мин

```javascript
export function placeMines(board, minesCount, safeRow, safeCol) {
  const rows = board.length;
  const cols = board[0].length;
  let placed = 0;

  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if ((r === safeRow && c === safeCol) || board[r][c].isMine) {
      continue;
    }

    board[r][c].isMine = true;
    placed++;
  }
}
```

**Ключевые моменты:**

`Math.random()` возвращает случайное число от 0 до 1 (не включая 1). Умножаем на количество строк/столбцов и берём целую часть через `Math.floor()` — получаем случайный индекс.

**Почему мины расставляются при первом клике, а не при старте игры?**
Классический приём в сапёре — гарантия что первый клик никогда не попадёт на мину. Поэтому мы передаём координаты первого клика (`safeRow`, `safeCol`) и пропускаем эту клетку при расстановке.

`continue` в цикле `while` — пропускает текущую итерацию и переходит к следующей. Если место занято или это безопасная клетка — пробуем снова.

#### `calcNumbers(board)` — подсчёт мин рядом

```javascript
export function calcNumbers(board) {
  const dirs = [
    [-1, -1], [-1, 0], [-1, 1],
    [ 0, -1],          [ 0, 1],
    [ 1, -1], [ 1, 0], [ 1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          if (board[nr][nc].isMine) count++;
        }
      }

      board[r][c].adjacentMines = count;
    }
  }
}
```

**Как работает алгоритм:**

`dirs` — массив из 8 пар смещений, по одной паре для каждого соседа. Например, `[-1, -1]` — это клетка левее и выше; `[0, 1]` — клетка правее.

Для каждой клетки (кроме мин) мы перебираем все 8 направлений, добавляем смещение к координатам и проверяем, есть ли там мина. Главное — проверка границ: `nr >= 0 && nr < rows && nc >= 0 && nc < cols`. Без неё для клетки на краю поля программа обратилась бы к несуществующему индексу и упала бы с ошибкой.

`for (const [dr, dc] of dirs)` — деструктуризация. Вместо `dirs[i][0]` и `dirs[i][1]` сразу получаем `dr` (delta row) и `dc` (delta col). Так читается намного чище.

---

### 🧠 `game.js` — логика игры

Самый важный файл. Здесь живёт класс `Game` — "мозг" всей игры.

#### Что такое класс?

```javascript
export class Game {
  constructor(config) {
    this.rows = config.rows;
    this.cols = config.cols;
    this.totalMines = config.mines;
    this.board = createBoard(this.rows, this.cols);
    this.minesPlaced = false;
    this.gameOver = false;
    this.won = false;
    this.flagCount = 0;
    this.openCount = 0;
  }
  // ...методы...
}
```

Класс — это шаблон для создания объекта. `constructor` вызывается автоматически при `new Game(config)`. `this` — это ссылка на создаваемый объект. Так `this.rows` — это поле объекта, которое будет доступно во всех методах класса.

При старте игры в `main.js` пишут:
```javascript
game = new Game({ rows: 9, cols: 9, mines: 10 });
```
После этого `game.rows === 9`, `game.board` — готовая пустая матрица, и так далее.

#### `openCell(row, col)` — открытие клетки

```javascript
openCell(row, col) {
  const cell = this.board[row][col];

  if (cell.isOpen || cell.isFlagged || this.gameOver) return 'invalid';

  if (!this.minesPlaced) {
    placeMines(this.board, this.totalMines, row, col);
    calcNumbers(this.board);
    this.minesPlaced = true;
  }

  if (cell.isMine) {
    cell.isOpen = true;
    this.gameOver = true;
    return 'mine';
  }

  this._floodFill(row, col);

  const safeCells = this.rows * this.cols - this.totalMines;
  if (this.openCount >= safeCells) {
    this.gameOver = true;
    this.won = true;
    return 'win';
  }

  return 'continue';
}
```

**Пошаговая логика:**

1. Берём объект клетки из матрицы по координатам
2. Проверяем — можно ли вообще её открывать (не открыта ли уже, нет ли флажка, не закончилась ли игра). Если нельзя — возвращаем `'invalid'`
3. Если это первый клик (`!this.minesPlaced`) — расставляем мины, считаем числа. Теперь поле готово
4. Если под клеткой мина — открываем её, ставим `gameOver = true`, возвращаем `'mine'`
5. Иначе — запускаем `_floodFill` для открытия клетки (и возможно соседей)
6. Проверяем победу: `openCount` (открытых безопасных клеток) должен сравняться с `safeCells` (всего клеток минус мины)
7. Возвращаем строку-результат: `'mine'`, `'win'` или `'continue'`

Метод возвращает строку — это удобно. `main.js` получает её и решает что делать дальше (показать модалку, остановить таймер и т.д.)

#### `_floodFill(row, col)` — рекурсивное открытие клеток

```javascript
_floodFill(row, col) {
  const cell = this.board[row][col];

  if (cell.isOpen) return;
  if (cell.isFlagged) return;
  if (cell.isMine) return;

  cell.isOpen = true;
  this.openCount++;

  if (cell.adjacentMines > 0) return;

  for (const [dr, dc] of DIRS) {
    const nr = row + dr;
    const nc = col + dc;

    if (nr >= 0 && nr < this.rows && nc >= 0 && nc < this.cols) {
      this._floodFill(nr, nc);
    }
  }
}
```

**Это рекурсивная функция — она вызывает саму себя.**

Именно так работает "волновое" открытие в сапёре: кликаешь на пустую клетку — автоматически открывается большой участок поля. Алгоритм называется **Flood Fill** (заливка), тот же используется в инструменте "заливка" в Paint.

**Как это работает шаг за шагом:**

1. Открываем текущую клетку, увеличиваем счётчик открытых
2. Если рядом есть мины (`adjacentMines > 0`) — останавливаемся: показываем цифру, дальше не идём
3. Если мин рядом нет — для каждого из 8 соседей вызываем себя же
4. Те тоже открываются и проверяют своих соседей
5. Волна распространяется пока не встретит клетки с цифрами — они образуют "бордюр"

**Базовый случай рекурсии** — условия `return` в начале. Без них функция бы вызывала себя бесконечно и браузер завис бы. Именно эти проверки останавливают рекурсию:
- `cell.isOpen` — уже открыта, значит мы здесь уже были
- `cell.isFlagged` — помечена флажком, не трогаем
- `cell.isMine` — мина, не трогаем

Подчёркивание в начале имени `_floodFill` — соглашение. Означает что метод "приватный": предназначен только для внутреннего использования внутри класса, снаружи его вызывать не нужно.

#### `toggleFlag(row, col)` — флажок

```javascript
toggleFlag(row, col) {
  const cell = this.board[row][col];

  if (cell.isOpen || this.gameOver) return null;

  if (cell.isFlagged) {
    cell.isFlagged = false;
    this.flagCount--;
  } else {
    cell.isFlagged = true;
    this.flagCount++;
  }

  return cell.isFlagged;
}
```

Простой переключатель. Если флажок есть — убираем и уменьшаем счётчик. Если нет — ставим и увеличиваем. Возвращаем новое состояние флажка (`true`/`false`) или `null` если действие невозможно.

#### `revealMines()` — показать все мины при проигрыше

```javascript
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
```

Двойной цикл проходит по всей матрице. Если клетка — мина, открывает её (устанавливает `isOpen = true`) и добавляет в массив `mines`. После вызова этого метода `main.js` перерисовывает поле — и все мины становятся видны.

#### `getRemainingMines()` — оставшиеся мины

```javascript
getRemainingMines() {
  return this.totalMines - this.flagCount;
}
```

Простое вычисление: общее число мин минус количество поставленных флажков. Показывается в статус-баре. Может быть отрицательным — если флажков больше чем мин. Это нормально: в оригинальном сапёре так же.

---

### 🖥 `ui.js` — работа с DOM

Этот файл — связующее звено между данными (объекты клеток) и тем, что видит пользователь (HTML-элементы).

#### `renderBoard(board, onLeftClick, onRightClick)` — рисуем поле

```javascript
export function renderBoard(board, onLeftClick, onRightClick) {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';

  const rows = board.length;
  const cols = board[0].length;

  boardEl.style.gridTemplateColumns = `repeat(${cols}, 36px)`;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell');
      cellEl.dataset.row = r;
      cellEl.dataset.col = c;

      cellEl.addEventListener('click', () => onLeftClick(r, c));
      cellEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        onRightClick(r, c);
      });

      boardEl.appendChild(cellEl);
    }
  }
}
```

**Разбор по шагам:**

`document.getElementById('board')` — находим элемент с id="board" в HTML. Это главный контейнер поля.

`boardEl.innerHTML = ''` — очищаем его содержимое. Важно при перезапуске игры: иначе старое поле останется под новым.

`` boardEl.style.gridTemplateColumns = `repeat(${cols}, 36px)` `` — устанавливаем количество столбцов CSS Grid. Шаблонная строка (backtick + `${}`): вставляет значение переменной прямо в строку. Для 9 столбцов получится `"repeat(9, 36px)"`.

`document.createElement('div')` — создаёт новый `<div>` элемент. Он существует в памяти, но ещё не на странице.

`cellEl.classList.add('cell')` — добавляет CSS-класс. Теперь к этому элементу применятся все стили из `.cell {}` в CSS.

`cellEl.dataset.row = r` — записывает координату в `data-row` атрибут. Это нужно для `updateCell`: по координатам находим нужный div.

`cellEl.addEventListener('click', () => onLeftClick(r, c))` — вешаем обработчик события. `() => onLeftClick(r, c)` — стрелочная функция. Когда пользователь кликает — она вызовет `onLeftClick` с координатами этой клетки. Координаты "запоминаются" благодаря **замыканию**: функция сохраняет значения `r` и `c` на момент создания.

`e.preventDefault()` — отменяет стандартное поведение. Для `contextmenu` (правая кнопка) — отменяет появление контекстного меню браузера.

`boardEl.appendChild(cellEl)` — добавляет созданный элемент в DOM. Только после этого пользователь его видит.

#### `updateCell(cell)` — обновление одной клетки

```javascript
export function updateCell(cell) {
  const cellEl = document.querySelector(
    `[data-row="${cell.row}"][data-col="${cell.col}"]`
  );
  if (!cellEl) return;

  cellEl.textContent = '';
  cellEl.className = 'cell';

  if (cell.isFlagged) {
    cellEl.textContent = '🚩';
    cellEl.classList.add('flagged');
    return;
  }

  if (!cell.isOpen) return;

  cellEl.classList.add('open');

  if (cell.isMine) {
    cellEl.textContent = '💣';
    cellEl.classList.add('mine');
    return;
  }

  if (cell.adjacentMines > 0) {
    cellEl.textContent = cell.adjacentMines;
    cellEl.dataset.num = cell.adjacentMines;
  }
}
```

`document.querySelector('[data-row="2"][data-col="3"]')` — CSS-селектор по атрибутам. Находит элемент у которого одновременно `data-row="2"` и `data-col="3"`. Более гибкий чем `getElementById`, но чуть медленнее.

`cellEl.className = 'cell'` — сбрасывает все классы и оставляет только базовый. Это нужно, например, когда убираем флажок: сначала был класс `flagged`, его нужно убрать.

`cellEl.textContent = ''` — очищает текст внутри элемента.

Дальше идёт цепочка `if` по приоритету: сначала флажок, потом закрытая клетка, потом мина, потом цифра, потом пустота. Каждое состояние добавляет нужный класс и/или текст.

#### `showModal(won, time, record)` — показ модалки

```javascript
export function showModal(won, time, record) {
  const overlay = document.getElementById('modalOverlay');
  const emoji   = document.getElementById('modalEmoji');
  const title   = document.getElementById('modalTitle');
  const msg     = document.getElementById('modalMsg');

  if (won) {
    emoji.textContent = '🎉';
    title.textContent = 'Победа!';
    const isRecord = record === null || time < record;
    msg.textContent = isRecord
      ? `Новый рекорд: ${time} секунд! 🏆`
      : `Время: ${time} секунд. Рекорд: ${record}с`;
  } else {
    emoji.textContent = '💥';
    title.textContent = 'Бум!';
    msg.textContent = 'Попал на мину. Попробуй ещё раз!';
  }

  overlay.classList.add('show');
}
```

Заполняем элементы модалки нужным текстом в зависимости от победы или поражения. Тернарный оператор `condition ? a : b` — краткая форма `if/else`: если условие истинно — возвращает `a`, иначе `b`.

`overlay.classList.add('show')` — добавляет класс, CSS делает модалку видимой через `opacity: 1`. Плавный переход задан через `transition: opacity 0.3s ease`.

---

### ⚙️ `main.js` — точка входа

Связывает все модули воедино. Здесь обработчики кнопок, таймер, localStorage.

#### localStorage — хранение рекордов

```javascript
function getRecord() {
  const val = localStorage.getItem(`minesweeper_record_${currentLevel}`);
  return val !== null ? parseInt(val) : null;
}

function saveRecord(time) {
  const prev = getRecord();
  if (prev === null || time < prev) {
    localStorage.setItem(`minesweeper_record_${currentLevel}`, time);
    return true;
  }
  return false;
}
```

`localStorage` — хранилище браузера в виде пар "ключ-значение". Данные сохраняются даже после закрытия вкладки и браузера. Хранит только строки, поэтому при чтении `parseInt()` конвертирует строку обратно в число.

Ключи сделаны уникальными для каждой сложности: `minesweeper_record_easy`, `minesweeper_record_medium`, `minesweeper_record_hard`. Так рекорды не мешают друг другу.

Шаблонная строка: `` `minesweeper_record_${currentLevel}` `` — вставляет значение `currentLevel` прямо в строку.

#### Таймер

```javascript
function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timerInterval = setInterval(() => {
    elapsedTime++;
    updateTimer(elapsedTime);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerStarted = false;
}
```

`setInterval(callback, ms)` — вызывает функцию каждые `ms` миллисекунд. 1000 мс = 1 секунда. Возвращает ID интервала — сохраняем в `timerInterval`.

`clearInterval(id)` — останавливает интервал по его ID. Важно сохранять ID, иначе не сможем остановить таймер.

Проверка `if (timerStarted) return` защищает от двойного запуска: если кликнуть дважды быстро, таймер не ускорится.

#### `startGame()` — новая игра

```javascript
function startGame() {
  stopTimer();
  hideModal();

  elapsedTime = 0;
  updateTimer(0);

  const config = LEVELS[currentLevel];
  game = new Game(config);

  updateMineCounter(game.getRemainingMines());
  updateRecord(getRecord());
  renderBoard(game.board, handleLeftClick, handleRightClick);
}
```

Сбрасывает всё до начального состояния и создаёт новый объект игры. `LEVELS[currentLevel]` — обращение к объекту по переменному ключу. Если `currentLevel === 'easy'`, то `LEVELS['easy']` вернёт `{ rows: 9, cols: 9, mines: 10 }`.

#### `handleLeftClick(row, col)` — обработка клика

```javascript
function handleLeftClick(row, col) {
  if (!game || game.gameOver) return;

  startTimer();

  const result = game.openCell(row, col);

  if (result === 'invalid') return;

  refreshBoard();

  if (result === 'mine') {
    stopTimer();
    game.revealMines();
    refreshBoard();
    showModal(false, elapsedTime, getRecord());
  }

  if (result === 'win') {
    stopTimer();
    saveRecord(elapsedTime);
    updateRecord(getRecord());
    showModal(true, elapsedTime, getRecord());
  }
}
```

Вызывает `game.openCell()`, получает строку-результат и реагирует на неё. `refreshBoard()` перерисовывает всё поле — нужно потому что `_floodFill` мог открыть много клеток за один клик.

#### `refreshBoard()` — перерисовка всего поля

```javascript
function refreshBoard() {
  for (let r = 0; r < game.rows; r++) {
    for (let c = 0; c < game.cols; c++) {
      updateCell(game.board[r][c]);
    }
  }
}
```

Двойной цикл по всей матрице, для каждой клетки вызывает `updateCell`. Не самый оптимальный способ (можно обновлять только изменившиеся клетки), но для игры этого размера разница незаметна.

#### `init()` — инициализация при загрузке

```javascript
function init() {
  const diffBtns = document.querySelectorAll('.diff-btn');

  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLevel = btn.dataset.level;
      startGame();
    });
  });

  document.getElementById('startBtn').addEventListener('click', startGame);
  document.getElementById('modalBtn').addEventListener('click', startGame);

  startGame();
}

document.addEventListener('DOMContentLoaded', init);
```

`document.querySelectorAll('.diff-btn')` — находит все элементы с классом `diff-btn` (NodeList, похож на массив).

`diffBtns.forEach(btn => ...)` — перебирает каждую кнопку и вешает обработчик. При клике сначала убирает `active` у всех, потом добавляет только нажатой.

`DOMContentLoaded` — событие браузера: срабатывает когда HTML полностью загружен и разобран. Только после этого можно безопасно работать с DOM. Если вызвать `init()` раньше — элементы ещё не существуют и `getElementById` вернёт `null`.

---

## Ключевые концепции JavaScript использованные в проекте

| Концепция | Где используется | Зачем |
|-----------|-----------------|-------|
| **ES6 модули** (`import`/`export`) | Все файлы | Разделение кода на независимые части |
| **Классы** (`class`, `constructor`, `this`) | `game.js` | Хранение состояния игры в одном месте |
| **Рекурсия** | `_floodFill` в `game.js` | Волновое открытие пустых клеток |
| **Стрелочные функции** (`=>`) | Везде | Компактный синтаксис функций |
| **Деструктуризация** (`[dr, dc]`) | `board.js`, `game.js` | Читаемое обращение к элементам массива |
| **Шаблонные строки** (`` ` ``) | `ui.js`, `main.js` | Вставка переменных в строки |
| **`Array.from`** | `board.js` | Создание массива по шаблону |
| **`localStorage`** | `main.js` | Хранение рекордов между сессиями |
| **`setInterval`/`clearInterval`** | `main.js` | Таймер |
| **CSS-переменные** | `style.css` | Единая цветовая схема |
| **`classList`** | `ui.js`, `main.js` | Управление CSS-классами |
| **`data-*` атрибуты** | `index.html`, `ui.js` | Хранение данных прямо в HTML-элементах |
| **`addEventListener`** | `main.js`, `ui.js` | Реакция на действия пользователя |
| **Замыкания** | Обработчики в `renderBoard` | Сохранение координат клетки |

---

## Использованные источники

1. [MDN Web Docs — Document Object Model (DOM)](https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model)
2. [MDN Web Docs — ES6 Modules](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules)
3. [MDN Web Docs — localStorage](https://developer.mozilla.org/ru/docs/Web/API/Window/localStorage)
4. [MDN Web Docs — CSS Grid Layout](https://developer.mozilla.org/ru/docs/Web/CSS/CSS_grid_layout)
5. [MDN Web Docs — Array.from()](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/from)
6. [MDN Web Docs — setInterval()](https://developer.mozilla.org/ru/docs/Web/API/setInterval)
7. [MDN Web Docs — CSS @keyframes](https://developer.mozilla.org/ru/docs/Web/CSS/@keyframes)
8. [Minesweeper (Wikipedia)](https://en.wikipedia.org/wiki/Minesweeper_(video_game)) — правила и история игры
9. [Flood Fill Algorithm](https://en.wikipedia.org/wiki/Flood_fill) — алгоритм волновой заливки
