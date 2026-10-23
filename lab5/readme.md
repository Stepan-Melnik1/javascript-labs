# 💰 Лабораторная работа №5 — Учёт личных финансов

**Дисциплина:** Веб-технологии / JavaScript  
**Тема:** Работа с DOM-деревом и событиями в JavaScript  
**Вариант:** 1  

---

## Содержание

1. [Описание лабораторной работы](#-описание-лабораторной-работы)
2. [Инструкции по запуску проекта](#-инструкции-по-запуску-проекта)
3. [Структура проекта](#-структура-проекта)
4. [Документация модулей](#-документация-модулей)
5. [Примеры использования и фрагменты кода](#-примеры-использования-и-фрагменты-кода)
6. [Ответы на контрольные вопросы](#-ответы-на-контрольные-вопросы)
7. [Список использованных источников](#-список-использованных-источников)
8. [Дополнительные аспекты](#-дополнительные-аспекты)

---

## 📋 Описание лабораторной работы

### Цель

Ознакомить студентов с основами взаимодействия JavaScript с DOM-деревом путём разработки полноценного веб-приложения для учёта личных финансов. В ходе работы студенты осваивают создание интерактивных интерфейсов, обработку пользовательских событий, динамическое управление HTML-элементами и организацию кода по модульному принципу.

### Задачи

| # | Шаг | Задача |
|---|-----|--------|
| 1 | Настройка проекта | Организация файловой структуры, подключение ES-модулей |
| 2 | Модель данных | Проектирование объекта транзакции с нужными полями |
| 3 | Отображение | Рендеринг транзакций в HTML-таблице |
| 4 | Добавление | Форма добавления с цветовой индикацией строк |
| 5 | Удаление | Кнопка удаления, делегирование событий на `<table>` |
| 6 | Подсчёт | Функция `calculateTotal()`, отображение суммы |
| 7 | Детали | Панель полного описания при клике на строку |
| 8 | Валидация | Проверка полей формы с выводом ошибок |

### Применяемые технологии

| Технология | Применение |
|------------|-----------|
| HTML5 | Семантическая разметка, `<form>`, `<table>`, `<select>` |
| CSS3 | CSS-переменные, Grid, Flexbox, анимации, медиазапросы |
| JavaScript ES2015+ | ES-модули, стрелочные функции, `spread`, `Array` методы |
| JSDoc 3 | Документирование функций, типов и модулей |

---

## 🚀 Инструкции по запуску проекта

### Системные требования

Любой современный браузер с поддержкой ES-модулей:

| Браузер | Минимальная версия |
|---------|--------------------|
| Google Chrome | 61+ |
| Mozilla Firefox | 60+ |
| Safari | 10.1+ |
| Microsoft Edge | 16+ |

> ⚠️ **Важно:** Файлы с `type="module"` нельзя открывать напрямую через `file://` — браузер заблокирует загрузку модулей из соображений политики CORS. Необходим локальный HTTP-сервер.

---

### Способ 1 — VS Code + Live Server ✅ (рекомендуется)

**Шаг 1.** Установите расширение [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):
- Откройте VS Code → `Ctrl+Shift+X` → найдите **Live Server** → **Install**

**Шаг 2.** Откройте папку проекта:
```
File → Open Folder → выберите папку finance-tracker
```

**Шаг 3.** Запустите сервер:
- Нажмите кнопку **Go Live** в правом нижнем углу
- Или нажмите `Alt+L`, затем `Alt+O`

**Шаг 4.** Браузер автоматически откроет: `http://127.0.0.1:5500`

---

### Способ 2 — Python (встроенный HTTP-сервер)

```bash
# Перейдите в папку проекта
cd finance-tracker

# Python 3
python -m http.server 8080

# Python 2 (устаревший)
python -m SimpleHTTPServer 8080
```

Откройте: `http://localhost:8080` — для остановки нажмите `Ctrl+C`.

---

### Способ 3 — Node.js / npx

```bash
cd finance-tracker

# Через npx (установка не требуется)
npx serve .
```

Откройте: `http://localhost:3000`

---

### Возможные проблемы

| Проблема | Причина | Решение |
|----------|---------|---------|
| Страница пустая, ошибка CORS в консоли | Открыт через `file://` | Использовать HTTP-сервер |
| Таблица не рендерится | Старый браузер | Обновить браузер |
| Стили не применились | Неверный путь к `style.css` | Проверить, что `style.css` лежит рядом с `index.html` |
| Ошибка `Cannot find module` | Неверный путь в `import` | Проверить пути в `src/index.js` |

---

## 📁 Структура проекта

```
finance-tracker/
│
├── index.html              # Главная страница приложения
├── style.css               # Все стили
│
└── src/
    ├── index.js            # Точка входа: инициализация и события
    ├── transactions.js     # Модуль данных: CRUD транзакций
    ├── ui.js               # Модуль представления: DOM-манипуляции
    └── utils.js            # Вспомогательные чистые функции
```

### Назначение файлов

#### `index.html`
Единственная HTML-страница (SPA-подход). Содержит шапку с логотипом и итоговой суммой, форму добавления транзакции, таблицу транзакций с заглушкой, панель деталей выбранной транзакции.

#### `style.css`
Все стили приложения: CSS-переменные (цвета, шрифты), стили шапки и карточек, стили формы с полями ошибок, цветовые классы `.positive`/`.negative` для строк таблицы, медиазапросы.

#### `src/index.js`
Точка входа. Не содержит бизнес-логики — соединяет модули: слушает `DOMContentLoaded`, инициализирует обработчики форм и таблицы, управляет состоянием выбранной строки `selectedId`.

#### `src/transactions.js`
Хранит и управляет данными. Не знает ничего про DOM. Содержит приватный массив транзакций и экспортирует функции для работы с ним.

#### `src/ui.js`
Отвечает только за отрисовку DOM. Не хранит данные. Создаёт строки таблицы, обновляет итог, рендерит панель деталей, управляет классами выделения.

#### `src/utils.js`
Чистые функции без побочных эффектов: генерация ID, форматирование дат и сумм, обрезка текста.

---

## 📚 Документация модулей

### Модуль `utils.js`

---

#### `generateId(): string`

Генерирует уникальный идентификатор на основе Unix-времени и случайного суффикса.

**Возвращает:** `string` — строка вида `txn_<timestamp>_<random>`

```js
/**
 * Генерирует уникальный идентификатор на основе текущего времени и случайного числа.
 * @returns {string} Уникальный ID вида "txn_<timestamp>_<random>".
 */
export function generateId() {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
```

**Пример вывода:**
```
"txn_1716823412000_k9f2a"
"txn_1716823415321_x3mq7"
```

---

#### `formatDate(date: Date): string`

Форматирует объект `Date` в читаемую строку для таблицы.

**Параметры:** `date` (`Date`) — дата и время транзакции  
**Возвращает:** `string` — формат `ДД.ММ.ГГГГ ЧЧ:ММ`

```js
/**
 * Форматирует объект Date в строку вида "ДД.ММ.ГГГГ ЧЧ:ММ".
 * @param {Date} date - Объект даты для форматирования.
 * @returns {string} Отформатированная строка даты и времени.
 */
export function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} `
       + `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
```

**Примеры:**
```
formatDate(new Date('2025-05-14T13:47:00')) // "14.05.2025 13:47"
formatDate(new Date('2025-01-01T09:05:00')) // "01.01.2025 09:05"
```

---

#### `truncateWords(text: string, wordCount?: number): string`

Обрезает строку до первых N слов. Используется для краткого описания в колонке таблицы.

**Параметры:**
- `text` (`string`) — исходная строка
- `wordCount` (`number`, по умолчанию `4`) — максимальное количество слов

**Возвращает:** `string` — обрезанная строка с `…` или оригинал

```js
/**
 * Возвращает первые N слов из строки.
 * @param {string} text - Исходная строка.
 * @param {number} [wordCount=4] - Количество слов для извлечения.
 * @returns {string} Краткое описание из первых N слов.
 */
export function truncateWords(text, wordCount = 4) {
  const words = text.trim().split(/\s+/);
  if (words.length <= wordCount) return text;
  return words.slice(0, wordCount).join(' ') + '…';
}
```

**Примеры:**
```
truncateWords("Оплата за аренду квартиры в мае") // "Оплата за аренду квартиры…"
truncateWords("Кофе в кофейне")                  // "Кофе в кофейне"
```

---

#### `formatAmount(amount: number): string`

Форматирует число с символом рубля, разрядными пробелами и знаком.

**Параметры:** `amount` (`number`) — сумма транзакции  
**Возвращает:** `string` — строка вида `+1 500.00 ₽` или `-300.00 ₽`

```js
/**
 * Форматирует число как строку с символом валюты.
 * @param {number} amount - Сумма транзакции.
 * @returns {string} Форматированная строка, например "+1 200.00 ₽".
 */
export function formatAmount(amount) {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })} ₽`;
}
```

**Примеры:**
```
formatAmount(1500)    // "+1 500.00 ₽"
formatAmount(-300)    // "-300.00 ₽"
formatAmount(12345.6) // "+12 345.60 ₽"
```

---

### Модуль `transactions.js`

Реализует слой данных. Не имеет зависимостей на DOM.

#### Тип `Transaction`

```js
/**
 * @typedef {Object} Transaction
 * @property {string} id          - Уникальный идентификатор транзакции.
 * @property {Date}   date        - Дата и время создания.
 * @property {number} amount      - Сумма (отрицательная — расход).
 * @property {string} category    - Категория транзакции.
 * @property {string} description - Полное описание транзакции.
 */
```

#### Таблица функций

| Функция | Параметры | Возвращает | Описание |
|---------|-----------|------------|----------|
| `addTransaction(t)` | `Transaction` | `void` | Добавляет объект в массив |
| `removeTransaction(id)` | `string` | `boolean` | Удаляет по ID через `splice` |
| `getTransactionById(id)` | `string` | `Transaction \| undefined` | Находит через `find` |
| `calculateTotal()` | — | `number` | Суммирует через `reduce` |
| `getAllTransactions()` | — | `Transaction[]` | Возвращает копию через `spread` |

---

### Модуль `ui.js`

Отвечает только за отрисовку. Не хранит состояние приложения.

| Функция | Описание |
|---------|----------|
| `renderTransactionRow(transaction)` | Создаёт `<tr>` и вставляет в `<tbody>`, применяет цветовой класс |
| `removeTransactionRow(id)` | Удаляет строку по `data-id`, показывает заглушку если пусто |
| `renderTotal(total)` | Обновляет текст и цвет элемента итоговой суммы |
| `renderTransactionDetail(transaction \| null)` | Заполняет панель деталей или показывает заглушку |
| `highlightRow(id \| null)` | Переключает класс `selected` на нужной строке |

---

### Модуль `index.js` — схема потока событий

```
DOMContentLoaded
    ├─→ initForm()          — вешает submit на <form>
    ├─→ initTableEvents()   — вешает click на <table>
    ├─→ updateTotal()       — рендерит начальный итог (0.00 ₽)
    └─→ showEmptyState()    — показывает заглушку если таблица пуста

<form> submit
    └─→ handleFormSubmit(event)
            ├─→ validateForm()
            │       ├─→ [ошибки] showError() — подсвечивает поля
            │       └─→ [ОК] → создаётся объект Transaction
            ├─→ addTransaction(transaction)
            ├─→ renderTransactionRow(transaction)
            ├─→ updateTotal()
            └─→ form.reset() + clearErrors()

<table> click  [делегирование событий]
    ├─→ .btn-delete
    │       └─→ handleDelete(id)
    │               ├─→ removeTransaction(id)
    │               ├─→ removeTransactionRow(id)
    │               ├─→ updateTotal()
    │               └─→ [если удалён выбранный] renderTransactionDetail(null)
    │
    └─→ tr[data-id]
            └─→ handleRowClick(id)
                    ├─→ [повторный клик] selectedId = null → сброс панели
                    └─→ [новый клик] selectedId = id
                            ├─→ getTransactionById(id)
                            ├─→ renderTransactionDetail(transaction)
                            └─→ highlightRow(id)
```

---

## 💡 Примеры использования и фрагменты кода

### Пример 1 — Создание объекта транзакции

```js
const transaction = {
  id: generateId(),                           // "txn_1716823412000_k9f2a"
  date: new Date(),                           // текущий момент
  amount: parseFloat(amountInput.value),      // -450 или 1200
  category: categoryInput.value,              // "Еда"
  description: descriptionInput.value.trim(), // "Обед в кафе у университета"
};

addTransaction(transaction);
renderTransactionRow(transaction);
updateTotal();
```

---

### Пример 2 — Цветовая индикация строк

```js
// В renderTransactionRow:
tr.classList.add(transaction.amount >= 0 ? 'positive' : 'negative');
```

```css
tbody tr.positive td { color: var(--green); }  /* #39d98a */
tbody tr.negative td { color: var(--red); }    /* #ff5c5c */
```

Доходы отображаются зелёным, расходы — красным.

---

### Пример 3 — Делегирование событий на таблице

```js
const table = document.getElementById('transactionsTable');

table.addEventListener('click', (event) => {
  // Клик по кнопке удаления
  const deleteBtn = event.target.closest('.btn-delete');
  if (deleteBtn) {
    handleDelete(deleteBtn.dataset.id);
    return;
  }

  // Клик по строке транзакции
  const row = event.target.closest('tr[data-id]');
  if (row) {
    handleRowClick(row.dataset.id);
  }
});
```

Один обработчик работает для всех строк, добавленных в любой момент времени.

---

### Пример 4 — Переключение панели деталей

```js
function handleRowClick(id) {
  if (selectedId === id) {
    // Повторный клик — сбрасываем
    selectedId = null;
    renderTransactionDetail(null);
    highlightRow(null);
  } else {
    selectedId = id;
    const transaction = getTransactionById(id);
    renderTransactionDetail(transaction);
    highlightRow(id);
  }
}
```

---

### Пример 5 — Валидация формы

```js
function validateForm(amountInput, categoryInput, descriptionInput) {
  clearErrors();
  let valid = true;

  const amount = parseFloat(amountInput.value);
  if (!amountInput.value || isNaN(amount) || amount === 0) {
    showError('amountError', amountInput, 'Введите ненулевую сумму');
    valid = false;
  }

  if (!categoryInput.value) {
    showError('categoryError', categoryInput, 'Выберите категорию');
    valid = false;
  }

  if (!descriptionInput.value.trim()) {
    showError('descriptionError', descriptionInput, 'Введите описание');
    valid = false;
  }

  return valid;
}
```

---

### Пример 6 — Подсчёт суммы через `Array.reduce`

```js
export function calculateTotal() {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}
```

**Трассировка:**
```
transactions = [{ amount: 5000 }, { amount: -450 }, { amount: -1200 }]

reduce: 0 + 5000  = 5000
        5000 - 450  = 4550
        4550 - 1200 = 3350

calculateTotal() → 3350
```

---

### Пример 7 — Защита от XSS через `escapeHtml`

```js
// Опасно:
td.innerHTML = userInput; // если "<script>alert('XSS')</script>" — выполнится!

// Безопасно:
td.innerHTML = escapeHtml(userInput);
// "<script>" → "&lt;script&gt;" — отобразится как текст

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
```

---

### Пример 8 — Подключение ES-модуля

```html
<!-- type="module" обязателен для import/export -->
<!-- Скрипт автоматически выполняется как defer -->
<script type="module" src="src/index.js"></script>
```

```js
// src/index.js
import { generateId } from './utils.js';              // расширение .js обязательно
import { addTransaction, calculateTotal } from './transactions.js';
import { renderTransactionRow, renderTotal } from './ui.js';
```

---

## ❓ Ответы на контрольные вопросы

---

### Вопрос 1. Каким образом можно получить доступ к элементу на веб-странице с помощью JavaScript?

JavaScript предоставляет несколько способов поиска DOM-элементов через методы объекта `document`.

#### Методы поиска одного элемента

**`document.getElementById(id)`** — самый быстрый способ. Возвращает элемент с указанным `id` или `null`.

```js
// HTML: <span id="totalAmount">0.00 ₽</span>
const totalEl = document.getElementById('totalAmount');
// → HTMLSpanElement
```

**`document.querySelector(selector)`** — возвращает **первый** элемент, соответствующий любому CSS-селектору. Самый универсальный метод.

```js
// По тегу
const table = document.querySelector('table');

// По классу
const firstError = document.querySelector('.field-error');

// По атрибуту data-*
const row = document.querySelector('tr[data-id="txn_123"]');

// Вложенный селектор
const btn = document.querySelector('tr[data-id="txn_123"] .btn-delete');
```

#### Методы поиска нескольких элементов

**`document.querySelectorAll(selector)`** — возвращает `NodeList` всех подходящих элементов. По нему можно итерироваться через `forEach`.

```js
const rows = document.querySelectorAll('#tableBody tr');
rows.forEach(row => console.log(row.dataset.id));
```

**`document.getElementsByClassName(className)`** — возвращает **живую** `HTMLCollection` (автоматически обновляется при изменении DOM).

```js
const errorFields = document.getElementsByClassName('error');
```

**`document.getElementsByTagName(tag)`** — все элементы указанного тега.

```js
const allButtons = document.getElementsByTagName('button');
```

#### Навигация по DOM-дереву

Получив один элемент, можно перемещаться по дереву относительно него:

```js
const row = document.querySelector('tr[data-id="txn_123"]');

row.parentElement          // <tbody>
row.children               // HTMLCollection ячеек <td>
row.firstElementChild      // первый <td>
row.lastElementChild       // последний <td>
row.nextElementSibling     // следующая строка <tr>
row.previousElementSibling // предыдущая строка <tr>
```

**`element.closest(selector)`** — поднимается вверх по DOM и возвращает первый совпадающий предок. Активно применяется в делегировании событий:

```js
// В обработчике клика на таблице:
const row = event.target.closest('tr[data-id]');
// Работает, даже если кликнули по <td> или <span> внутри строки
```

#### Сравнение методов

| Метод | Возвращает | «Живой»? | По чему ищет |
|-------|-----------|----------|--------------|
| `getElementById` | `Element \| null` | — | Атрибут `id` |
| `querySelector` | `Element \| null` | нет | Любой CSS-селектор |
| `querySelectorAll` | `NodeList` | нет | Любой CSS-селектор |
| `getElementsByClassName` | `HTMLCollection` | **да** | CSS-класс |
| `getElementsByTagName` | `HTMLCollection` | **да** | HTML-тег |

В проекте `getElementById` используется для получения именованных контейнеров (форма, tbody, панель деталей), а `querySelector`/`closest` — в обработчиках событий.

---

### Вопрос 2. Что такое делегирование событий и как оно используется для эффективного управления событиями на элементах DOM?

#### Предпосылка: всплытие событий (Event Bubbling)

Когда пользователь кликает по элементу, событие не остаётся только на нём — оно **всплывает** вверх по DOM-дереву через всех предков до `document`.

```
Пользователь кликает по <button class="btn-delete">
         ↓
  событие на <button>
         ↓
  событие на <td>
         ↓
  событие на <tr>
         ↓
  событие на <tbody>
         ↓
  событие на <table>   ← наш обработчик здесь
         ↓
  событие на <body>
         ↓
  событие на document
```

#### Что такое делегирование

**Делегирование событий** — паттерн, при котором обработчик устанавливается **один раз на родительский элемент**, а не на каждый дочерний. Внутри обработчика выясняют, на каком конкретно потомке произошло событие — через `event.target` и `closest()`.

#### Реализация в проекте

```js
// ❌ Наивный подход — обработчик на каждой кнопке
// При добавлении новой строки нужно снова вешать обработчик
document.querySelectorAll('.btn-delete').forEach(btn => {
  btn.addEventListener('click', () => handleDelete(btn.dataset.id));
});

// ✅ Делегирование — один обработчик на <table>
// Автоматически работает для всех кнопок: нынешних и будущих
document.getElementById('transactionsTable').addEventListener('click', (event) => {

  const deleteBtn = event.target.closest('.btn-delete');
  if (deleteBtn) {
    handleDelete(deleteBtn.dataset.id);
    return;
  }

  const row = event.target.closest('tr[data-id]');
  if (row) {
    handleRowClick(row.dataset.id);
  }
});
```

#### Почему `closest()`, а не просто `event.target`

Без `closest` при клике на текст внутри кнопки `event.target` будет текстовым узлом, а не самой кнопкой. `closest` надёжно поднимается вверх и находит нужный предок:

```html
<button class="btn-delete" data-id="txn_123">
  удалить   ← при клике сюда event.target — текстовый узел "#text"
</button>
```

```js
// event.target          → #text (текстовый узел, нет .dataset)
// event.target.closest('.btn-delete') → <button data-id="txn_123"> ✅
```

#### Преимущества делегирования

| Критерий | Без делегирования | С делегированием |
|----------|-----------------|-----------------|
| Количество обработчиков | По одному на каждую кнопку | Один на таблицу |
| Динамические элементы | Нужно добавлять вручную | Работают автоматически |
| Потребление памяти | Растёт с числом строк | Константное |
| Сложность кода | Выше | Ниже |

---

### Вопрос 3. Как можно изменить содержимое элемента DOM с помощью JavaScript после его выборки?

После получения ссылки на элемент JavaScript предоставляет несколько свойств для изменения его содержимого.

#### Изменение текста

**`element.textContent`** — устанавливает чистый текст. Все HTML-теги воспринимаются как текст, а не разметка. Безопасен от XSS.

```js
const totalEl = document.getElementById('totalAmount');

totalEl.textContent = '+5 000.00 ₽';      // установка
console.log(totalEl.textContent);          // чтение: "+5 000.00 ₽"
```

**`element.innerText`** — похоже на `textContent`, но учитывает CSS-видимость элемента. Немного медленнее.

```js
// Если элемент скрыт через display:none:
hiddenEl.innerText;   // ""        (не видит скрытый текст)
hiddenEl.textContent; // "текст"   (возвращает всегда)
```

#### Изменение HTML-содержимого

**`element.innerHTML`** — вставляет HTML-разметку. Браузер парсит строку и создаёт новые DOM-узлы. Позволяет задавать сложные шаблоны одной строкой.

```js
const container = document.getElementById('transactionDetail');

container.innerHTML = `
  <div class="detail-grid">
    <span class="detail-key">Дата</span>
    <span class="detail-val">${formatDate(transaction.date)}</span>

    <span class="detail-key">Сумма</span>
    <span class="detail-val ${amountClass}">${formatAmount(transaction.amount)}</span>
  </div>
`;
```

> ⚠️ **Никогда не вставляйте через `innerHTML` необработанный пользовательский ввод** — это открывает XSS-уязвимость. В проекте все данные пользователя сначала проходят через `escapeHtml()`.

#### Изменение атрибутов

```js
row.setAttribute('data-id', 'txn_123');  // установить
row.getAttribute('data-id');             // получить: "txn_123"
row.removeAttribute('data-selected');    // удалить

// dataset — удобная работа с data-* атрибутами
row.dataset.id = 'txn_456';
console.log(row.dataset.id);            // "txn_456"
```

#### Изменение стилей

```js
// Инлайн-стиль (через свойство style)
const totalEl = document.getElementById('totalAmount');
totalEl.style.color    = 'var(--green)';
totalEl.style.fontSize = '1.5rem';

// Через classList — предпочтительный способ
row.classList.add('selected');
row.classList.remove('positive');
row.classList.toggle('highlighted');
row.classList.contains('selected'); // → true / false
```

В проекте `style.color` применяется для динамического окрашивания итоговой суммы в шапке, а `classList` — для переключения `.selected` на строках и цветовых классов `.positive`/`.negative`.

#### Сравнение свойств

| Свойство | Парсит HTML | Безопасно от XSS | Учитывает CSS-видимость |
|----------|-------------|-----------------|------------------------|
| `textContent` | ❌ (текст как есть) | ✅ | ❌ |
| `innerText` | ❌ | ✅ | ✅ |
| `innerHTML` | ✅ | ⚠️ зависит от данных | ❌ |

---

### Вопрос 4. Как можно добавить новый элемент в DOM дерево с помощью JavaScript?

Добавление элемента в DOM состоит из трёх шагов: создания, настройки и вставки.

#### Шаг 1 — Создание элемента

**`document.createElement(tag)`** — создаёт новый HTML-элемент в памяти, но ещё не вставляет его в документ.

```js
const tr     = document.createElement('tr');
const td     = document.createElement('td');
const button = document.createElement('button');
```

#### Шаг 2 — Настройка элемента

```js
// Атрибуты
tr.dataset.id = transaction.id;

// CSS-классы
tr.classList.add(transaction.amount >= 0 ? 'positive' : 'negative');

// HTML-содержимое (шаблон)
tr.innerHTML = `
  <td class="date-cell">${formatDate(transaction.date)}</td>
  <td>${escapeHtml(transaction.category)}</td>
  <td>${escapeHtml(truncateWords(transaction.description))}</td>
  <td class="amount-cell">${formatAmount(transaction.amount)}</td>
  <td><button class="btn-delete" data-id="${transaction.id}">удалить</button></td>
`;
```

#### Шаг 3 — Вставка в DOM

**`parentElement.appendChild(child)`** — добавляет в **конец** родителя. Используется в проекте.

```js
const tbody = document.getElementById('tableBody');
tbody.appendChild(tr); // строка появляется последней
```

**`parentElement.prepend(child)`** — добавляет в **начало**.

```js
tbody.prepend(tr); // строка появится первой
```

**`parentElement.insertBefore(newChild, referenceChild)`** — вставляет перед указанным элементом.

```js
const firstRow = tbody.firstElementChild;
tbody.insertBefore(tr, firstRow); // вставить перед первой строкой
```

**`element.insertAdjacentHTML(position, html)`** — вставляет HTML-строку в указанную позицию.

```js
// Позиции: 'beforebegin', 'afterbegin', 'beforeend', 'afterend'
tbody.insertAdjacentHTML('beforeend', `<tr data-id="${id}">...</tr>`);
```

#### Полный цикл в проекте

```js
export function renderTransactionRow(transaction) {
  // 1. Убираем заглушку "нет транзакций"
  document.getElementById('emptyState').classList.remove('visible');

  // 2. Создаём элемент строки
  const tr = document.createElement('tr');

  // 3. Устанавливаем data-атрибут для идентификации
  tr.dataset.id = transaction.id;

  // 4. Цветовой класс в зависимости от знака суммы
  tr.classList.add(transaction.amount >= 0 ? 'positive' : 'negative');

  // 5. Содержимое — пользовательские данные экранированы!
  tr.innerHTML = `
    <td class="date-cell">${formatDate(transaction.date)}</td>
    <td>${escapeHtml(transaction.category)}</td>
    <td>${escapeHtml(truncateWords(transaction.description))}</td>
    <td class="amount-cell">${formatAmount(transaction.amount)}</td>
    <td><button class="btn-delete" data-id="${transaction.id}">удалить</button></td>
  `;

  // 6. Вставляем в конец таблицы
  document.getElementById('tableBody').appendChild(tr);
}
```

#### Оптимизация: `DocumentFragment`

При пакетном добавлении множества элементов каждый `appendChild` вызывает перерасчёт макета (reflow). Чтобы избежать этого, используют `DocumentFragment` — виртуальный контейнер без привязки к DOM:

```js
const fragment = document.createDocumentFragment();

transactions.forEach(transaction => {
  const tr = document.createElement('tr');
  tr.innerHTML = `...`;
  fragment.appendChild(tr); // в фрагмент, не в DOM
});

// Один раз — один reflow
tbody.appendChild(fragment);
```

В данном проекте транзакции добавляются по одной, поэтому `DocumentFragment` не применялся, но это важный приём при работе с большими списками данных.

---

## 📖 Список использованных источников

1. **MDN Web Docs — Document Object Model (DOM)**  
   https://developer.mozilla.org/ru/docs/Web/API/Document_Object_Model

2. **MDN Web Docs — EventTarget.addEventListener()**  
   https://developer.mozilla.org/ru/docs/Web/API/EventTarget/addEventListener

3. **MDN Web Docs — Event.target**  
   https://developer.mozilla.org/ru/docs/Web/API/Event/target

4. **MDN Web Docs — Element.closest()**  
   https://developer.mozilla.org/ru/docs/Web/API/Element/closest

5. **MDN Web Docs — Node.appendChild()**  
   https://developer.mozilla.org/ru/docs/Web/API/Node/appendChild

6. **MDN Web Docs — Document.createElement()**  
   https://developer.mozilla.org/ru/docs/Web/API/Document/createElement

7. **MDN Web Docs — Element.innerHTML**  
   https://developer.mozilla.org/ru/docs/Web/API/Element/innerHTML

8. **MDN Web Docs — HTMLElement.dataset**  
   https://developer.mozilla.org/ru/docs/Web/API/HTMLElement/dataset

9. **MDN Web Docs — JavaScript модули**  
   https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Modules

10. **MDN Web Docs — Array.prototype.reduce()**  
    https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/Array/reduce

11. **MDN Web Docs — DocumentFragment**  
    https://developer.mozilla.org/ru/docs/Web/API/DocumentFragment

12. **javascript.info — Введение в браузерные события**  
    https://learn.javascript.ru/introduction-browser-events

13. **javascript.info — Делегирование событий**  
    https://learn.javascript.ru/event-delegation

14. **javascript.info — Всплытие и погружение**  
    https://learn.javascript.ru/bubbling-and-capturing

15. **javascript.info — Модификация документа**  
    https://learn.javascript.ru/modifying-document

16. **javascript.info — Поиск элементов: getElement*, querySelector***  
    https://learn.javascript.ru/searching-elements-dom

17. **javascript.info — Модули ES6**  
    https://learn.javascript.ru/modules-intro

18. **JSDoc официальная документация**  
    https://jsdoc.app/

---

## 🔧 Дополнительные аспекты

### Принцип разделения ответственности (Separation of Concerns)

Проект намеренно разбит по принципу **SoC** — каждый модуль отвечает только за одну область:

```
utils.js        → чистые функции, нет DOM, нет хранения данных
transactions.js → хранение данных и бизнес-логика, нет DOM
ui.js           → только DOM, нет хранения состояния
index.js        → «клей»: связывает форму, данные и отображение
```

Это позволяет, например, заменить хранение с массива на `localStorage` — изменив только `transactions.js`, не трогая `ui.js` и `utils.js`.

---

### Защита от XSS (Cross-Site Scripting)

Любой пользовательский ввод перед вставкой через `innerHTML` экранируется через `escapeHtml()`:

```
Ввод:    <img src=x onerror="alert('взломан')">
Результат: &lt;img src=x onerror=&quot;alert('взломан')&quot;&gt;
           → отобразится как текст, не выполнится как код
```

---

### ES-модули: строгий режим и изоляция

Скрипты с `type="module"` автоматически работают в **строгом режиме** (`'use strict'`):
- Запрет необъявленных переменных
- `this` в глобальном контексте равен `undefined`, не `window`
- Каждый модуль имеет собственную область видимости — переменные не попадают в `window`

---

### Адаптивная вёрстка

При ширине экрана менее 640px форма перестраивается в одну колонку:

```css
@media (max-width: 640px) {
  .form-grid { grid-template-columns: 1fr; }
  .full-width { grid-column: auto; }
  .header-inner { flex-direction: column; gap: 8px; }
}
```

---

### Возможные улучшения

| Улучшение | Технология |
|-----------|-----------|
| Сохранение данных между сессиями | `localStorage` / `IndexedDB` |
| Фильтрация по категории и дате | `Array.filter()` + `<select>` |
| Сортировка строк | `Array.sort()` |
| Графики расходов | `Chart.js` / `D3.js` |
| Экспорт в CSV | `Blob API` |
| Unit-тесты | `Vitest` / `Jest` |
| Серверное хранение | `REST API` + `fetch` |

---

*Лабораторная работа выполнена с соблюдением всех требований задания. Код структурирован по модулям, задокументирован в стандарте JSDoc и покрывает все 8 шагов условия.*
