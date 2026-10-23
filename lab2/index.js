// ============================================================
// 1.1 printArray — вывод элементов с подробным форматом
// ============================================================

/** 
 * Выводит элементы массива в консоль в формате "Element N: value X"
 * @param {Array} array - массив для вывода
 */

function printArray(array) {
  // Проверяем, что нам передали именно массив
  if (!Array.isArray(array)) {
    throw new TypeError("Аргумент должен быть массивом");  // Если это не массив, выбрасываем ошибку
  }
  
  for (let i = 0; i < array.length; i++) {
    console.log(`Element ${i}: value ${array[i]}`);
    //            ^^^^^^^^           ^^^^^^^^
    //            индекс             значение элемента
  }
}

// ============================================================
// 1.1 printArray1 — вывод элементов в кратком формате
// ============================================================

/**
 * Выводит элементы массива в консоль в формате "N: X"
 * @param {Array} array - массив для вывода
 */

function printArray1(array) {
  if (!Array.isArray(array)) {
    throw new TypeError("Аргумент должен быть массивом");
  }

  for (let i = 0; i < array.length; i++) {
    console.log(`${i}:  ${array[i]}`);
  }
}

// ============================================================
// 1.2 forEach — вызов колбэка для каждого элемента
// ============================================================

/**
 * Выполняет колбэк для каждого элемента массива.
 * Ничего не возвращает (undefined).
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (element, index, array) => void
 * @returns {undefined}
 *
 * @example
 * forEach([1, 2, 3], (el, i) => console.log(el, i));
 */

function forEach(array, callback) {
  // Проверка 1: убеждаемся, что первый аргумент — массив
  if (!Array.isArray(array)) {
    throw new TypeError("Первый аргумент должен быть массивом");
  }
  // Проверка 2: убеждаемся, что второй аргумент — функция
  if (typeof callback !== "function") {
    throw new TypeError("Второй аргумент должен быть функцией");
  }

  // Проходим по каждому элементу массива
  for (let i = 0; i < array.length; i++) {
    // Вызываем колбэк и передаём ему: array[i] — текущий элемент, i — его индекс, array — коллбэк видит весь массив целиком
    callback(array[i], i, array);
  }

  // forEach ничего не возвращает — просто выходим из функции.
  // (неявный return undefined)
}

// ============================================================
// 2. map — создаёт НОВЫЙ массив из преобразованных элементов
// ============================================================

/**
 * Преобразует массив с помощью callback
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция преобразования
 * @returns {Array} новый массив
 */

function map(array, callback) {
    // Проверки
    if (!Array.isArray(array)) {
        throw new TypeError("Первый аргумент должен быть массивом");
    }
    if (typeof callback !== "function") {
        throw new TypeError("Второй аргумент должен быть функцией");
    }

    // Шаг 1: создаём пустой массив для результатов
    const result = [];

    for (let i = 0; i < array.length; i++) {
        // Шаг 2: push добавляет элемент в конец массива
        result.push(callback(array[i], i, array));
    }

    // Шаг 3: возвращаем заполненную корзину
    return result;
}

// ============================================================
// 3. filter — оставляет только те элементы, где колбэк = true
// ============================================================

/**
 * Возвращает новый массив из элементов, прошедших проверку колбэком.
 *
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (element, index, array) => boolean
 * @returns {Array} новый массив (может быть короче исходного)
 *
 * @example
 * filter([1, 2, 3, 4], el => el % 2 === 0); // [2, 4]
 */

function filter(array, callback) {
    if (!Array.isArray(array)) {
        throw new TypeError("Первый аргумент должен быть массивом");
    }
    if (typeof callback !== "function") {
        throw new TypeError("Второй аргумент должен быть функцией");
    }
    // Пустая корзина для подходящих элементов
    const result = [];

    for (let i = 0; i < array.length; i++) {

        // Если число чётное, то callback вернёт true, и мы положим его в корзину
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }
    return result;
}

// ============================================================
// 4. find — возвращает ПЕРВЫЙ подходящий элемент
// ============================================================

/**
 * Находит первый элемент массива, для которого колбэк возвращает true.
 *
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (element, index, array) => boolean
 * @returns {*} первый подходящий элемент или undefined
 *
 * @example
 * find([1, 3, 4, 6], el => el % 2 === 0); // 4
 */
function find(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError("Первый аргумент должен быть массивом");
  }
  if (typeof callback !== "function") {
    throw new TypeError("Второй аргумент должен быть функцией");
  }

  for (let i = 0; i < array.length; i++) {
    // Если колбэк говорит "да" для этого элемента...
    if (callback(array[i], i, array)) {
      return array[i]; // ...немедленно возвращаем его и ВЫХОДИМ из функции
      // Цикл прекращается! Мы нашли то, что искали.
    }
  }

  // Если дошли до конца и ничего не нашли — возвращаем undefined
  return undefined;
}

// ============================================================
// 5. some — есть ли ХОТЯ БЫ ОДИН подходящий элемент?
// ============================================================

/**
 * Проверяет, удовлетворяет ли хотя бы один элемент условию колбэка.
 *
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (element, index, array) => boolean
 * @returns {boolean} true если нашёлся хоть один, иначе false
 *
 * @example
 * some([1, 3, 5, 4], el => el % 2 === 0); // true (есть 4)
 */
function some(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError("Первый аргумент должен быть массивом");
  }
  if (typeof callback !== "function") {
    throw new TypeError("Второй аргумент должен быть функцией");
  }

  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      return true; // Нашли! Дальше проверять не нужно.
    }
  }

  // Прошли весь массив и ничего подходящего не нашли
  return false;
}

// ============================================================
// 6. every — ВСЕ ли элементы подходят под условие?
// ============================================================

/**
 * Проверяет, удовлетворяют ли все элементы условию колбэка.
 *
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (element, index, array) => boolean
 * @returns {boolean} true если все подходят, false если хоть один нет
 *
 * @example
 * every([2, 4, 6], el => el % 2 === 0); // true (все чётные)
 */
function every(array, callback) {
  if (!Array.isArray(array)) {
    throw new TypeError("Первый аргумент должен быть массивом");
  }
  if (typeof callback !== "function") {
    throw new TypeError("Второй аргумент должен быть функцией");
  }

  for (let i = 0; i < array.length; i++) {
    if (!callback(array[i], i, array)) {
      // Нашли элемент, который НЕ подходит — сразу возвращаем false
      // every работает наоборот по сравнению с some:
      // some останавливается на true, every — на false
      return false;
    }
  }

  // Все элементы прошли проверку!
  return true;
}

// ============================================================
// 7. reduce — накапливает результат, обходя массив
// ============================================================

/**
 * Последовательно обрабатывает элементы массива, накапливая результат.
 *
 * @param {Array} array - исходный массив
 * @param {Function} callback - функция вида (accumulator, element, index, array) => newAccumulator
 * @param {*} [initialValue] - начальное значение аккумулятора (необязательно)
 * @returns {*} итоговое значение аккумулятора
 *
 * @example
 * reduce([1, 2, 3], (acc, el) => acc + el, 0); // 6
 */
function reduce(array, callback, initialValue) {
  if (!Array.isArray(array)) {
    throw new TypeError("Первый аргумент должен быть массивом");
  }
  if (typeof callback !== "function") {
    throw new TypeError("Второй аргумент должен быть функцией");
  }

  // Проверяем: передали ли нам начальное значение?
  // arguments.length считает количество реально переданных аргументов
  const hasInitialValue = arguments.length >= 3;

  // Граничный случай: пустой массив без начального значения
  if (array.length === 0 && !hasInitialValue) {
    return undefined;
  }

  // Объявляем аккумулятор и начальный индекс
  let accumulator;
  let startIndex;

  if (hasInitialValue) {
    // Если initialValue передан — используем его как стартовое значение
    // и начинаем обход С ПЕРВОГО элемента (индекс 0)
    accumulator = initialValue;
    startIndex = 0;
  } else {
    // Если initialValue НЕ передан — первый элемент становится стартовым значением
    // и начинаем обход СО ВТОРОГО элемента (индекс 1)
    accumulator = array[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < array.length; i++) {
    // Колбэк получает текущий аккумулятор и элемент,
    // и возвращает НОВОЕ значение аккумулятора
    accumulator = callback(accumulator, array[i], i, array);
    //            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //            перезаписываем аккумулятор после каждого шага
  }

  return accumulator;
}

console.log("---Задание 1.1 а ---");
// --- printArray ---
printArray(["яблоко", "банан", "вишня"]);
// Element 0: value яблоко
// Element 1: value банан
// Element 2: value вишня

console.log("\n---Задание 1.1 б ---");
printArray1(["яблоко", "банан", "вишня"]);
// 0:  яблоко
// 1:  банан
// 2:  вишня

console.log("\n---Задание 1.2 ---");
// --- forEach ---
forEach([10, 20, 30], (element, index) => {
  console.log(`Element: ${element}, Index: ${index}`);
});
// Element: 10, Index: 0
// Element: 20, Index: 1
// Element: 30, Index: 2

console.log("\n--- Задание 2 ---");
// --- map ---
const doubled = map([1, 2, 3], (el) => el * 2);
console.log(doubled); // [2, 4, 6]

console.log("\n--- Задание 3 ---");
// --- filter ---
const evens = filter([1, 2, 3, 4, 5], (el) => el % 2 === 0);
console.log(evens); // [2, 4]

console.log("\n--- Задание 4 ---");
// --- find ---
const firstBig = find([1, 2, 10, 20], (el) => el > 5);
console.log(firstBig); // 10

console.log("\n--- Задание 5 ---");
// --- some ---
console.log(some([1, 3, 5, 4], (el) => el % 2 === 0)); // true
console.log(some([1, 3, 5], (el) => el % 2 === 0));    // false

console.log("\n--- Задание 6 ---");
// --- every ---
console.log(every([2, 4, 6], (el) => el % 2 === 0)); // true
console.log(every([2, 3, 6], (el) => el % 2 === 0)); // false

console.log("\n--- Задание 7 ---");
// --- reduce ---
const sum = reduce([1, 2, 3, 4, 5], (acc, el) => acc + el, 0);
console.log(sum); // 15

const sumNoInit = reduce([1, 2, 3], (acc, el) => acc + el);
console.log(sumNoInit); // 6 (1 стал аккумулятором, начали со 2)

console.log(reduce([], (acc, el) => acc + el)); // undefined








