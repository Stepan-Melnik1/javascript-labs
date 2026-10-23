/**
 * @module transactions
 * @description Управление массивом транзакций: добавление, удаление, подсчёт.
 */

/**
 * @typedef {Object} Transaction
 * @property {string} id          - Уникальный идентификатор транзакции.
 * @property {Date}   date        - Дата и время создания транзакции.
 * @property {number} amount      - Сумма транзакции (отрицательная — расход).
 * @property {string} category    - Категория транзакции.
 * @property {string} description - Полное описание транзакции.
 */

/** @type {Transaction[]} Хранилище всех транзакций */
const transactions = [];

/**
 * Добавляет новую транзакцию в массив.
 * @param {Transaction} transaction - Объект транзакции для добавления.
 * @returns {void}
 */
export function addTransaction(transaction) {
  transactions.push(transaction);
}

/**
 * Удаляет транзакцию из массива по её идентификатору.
 * @param {string} id - Идентификатор транзакции, которую нужно удалить.
 * @returns {boolean} true, если транзакция была найдена и удалена, иначе false.
 */
export function removeTransaction(id) {
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return false;
  transactions.splice(index, 1);
  return true;
}

/**
 * Находит транзакцию по идентификатору.
 * @param {string} id - Идентификатор транзакции.
 * @returns {Transaction|undefined} Найденный объект транзакции или undefined.
 */
export function getTransactionById(id) {
  return transactions.find((t) => t.id === id);
}

/**
 * Подсчитывает общую сумму всех транзакций.
 * @returns {number} Общая сумма (может быть отрицательной).
 */
export function calculateTotal() {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Возвращает копию массива всех транзакций.
 * @returns {Transaction[]} Массив транзакций.
 */
export function getAllTransactions() {
  return [...transactions];
}
