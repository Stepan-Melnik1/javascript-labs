# Лабораторная работа №3 — Основы работы с массивами, функциями и объектами в JavaScript

## Описание лабораторной работы

Цель работы — изучить основы работы с массивами и функциями в JavaScript на практическом примере: реализация консольного приложения для анализа банковских транзакций.

В ходе работы реализованы:
- Массив объектов-транзакций с заданной структурой
- 15 функций для фильтрации, поиска и агрегации данных
- Тестирование на основном, пустом и одноэлементном массивах

---

## Инструкции по запуску проекта

### Требования

- Установленный [Node.js](https://nodejs.org/) версии 14 и выше

### Запуск

1. Склонируйте или скачайте репозиторий
2. Перейдите в папку проекта:
   ```bash
   cd lab3
   ```
3. Запустите файл:
   ```bash
   node main.js
   ```

Результат выполнения всех функций будет выведен в консоль.

---

## Краткая документация к проекту

### Структура проекта

```
lab3/
└── main.js   — основной файл с данными, функциями и тестами
```

### Структура объекта транзакции

| Поле | Тип | Описание |
|---|---|---|
| `transaction_id` | `string` | Уникальный идентификатор |
| `transaction_date` | `string` | Дата в формате `YYYY-MM-DD` |
| `transaction_amount` | `number` | Сумма транзакции |
| `transaction_type` | `string` | Тип: `"debit"` или `"credit"` |
| `transaction_description` | `string` | Описание операции |
| `merchant_name` | `string` | Название продавца |
| `card_type` | `string` | Тип карты |

### Описание функций

| Функция | Параметры | Возвращает |
|---|---|---|
| `getUniqueTransactionTypes(transactions)` | Массив транзакций | `string[]` — уникальные типы |
| `calculateTotalAmount(transactions)` | Массив транзакций | `number` — сумма всех транзакций |
| `calculateTotalAmountByDate(transactions, year?, month?, day?)` | Массив + опциональные год/месяц/день | `number` — сумма за период |
| `getTransactionByType(transactions, type)` | Массив + тип (`"debit"` / `"credit"`) | `Transaction[]` |
| `getTransactionsInDateRange(transactions, startDate, endDate)` | Массив + две даты `YYYY-MM-DD` | `Transaction[]` |
| `getTransactionsByMerchant(transactions, merchantName)` | Массив + имя продавца | `Transaction[]` |
| `calculateAverageTransactionAmount(transactions)` | Массив транзакций | `number` — среднее значение |
| `getTransactionsByAmountRange(transactions, minAmount, maxAmount)` | Массив + мин/макс суммы | `Transaction[]` |
| `calculateTotalDebitAmount(transactions)` | Массив транзакций | `number` — сумма дебетовых |
| `findMostTransactionsMonth(transactions)` | Массив транзакций | `number` — номер месяца (1–12) |
| `findMostDebitTransactionMonth(transactions)` | Массив транзакций | `number` — номер месяца (1–12) |
| `mostTransactionTypes(transactions)` | Массив транзакций | `"debit"` / `"credit"` / `"equal"` |
| `getTransactionsBeforeDate(transactions, date)` | Массив + дата `YYYY-MM-DD` | `Transaction[]` |
| `findTransactionById(transactions, id)` | Массив + id | `Transaction` или `null` |
| `mapTransactionDescriptions(transactions)` | Массив транзакций | `string[]` — описания |

---

## Подробное описание функций

---

### `getUniqueTransactionTypes(transactions)`

**Задача:** вернуть массив уникальных типов транзакций без дубликатов.

```javascript
function getUniqueTransactionTypes(transactions) {
  return [...new Set(transactions.map((t) => t.transaction_type))];
}
```

**Как работает по шагам:**

1. `transactions.map((t) => t.transaction_type)` — проходим по каждому объекту и вытаскиваем только поле `transaction_type`. Получаем массив со всеми типами, включая повторы:
   ```
   ["debit", "credit", "debit", "debit", "credit", ...]
   ```

2. `new Set(...)` — передаём этот массив в конструктор `Set`. `Set` — это встроенная коллекция, которая **не допускает дубликатов**. При добавлении уже существующего значения оно просто игнорируется:
   ```
   Set { "debit", "credit" }
   ```

3. `[...new Set(...)]` — spread-оператор разворачивает `Set` обратно в обычный массив, потому что `Set` не имеет методов массива (`filter`, `map` и т.д.):
   ```
   ["debit", "credit"]
   ```

**Почему именно `Set`, а не `filter` с `indexOf`?**
Можно было бы написать через `filter`:
```javascript
transactions.map(t => t.transaction_type).filter((type, index, arr) => arr.indexOf(type) === index)
```
Но `Set` — чище, короче и семантически точнее: его назначение именно хранение уникальных значений.

---

### `calculateTotalAmount(transactions)`

**Задача:** посчитать сумму `transaction_amount` всех транзакций.

```javascript
function calculateTotalAmount(transactions) {
  return transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
}
```

**Как работает `reduce`:**

`reduce(callback, initialValue)` принимает два аргумента:
- `callback` — функция, вызываемая для каждого элемента
- `initialValue` — начальное значение аккумулятора (`0` в нашем случае)

Callback получает два параметра:
- `sum` — накопленный результат (аккумулятор)
- `t` — текущий элемент массива

Пошаговое выполнение на трёх транзакциях:
```
Итерация 1: sum = 0,   t.amount = 100  =>  sum = 0 + 100   = 100
Итерация 2: sum = 100, t.amount = 50   =>  sum = 100 + 50  = 150
Итерация 3: sum = 150, t.amount = 75   =>  sum = 150 + 75  = 225
Результат: 225
```

**Почему начальное значение `0`, а не просто первый элемент?**
Если не передать `initialValue` и массив окажется пустым — `reduce` выбросит `TypeError`. С начальным значением `0` пустой массив просто вернёт `0`.

---

### `calculateTotalAmountByDate(transactions, year?, month?, day?)` [extra]

**Задача:** посчитать сумму транзакций с фильтрацией по дате. Все три параметра даты необязательны — можно передать только год, год+месяц, или все три.

```javascript
function calculateTotalAmountByDate(transactions, year, month, day) {
  const filtered = transactions.filter((t) => {
    const [y, m, d] = t.transaction_date.split("-").map(Number);
    if (year !== undefined && y !== year) return false;
    if (month !== undefined && m !== month) return false;
    if (day !== undefined && d !== day) return false;
    return true;
  });
  return calculateTotalAmount(filtered);
}
```

**Разбор построчно:**

`t.transaction_date.split("-")` — строка `"2019-03-15"` режется по символу `"-"`, результат: `["2019", "03", "15"]`.

`.map(Number)` — `map` применяет функцию `Number` к каждому элементу, конвертируя строки в числа: `[2019, 3, 15]`. Важно убрать ведущие нули — `"03"` как строка не равна `3` как числу.

`const [y, m, d] = [2019, 3, 15]` — деструктуризация массива: переменные объявляются и сразу получают значения по позиции.

`if (year !== undefined && y !== year) return false` — двойное условие:
- `year !== undefined` — был ли вообще передан параметр. Если нет — не фильтруем по году.
- `y !== year` — если год передан, но не совпадает — исключаем транзакцию.

Если все три проверки пройдены — `return true`, транзакция попадает в результат.

В конце вызываем уже готовую `calculateTotalAmount` — не дублируем логику `reduce`.

**Варианты вызова:**
```javascript
calculateTotalAmountByDate(transactions, 2019)        // все транзакции за 2019 год
calculateTotalAmountByDate(transactions, 2019, 3)     // март 2019
calculateTotalAmountByDate(transactions, 2019, 3, 15) // конкретный день
calculateTotalAmountByDate(transactions, undefined, 3) // март любого года
```

---

### `getTransactionByType(transactions, type)`

**Задача:** вернуть только транзакции указанного типа (`"debit"` или `"credit"`).

```javascript
function getTransactionByType(transactions, type) {
  return transactions.filter((t) => t.transaction_type === type);
}
```

`filter` проходит по каждому элементу и оставляет только те, для которых callback вернул `true`. Здесь условие одно: поле `transaction_type` объекта должно строго совпадать с переданным `type`.

`===` — строгое равенство, проверяет и значение, и тип данных. `"debit" === "debit"` → `true`, `"debit" === "Debit"` → `false` (регистр важен).

Эта функция активно переиспользуется внутри других функций (`calculateTotalDebitAmount`, `findMostDebitTransactionMonth`, `mostTransactionTypes`) — это пример принципа DRY (Don't Repeat Yourself).

---

### `getTransactionsInDateRange(transactions, startDate, endDate)`

**Задача:** вернуть транзакции, дата которых попадает в диапазон от `startDate` до `endDate` включительно.

```javascript
function getTransactionsInDateRange(transactions, startDate, endDate) {
  return transactions.filter(
    (t) => t.transaction_date >= startDate && t.transaction_date <= endDate
  );
}
```

**Ключевой момент — сравнение строк-дат:**

Даты хранятся в формате `YYYY-MM-DD`. JavaScript сравнивает строки **лексикографически** — посимвольно слева направо. Поскольку год стоит первым, потом месяц, потом день — этот порядок совпадает с хронологическим:

```
"2019-01-01" < "2019-03-15"  // true: 01 < 03 по месяцу
"2019-12-31" > "2019-01-01"  // true: 12 > 01 по месяцу
"2020-01-01" > "2019-12-31"  // true: 2020 > 2019 по году
```

`>=` и `<=` — обе границы включены. Транзакция с датой равной `startDate` или `endDate` тоже попадёт в результат.

**Почему не `new Date()`?**
Можно было бы конвертировать в объекты `Date`, но для формата ISO 8601 это избыточно — строковое сравнение работает корректно и быстрее.

---

### `getTransactionsByMerchant(transactions, merchantName)`

**Задача:** вернуть все транзакции конкретного продавца.

```javascript
function getTransactionsByMerchant(transactions, merchantName) {
  return transactions.filter((t) => t.merchant_name === merchantName);
}
```

Тот же паттерн что и `getTransactionByType` — `filter` с точным совпадением поля. Сравнение строгое (`===`), то есть регистр и пробелы важны: `"SuperMart"` ≠ `"supermart"`.

В реальных приложениях сюда добавили бы `.toLowerCase()` для нечувствительного к регистру поиска — но по условию задания это не требуется.

---

### `calculateAverageTransactionAmount(transactions)`

**Задача:** вернуть среднее арифметическое сумм всех транзакций.

```javascript
function calculateAverageTransactionAmount(transactions) {
  if (transactions.length === 0) return 0;
  return calculateTotalAmount(transactions) / transactions.length;
}
```

**Guard clause:**
Первая строка — защита от деления на ноль. Без неё при пустом массиве получили бы `0 / 0 = NaN` (Not a Number). `NaN` опасен тем, что любые операции с ним тоже дают `NaN`, и ошибка распространяется по всему коду незаметно.

**Формула:**
Среднее = сумма всех элементов / количество элементов.

`transactions.length` — встроенное свойство массива, количество элементов. Обращение к нему бесплатно — это не метод, который что-то считает, а просто хранимое значение.

Переиспользуем `calculateTotalAmount` вместо повторного `reduce` — если логика суммирования когда-либо изменится, достаточно поправить одно место.

---

### `getTransactionsByAmountRange(transactions, minAmount, maxAmount)`

**Задача:** вернуть транзакции, сумма которых находится в диапазоне от `minAmount` до `maxAmount` включительно.

```javascript
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
  return transactions.filter(
    (t) => t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount
  );
}
```

`filter` с двумя условиями, объединёнными через `&&` (логическое И). Оба должны быть `true` одновременно:
- `t.transaction_amount >= minAmount` — сумма не меньше нижней границы
- `t.transaction_amount <= maxAmount` — сумма не больше верхней границы

`>=` и `<=` — обе границы включены. Транзакция с суммой ровно `minAmount` или `maxAmount` попадёт в результат.

---

### `calculateTotalDebitAmount(transactions)`

**Задача:** посчитать сумму только дебетовых транзакций.

```javascript
function calculateTotalDebitAmount(transactions) {
  return calculateTotalAmount(getTransactionByType(transactions, "debit"));
}
```

Чистый пример **функциональной композиции**: результат одной функции передаётся как аргумент в другую. Читается изнутри наружу:

1. `getTransactionByType(transactions, "debit")` — фильтруем, оставляем только дебетовые
2. `calculateTotalAmount(...)` — считаем их сумму

Никакого нового кода — только комбинация уже написанных функций. Если бы мы писали это без переиспользования, пришлось бы дублировать и `filter`, и `reduce`.

---

### `findMostTransactionsMonth(transactions)`

**Задача:** найти номер месяца, в котором было больше всего транзакций.

```javascript
function findMostTransactionsMonth(transactions) {
  if (transactions.length === 0) return null;
  const countByMonth = {};
  transactions.forEach((t) => {
    const month = Number(t.transaction_date.split("-")[1]);
    countByMonth[month] = (countByMonth[month] || 0) + 1;
  });
  return Number(
    Object.entries(countByMonth).sort((a, b) => b[1] - a[1])[0][0]
  );
}
```

**Пошаговый разбор:**

**Шаг 1** — `const countByMonth = {}` — создаём пустой объект-счётчик. После заполнения он будет выглядеть так:
```javascript
{ 1: 3, 2: 3, 3: 3, 4: 1 }
// месяц: количество транзакций
```

**Шаг 2** — `forEach` заполняет этот счётчик:

`t.transaction_date.split("-")[1]` — из даты `"2019-03-15"` вырезаем месяц: `split` даёт `["2019", "03", "15"]`, берём индекс `[1]` → `"03"`.

`Number("03")` → `3` — убираем ведущий ноль.

`countByMonth[month] = (countByMonth[month] || 0) + 1`:
- `countByMonth[3]` в первый раз — `undefined`
- `undefined || 0` — оператор `||` возвращает правый операнд если левый falsy (`undefined`, `null`, `0`, `""`)
- `0 + 1 = 1` — записываем 1 для этого месяца
- При следующем обращении: `1 || 0` → `1`, затем `1 + 1 = 2`

**Шаг 3** — `Object.entries(countByMonth)` — превращает объект в массив пар:
```javascript
[[1, 3], [2, 3], [3, 3], [4, 1]]
// [номер месяца, количество транзакций]
```

**Шаг 4** — `.sort((a, b) => b[1] - a[1])` — сортировка по убыванию количества:
- `a` и `b` — две сравниваемые пары
- `b[1] - a[1]` — если результат положительный, `b` ставится раньше `a` (убывающий порядок)
- Пара с наибольшим количеством окажется первой

**Шаг 5** — `[0][0]` — берём первый элемент отсортированного массива (`[0]`), это пара вида `[месяц, количество]`, затем берём первый элемент этой пары (`[0]`) — номер месяца.

`Number(...)` в конце — `Object.entries` превращает ключи объекта в строки, поэтому конвертируем обратно в число.

---

### `findMostDebitTransactionMonth(transactions)`

**Задача:** найти месяц с наибольшим количеством дебетовых транзакций.

```javascript
function findMostDebitTransactionMonth(transactions) {
  return findMostTransactionsMonth(getTransactionByType(transactions, "debit"));
}
```

Снова композиция: сначала фильтруем только дебетовые, затем передаём в уже готовую функцию поиска месяца. Вся сложная логика подсчёта по месяцам написана один раз в `findMostTransactionsMonth`.

---

### `mostTransactionTypes(transactions)`

**Задача:** определить, каких транзакций больше, и вернуть соответствующую строку.

```javascript
function mostTransactionTypes(transactions) {
  const debitCount = getTransactionByType(transactions, "debit").length;
  const creditCount = getTransactionByType(transactions, "credit").length;
  if (debitCount > creditCount) return "debit";
  if (creditCount > debitCount) return "credit";
  return "equal";
}
```

`getTransactionByType(...).length` — вызываем функцию и сразу берём `.length` у возвращённого массива, не сохраняя массив в переменную — нам нужно только количество.

Три `return` — паттерн ранних возвратов (early return). Как только условие выполнено — функция завершается, до следующих строк выполнение не доходит. Третий `return "equal"` сработает только если оба `if` выше не выполнились, то есть счётчики равны.

**Поведение на пустом массиве:** оба счётчика будут `0`, оба `if` не сработают, вернётся `"equal"` — логично и корректно.

---

### `getTransactionsBeforeDate(transactions, date)`

**Задача:** вернуть транзакции, совершённые **строго до** указанной даты (сама дата не включается).

```javascript
function getTransactionsBeforeDate(transactions, date) {
  return transactions.filter((t) => t.transaction_date < date);
}
```

Строгий оператор `<` — транзакция с датой ровно равной `date` не попадёт в результат. Если нужно включить саму дату — используется `<=`.

Сравнение строк в формате `YYYY-MM-DD` работает корректно (как объяснено в `getTransactionsInDateRange`).

---

### `findTransactionById(transactions, id)`

**Задача:** найти и вернуть одну транзакцию по её `transaction_id`.

```javascript
function findTransactionById(transactions, id) {
  return transactions.find((t) => t.transaction_id === id) || null;
}
```

**`find` vs `filter`:**

| | `find` | `filter` |
|---|---|---|
| Возвращает | Первый подходящий элемент | Массив всех подходящих |
| Если не нашёл | `undefined` | Пустой массив `[]` |
| Останавливается | Сразу после первого совпадения | Проходит весь массив |

Поскольку `transaction_id` уникален — `find` семантически точнее и эффективнее.

`|| null` — если `find` не нашёл элемент, он возвращает `undefined`. Мы заменяем это на `null`, потому что `null` — явное "ничего нет", а `undefined` — "значение не определено". С `null` вызывающий код может сделать простую проверку `if (result === null)`.

---

### `mapTransactionDescriptions(transactions)`

**Задача:** вернуть массив, содержащий только описания транзакций.

```javascript
function mapTransactionDescriptions(transactions) {
  return transactions.map((t) => t.transaction_description);
}
```

Простейший `map` — проходим по каждому объекту и вытаскиваем одно поле. Результирующий массив всегда той же длины, что исходный. Порядок элементов сохраняется.

Пример результата:
```javascript
[
  "Payment for groceries",
  "Refund for returned item",
  "Dinner with friends",
  ...
]
```

---

## Примеры использования

### `getUniqueTransactionTypes`

```javascript
getUniqueTransactionTypes(transactions);
// => [ 'debit', 'credit' ]
```

### `calculateTotalAmount`

```javascript
calculateTotalAmount(transactions);
// => 855
```

### `calculateTotalAmountByDate` — фильтрация по дате

```javascript
// Только год
calculateTotalAmountByDate(transactions, 2019);
// => 855

// Год + месяц
calculateTotalAmountByDate(transactions, 2019, 1);
// => 225

// Конкретный день
calculateTotalAmountByDate(transactions, 2019, 1, 1);
// => 100
```

### `getTransactionByType`

```javascript
getTransactionByType(transactions, "credit");
// => [ { transaction_id: '2', ... }, { transaction_id: '5', ... }, ... ]
```

### `getTransactionsInDateRange`

```javascript
getTransactionsInDateRange(transactions, "2019-01-01", "2019-01-31");
// => транзакции только за январь 2019
```

### `calculateAverageTransactionAmount`

```javascript
calculateAverageTransactionAmount(transactions);
// => 85.5
```

### `findMostTransactionsMonth`

```javascript
findMostTransactionsMonth(transactions);
// => 1  (январь — больше всего транзакций)
```

### `mostTransactionTypes`

```javascript
mostTransactionTypes(transactions);
// => 'debit'
```

### `findTransactionById`

```javascript
findTransactionById(transactions, "120");
// => { transaction_id: '120', transaction_date: '2019-04-30', ... }

findTransactionById(transactions, "999");
// => null
```

### `mapTransactionDescriptions`

```javascript
mapTransactionDescriptions(transactions);
// => [
//   'Payment for groceries',
//   'Refund for returned item',
//   'Dinner with friends',
//   ...
// ]
```

### Поведение на пустом массиве

```javascript
calculateTotalAmount([]);                    // => 0
calculateAverageTransactionAmount([]);       // => 0
findMostTransactionsMonth([]);              // => null
findTransactionById([], "1");               // => null
getUniqueTransactionTypes([]);              // => []
mostTransactionTypes([]);                   // => 'equal'
```

---

## Ответы на контрольные вопросы

### 1. Какие методы массивов можно использовать для обработки объектов в JavaScript?

В данной работе используются следующие методы:

- **`map(callback)`** — создаёт новый массив, применяя функцию к каждому элементу. Длина результата всегда совпадает с исходным массивом. Используется для извлечения отдельных полей из объектов.

- **`filter(callback)`** — создаёт новый массив из элементов, для которых `callback` вернул `true`. Используется для отбора транзакций по типу, дате, сумме и т.д.

- **`reduce(callback, initialValue)`** — сворачивает массив в одно значение, накапливая результат через аккумулятор. Используется для подсчёта суммы транзакций.

- **`find(callback)`** — возвращает первый элемент, удовлетворяющий условию, или `undefined`. Используется для поиска транзакции по `id`.

- **`forEach(callback)`** — перебирает элементы без возврата нового массива. Используется для построения объекта-счётчика по месяцам.

Помимо этого, применяется `Object.entries()` для преобразования объекта в массив пар `[ключ, значение]`, и `Set` для получения уникальных значений.

---

### 2. Как сравнивать даты в строковом формате в JavaScript?

Если дата хранится в формате **ISO 8601** (`YYYY-MM-DD`), её можно сравнивать напрямую как строку с помощью операторов `<`, `>`, `<=`, `>=`, `===`.

```javascript
"2019-03-15" > "2019-01-01"  // => true
"2019-01-01" < "2019-12-31"  // => true
```

Это работает корректно потому, что JavaScript сравнивает строки **лексикографически** (посимвольно слева направо). Формат `YYYY-MM-DD` специально устроен так, что старший разряд (год) стоит первым — поэтому лексикографический порядок совпадает с хронологическим.

Важно: этот подход работает **только для формата `YYYY-MM-DD`**. Для других форматов (например, `DD.MM.YYYY`) необходимо использовать `new Date()`.

---

### 3. В чём разница между `map()`, `filter()` и `reduce()` при работе с массивами объектов?

| | `map()` | `filter()` | `reduce()` |
|---|---|---|---|
| **Что делает** | Трансформирует каждый элемент | Отбирает элементы по условию | Сворачивает массив в одно значение |
| **Что возвращает** | Новый массив | Новый массив | Любое значение (число, строка, объект) |
| **Длина результата** | Равна исходной | Меньше или равна исходной | Не массив |
| **Пример в работе** | Извлечь все `transaction_type` | Оставить только `debit` | Посчитать сумму всех транзакций |

```javascript
// map — извлекаем поле из каждого объекта
transactions.map(t => t.transaction_amount);
// => [100, 50, 75, 200, ...]

// filter — отбираем по условию
transactions.filter(t => t.transaction_type === "debit");
// => [{ ... }, { ... }, ...]  только дебетовые

// reduce — суммируем в одно число
transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
// => 855
```

---

## Список использованных источников

1. MDN Web Docs — Array.prototype.map(): https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/map
2. MDN Web Docs — Array.prototype.filter(): https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
3. MDN Web Docs — Array.prototype.reduce(): https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
4. MDN Web Docs — Array.prototype.find(): https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/find
5. MDN Web Docs — Set: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Set
6. MDN Web Docs — Object.entries(): https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
7. JSDoc — стандарт документирования JavaScript: https://jsdoc.app/

---

## Дополнительные аспекты

### Почему `===` вместо `==`

В JavaScript `==` выполняет неявное приведение типов (`"1" == 1` → `true`), что может привести к неожиданным багам. Оператор `===` проверяет и значение, и тип данных, что делает поведение кода предсказуемым. В данной работе везде используется строгое сравнение `===`.

### Guard clauses для защиты от граничных случаев

Функции `calculateAverageTransactionAmount` и `findMostTransactionsMonth` содержат проверку на пустой массив в начале тела функции. Это паттерн называется **guard clause** — ранний возврат при невалидных входных данных предотвращает деление на ноль (`NaN`) и обращение к несуществующим элементам.

### Переиспользование функций (композиция)

Ряд функций построен на основе уже написанных:

```javascript
// calculateTotalDebitAmount не пишет reduce заново —
// она комбинирует две уже готовые функции
function calculateTotalDebitAmount(transactions) {
  return calculateTotalAmount(getTransactionByType(transactions, "debit"));
}
```

Такой подход сокращает дублирование кода и упрощает поддержку: если изменится логика суммирования, её нужно поправить только в одном месте.

