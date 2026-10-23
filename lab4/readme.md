# Лабораторная работа №4 — Продвинутые объекты в JavaScript

---

## Содержание

1. [Описание лабораторной работы](#1-описание-лабораторной-работы)
2. [Инструкции по запуску](#2-инструкции-по-запуску)
3. [Краткая документация к проекту](#3-краткая-документация-к-проекту)
4. [Примеры использования](#4-примеры-использования)
5. [Ответы на контрольные вопросы](#5-ответы-на-контрольные-вопросы)
6. [Список использованных источников](#6-список-использованных-источников)
7. [Дополнительные важные аспекты](#7-дополнительные-важные-аспекты)

---

## 1. Описание лабораторной работы

### Цель

Познакомиться с классами и объектами в JavaScript, научиться создавать классы, использовать конструкторы и методы, а также реализовать наследование.

### Задачи

- Создать класс `Item` для представления предмета инвентаря с полями `name`, `weight`, `rarity` и методами `getInfo()`, `setWeight()`.
- Создать класс `Weapon`, расширяющий `Item`, с полями `damage`, `durability` и методами `use()`, `repair()`.
- Протестировать классы: создать объекты, вызвать все методы, включая граничные случаи (сломанное оружие).
- Продемонстрировать опциональную цепочку `?.` для безопасного доступа к свойствам `null`/`undefined`.
- Переписать оба класса через функции-конструкторы с прототипным наследованием.
- Задокументировать код по стандарту JSDoc.

### Технологии

- **Язык:** JavaScript (ES2022+)
- **Среда выполнения:** Node.js v14+
- **Стандарт документации:** JSDoc
- **Файл проекта:** `lab4_inventory.js`

---

## 2. Инструкции по запуску

### Требования

Для запуска необходим **Node.js версии 14 или выше**. Проверьте установку:

```bash
node --version
# Ожидаемый вывод: v18.x.x или выше
```

### Запуск

```bash
# Переходим в папку с проектом
cd /путь/к/папке

# Запускаем скрипт
node lab4_inventory.js
```

После запуска в консоли появится вывод, разделённый на три секции:

- `ТЕСТ КЛАССОВ` — демонстрация синтаксиса `class`
- `ОПЦИОНАЛЬНАЯ ЦЕПОЧКА` — безопасный доступ к `null`/`undefined`
- `ФУНКЦИИ-КОНСТРУКТОРЫ` — альтернативная реализация

---

## 3. Краткая документация к проекту

Проект состоит из одного файла `lab4_inventory.js` и реализует систему инвентаря. В коде присутствуют два параллельных варианта реализации: через **классы** (`class`) и через **функции-конструкторы**. Оба варианта функционально идентичны.

### Структура файла

```
lab4_inventory.js
│
├── [КЛАССЫ]
│   ├── class Item
│   │   ├── constructor(name, weight, rarity)
│   │   ├── getInfo()           → string
│   │   └── setWeight(n)        → void
│   │
│   └── class Weapon extends Item
│       ├── constructor(name, weight, rarity, damage, durability)
│       ├── getInfo()           → string  (override)
│       ├── use()               → void
│       └── repair()            → void
│
├── [ТЕСТ КЛАССОВ]
│
├── [ОПЦИОНАЛЬНАЯ ЦЕПОЧКА ?.]
│
└── [ФУНКЦИИ-КОНСТРУКТОРЫ]
    ├── function ItemConstructor(name, weight, rarity)
    └── function WeaponConstructor(name, weight, rarity, damage, durability)
```

### Класс `Item`

Базовый класс, представляющий любой предмет инвентаря.

**Поля:**

| Поле | Тип | Описание |
|---|---|---|
| `name` | `string` | Название предмета |
| `weight` | `number` | Вес в килограммах |
| `rarity` | `string` | Редкость: `common`, `uncommon`, `rare`, `legendary` |

**Методы:**

| Метод | Параметры | Возвращает | Описание |
|---|---|---|---|
| `getInfo()` | — | `string` | Формирует строку с полной информацией о предмете |
| `setWeight(newWeight)` | `newWeight: number` | `void` | Заменяет вес и выводит сообщение в консоль |

### Класс `Weapon` (наследует `Item`)

Расширяет `Item`, добавляя механику прочности и урона.

**Дополнительные поля:**

| Поле | Тип | Описание |
|---|---|---|
| `damage` | `number` | Урон оружия |
| `durability` | `number` | Прочность от 0 до 100 |

**Методы:**

| Метод | Параметры | Возвращает | Описание |
|---|---|---|---|
| `getInfo()` | — | `string` | Расширяет вывод родителя: добавляет урон и прочность |
| `use()` | — | `void` | Уменьшает `durability` на 10. Если `durability = 0` — выводит предупреждение |
| `repair()` | — | `void` | Восстанавливает `durability` до 100 |

### Функции-конструкторы

`ItemConstructor` и `WeaponConstructor` — функционально идентичны классам, но используют другой синтаксис:

- Поля задаются внутри функции через `this.field = value`
- Методы добавляются через `ClassName.prototype.method = function() {...}`
- Наследование настраивается через `ParentFn.call(this, ...)` и `Object.create(Parent.prototype)`

---

## 4. Примеры использования

### 4.1 Создание и вывод предмета (`Item`)

```js
const sword = new Item("Steel Sword", 3.5, "rare");
console.log(sword.getInfo());
// → [RARE] Steel Sword | Вес: 3.5 кг

sword.setWeight(4.0);
// → Вес "Steel Sword" изменён на 4 кг.

console.log(sword.getInfo());
// → [RARE] Steel Sword | Вес: 4 кг
```

Метод `getInfo()` обращается к полям объекта через `this` и формирует читаемую строку. Метод `setWeight()` мутирует `this.weight` и сразу сообщает об изменении.

### 4.2 Использование и починка оружия (`Weapon`)

```js
const bow = new Weapon("Longbow", 2.0, "uncommon", 15, 100);
console.log(bow.getInfo());
// → [UNCOMMON] Longbow | Вес: 2 кг | Урон: 15 | Прочность: 100/100

bow.use();
// → "Longbow" использовано. Прочность: 90/100

bow.repair();
// → "Longbow" починено. Прочность восстановлена до 100.
```

Метод `use()` использует `Math.max(0, this.durability - 10)`, чтобы прочность никогда не ушла в отрицательные числа. Метод `repair()` просто присваивает `this.durability = 100`.

### 4.3 Граничный случай: сломанное оружие

```js
const axe = new Weapon("Iron Axe", 5.0, "common", 20, 10);
axe.use();
// → "Iron Axe" использовано. Прочность: 0/100

axe.use();
// → "Iron Axe" сломано и не может быть использовано!
```

Условие `if (this.durability > 0)` внутри `use()` гарантирует, что попытка использовать сломанный предмет не вызовет ошибку, а выдаст понятное сообщение.

### 4.4 Опциональная цепочка (`?.`)

Если в массиве предметов встречаются `null` или `undefined`, обычный вызов `item.getInfo()` бросит `TypeError`. Оператор `?.` решает эту проблему:

```js
const items = [
  new Item("Health Potion", 0.3, "common"),
  null,
  new Weapon("Legendary Staff", 1.5, "legendary", 80, 100),
  undefined,
];

items.forEach((item, i) => {
  const info = item?.getInfo(); // безопасный вызов
  console.log(`items[${i}]:`, info ?? "предмет отсутствует");
});

// items[0]: [COMMON] Health Potion | Вес: 0.3 кг
// items[1]: предмет отсутствует
// items[2]: [LEGENDARY] Legendary Staff | Вес: 1.5 кг | Урон: 80 | Прочность: 100/100
// items[3]: предмет отсутствует
```

Оператор `??` (nullish coalescing) возвращает правый операнд, если левый равен `null` или `undefined`. В паре с `?.` это элегантный способ обработки отсутствующих данных.

### 4.5 Функции-конструкторы и проверка `instanceof`

```js
const dagger = new WeaponConstructor("Shadow Dagger", 0.8, "legendary", 45, 100);
console.log(dagger.getInfo());
// → [LEGENDARY] Shadow Dagger | Вес: 0.8 кг | Урон: 45 | Прочность: 100/100

dagger.use();
// → "Shadow Dagger" использовано. Прочность: 90/100

console.log(dagger instanceof WeaponConstructor); // true
console.log(dagger instanceof ItemConstructor);   // true — наследование работает!
```

`instanceof` проверяет цепочку прототипов. `dagger` является экземпляром обоих конструкторов, потому что при настройке наследования мы выполнили `WeaponConstructor.prototype = Object.create(ItemConstructor.prototype)`.

### 4.6 Полный вывод программы

```
======= ТЕСТ КЛАССОВ =======

[RARE] Steel Sword | Вес: 3.5 кг
Вес "Steel Sword" изменён на 4 кг.
[RARE] Steel Sword | Вес: 4 кг

[UNCOMMON] Longbow | Вес: 2 кг | Урон: 15 | Прочность: 100/100
"Longbow" использовано. Прочность: 90/100
Прочность после использования: 90
"Longbow" починено. Прочность восстановлена до 100.
Прочность после ремонта: 100

[COMMON] Iron Axe | Вес: 5 кг | Урон: 20 | Прочность: 10/100
"Iron Axe" использовано. Прочность: 0/100
"Iron Axe" сломано и не может быть использовано!

======= ОПЦИОНАЛЬНАЯ ЦЕПОЧКА =======

items[0]: [COMMON] Health Potion | Вес: 0.3 кг
items[1]: предмет отсутствует (null/undefined)
items[2]: [LEGENDARY] Legendary Staff | Вес: 1.5 кг | Урон: 80 | Прочность: 100/100
items[3]: предмет отсутствует (null/undefined)
emptySlot?.name → undefined

======= ФУНКЦИИ-КОНСТРУКТОРЫ =======

[UNCOMMON] Iron Shield | Вес: 6 кг
Вес "Iron Shield" изменён на 5.5 кг.

[LEGENDARY] Shadow Dagger | Вес: 0.8 кг | Урон: 45 | Прочность: 100/100
"Shadow Dagger" использовано. Прочность: 90/100
"Shadow Dagger" использовано. Прочность: 80/100
Прочность: 80
"Shadow Dagger" починено. Прочность: 100/100

Проверка instanceof:
dagger instanceof WeaponConstructor → true
dagger instanceof ItemConstructor   → true
```

---

## 5. Ответы на контрольные вопросы

### Вопрос 1: Какое значение имеет `this` в методах класса?

Внутри метода класса `this` — это **ссылка на конкретный экземпляр объекта**, для которого был вызван метод. JavaScript передаёт контекст вызова автоматически.

```js
class Item {
  constructor(name) { this.name = name; }
  getInfo() {
    return this.name; // this — это конкретный объект
  }
}

const sword = new Item("Sword");
sword.getInfo();  // this === sword → вернёт "Sword"

const shield = new Item("Shield");
shield.getInfo(); // this === shield → вернёт "Shield"
```

**Важный нюанс:** если вырвать метод из контекста (например, передать как колбэк), `this` потеряется:

```js
const fn = sword.getInfo;
fn(); // this === undefined (strict mode) или window/global — ошибка!

// Решения:
const fn2 = sword.getInfo.bind(sword); // явная привязка через .bind()
const fn3 = () => sword.getInfo();     // стрелочная функция захватывает контекст
```

В нашей лабораторной `this` используется в каждом методе: например, в `getInfo()` мы обращаемся к `this.name`, `this.weight`, `this.rarity`, а в `use()` — изменяем `this.durability`. Без `this` методы не знали бы, с данными какого именно объекта работают.

---

### Вопрос 2: Как работает модификатор доступа `#` в JavaScript?

Символ `#` перед именем поля или метода делает его **приватным на уровне языка**. Это не просто соглашение об именовании — движок V8 физически запрещает доступ к таким полям снаружи класса.

```js
class BankAccount {
  #balance = 0;        // приватное поле — снаружи недоступно
  #log(msg) {          // приватный метод — снаружи недоступен
    console.log(msg);
  }

  deposit(amount) {
    this.#balance += amount;           // внутри класса — OK
    this.#log(`Пополнено на ${amount}`);
  }

  getBalance() {
    return this.#balance; // публичный геттер для чтения
  }
}

const acc = new BankAccount();
acc.deposit(500);
console.log(acc.getBalance()); // 500 — OK
console.log(acc.#balance);     // SyntaxError! Нет доступа снаружи
```

**Ключевые особенности приватных полей:**

- **Не наследуются подклассами** — каждый класс имеет собственное пространство приватных имён.
- **Невидимы** через `Object.keys()`, `JSON.stringify()`, `Proxy` — полная инкапсуляция.
- **Ошибка на этапе парсинга** — `SyntaxError` возникает ещё до выполнения кода, а не во время.
- Доступны **только внутри тела того класса**, где они объявлены.

В отличие от соглашения `_privateField` (одно подчёркивание), которое является просто договорённостью и ничего не защищает, поля с `#` действительно закрыты от внешнего доступа.

---

### Вопрос 3: В чём разница между классами и функциями-конструкторами?

Синтаксически классы — это **«синтаксический сахар»** поверх прототипного наследования, однако между ними есть принципиальные различия:

| Аспект | `class` | Функция-конструктор |
|---|---|---|
| **Hoisting (подъём)** | Не поднимается — нельзя использовать до объявления | Поднимается — можно вызвать до объявления |
| **Strict mode** | Тело класса всегда в строгом режиме автоматически | Нужно явно добавить `'use strict'` |
| **Приватные поля** | Поддерживаются через `#field` на уровне языка | Эмулируются через замыкания (не настоящая приватность) |
| **Наследование** | `extends` / `super` — лаконично и безопасно | `Object.create()` + `ParentFn.call(this)` — вручную |
| **Вызов без `new`** | `TypeError` — невозможно вызвать без `new` | Работает, но создаёт глобальные переменные (опасно) |
| **Читаемость** | Ближе к классическому ООП, понятнее в командной разработке | Требует понимания прототипов |
| **Под капотом** | Те же прототипы — `function` + `prototype` | Явная работа с прототипами |

**Пример: одно и то же через класс и конструктор:**

```js
// Через class:
class Animal {
  constructor(name) { this.name = name; }
  speak() { return `${this.name} издаёт звук`; }
}
class Dog extends Animal {
  speak() { return `${this.name} лает`; }
}

// Через функцию-конструктор (то же самое, но вручную):
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} издаёт звук`; };

function Dog(name) { Animal.call(this, name); } // вызов "родителя"
Dog.prototype = Object.create(Animal.prototype); // настройка наследования
Dog.prototype.constructor = Dog;                 // восстановление конструктора
Dog.prototype.speak = function() { return `${this.name} лает`; };
```

**Вывод:** в современном коде рекомендуется использовать классы — они читаемее, безопаснее и ближе к стандартам других языков. Функции-конструкторы важно знать для понимания основ JavaScript и работы со старым legacy-кодом.

---

## 6. Список использованных источников

1. **MDN Web Docs — Classes** — официальная документация Mozilla по классам в JavaScript.
   https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Classes

2. **MDN Web Docs — Inheritance and the prototype chain** — подробное объяснение прототипного наследования.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain

3. **MDN Web Docs — Optional chaining (`?.`)** — описание оператора опциональной цепочки.
   https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Operators/Optional_chaining

4. **MDN Web Docs — Private class fields (`#`)** — описание приватных полей классов.
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields

5. **Eloquent JavaScript (3rd ed.) — Marijn Haverbeke.** Глава 6: The Secret Life of Objects.
   https://eloquentjavascript.net/06_object.html

6. **You Don't Know JS: this & Object Prototypes — Kyle Simpson.** Подробное исследование работы `this` и прототипов.
   https://github.com/getify/You-Dont-Know-JS

7. **JSDoc Reference** — официальная документация стандарта комментирования JSDoc.
   https://jsdoc.app/

8. **Node.js Documentation** — официальный сайт среды выполнения Node.js.
   https://nodejs.org/en/docs

---

## 7. Дополнительные важные аспекты

### 7.1 Как работает наследование под капотом

Когда мы пишем `class Weapon extends Item`, JavaScript автоматически выстраивает **цепочку прототипов**:

```
экземпляр bow → Weapon.prototype → Item.prototype → Object.prototype → null
```

Когда вызывается `bow.getInfo()`, движок ищет метод по цепочке:
1. Сначала в самом объекте `bow` — нет.
2. Затем в `Weapon.prototype` — находит переопределённый `getInfo()` — стоп.
3. Если бы не нашёл — поднялся бы до `Item.prototype`.

Именно благодаря этому вызов `super.getInfo()` внутри `Weapon` обращается к реализации родителя. Ключевое слово `super` — это синтаксический способ явно указать на прототип родительского класса.

### 7.2 Геттеры, сеттеры и валидация данных

В реальных проектах поля объектов часто защищают через геттеры и сеттеры с валидацией:

```js
class Item {
  #weight;

  constructor(name, weight, rarity) {
    this.name = name;
    this.setWeight(weight); // используем сеттер сразу в конструкторе
    this.rarity = rarity;
  }

  setWeight(newWeight) {
    if (typeof newWeight !== "number" || newWeight <= 0) {
      throw new Error("Вес должен быть положительным числом");
    }
    this.#weight = newWeight;
  }

  get weight() { return this.#weight; } // геттер для чтения
}
```

Паттерн **геттер/сеттер** позволяет контролировать чтение и запись значений, делая API класса более надёжным и предсказуемым.

### 7.3 Зачем нужен JSDoc

Документирование кода в формате JSDoc решает несколько практических задач:

- **Автодополнение в IDE** — VS Code и WebStorm читают JSDoc и показывают подсказки при вызове методов.
- **Статическая проверка типов** — TypeScript умеет использовать JSDoc без переписывания кода на TS.
- **Автогенерация документации** — инструмент JSDoc CLI создаёт HTML-документацию по комментариям автоматически.
- **Читаемость для команды** — другие разработчики видят назначение метода и типы параметров без чтения тела функции.

### 7.4 Отличие `?.` от старых способов проверки

До появления опциональной цепочки (ES2020) разработчики писали громоздкие условия:

```js
// Старый способ — многословно
const info = item !== null && item !== undefined ? item.getInfo() : undefined;

// Через &&:
const info2 = item && item.getInfo();
// Проблема: вернёт item, если item === 0 или item === "" (falsy, но не null/undefined)

// Современный способ — лаконично и точно:
const info3 = item?.getInfo();

// Можно цепочить сколько угодно:
const dmg = inventory?.weapons?.[0]?.damage; // безопасный глубокий доступ
```

Оператор `?.` корректно обрабатывает только `null` и `undefined`, не трогая другие falsy-значения (`0`, `''`, `false`). Это делает его более точным инструментом, чем проверка через `&&`.

