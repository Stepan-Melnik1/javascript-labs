// ============================================================
// Шаг 1. Массив транзакций
// ============================================================
/** @typedef {{
 *   transaction_id: string,
 *   transaction_date: string,
 *   transaction_amount: number,
 *   transaction_type: string,
 *   transaction_description: string,
 *   merchant_name: string,
 *   card_type: string
 * }} Transaction */

/** @type {Transaction[]} */
const transactions = [
  {
    transaction_id: "1",
    transaction_date: "2019-01-01",
    transaction_amount: 100.0,
    transaction_type: "debit",
    transaction_description: "Payment for groceries",
    merchant_name: "SuperMart",
    card_type: "Visa",
  },
  {
    transaction_id: "2",
    transaction_date: "2019-01-02",
    transaction_amount: 50.0,
    transaction_type: "credit",
    transaction_description: "Refund for returned item",
    merchant_name: "OnlineShop",
    card_type: "MasterCard",
  },
  {
    transaction_id: "3",
    transaction_date: "2019-01-03",
    transaction_amount: 75.0,
    transaction_type: "debit",
    transaction_description: "Dinner with friends",
    merchant_name: "RestaurantABC",
    card_type: "Amex",
  },
  {
    transaction_id: "4",
    transaction_date: "2019-02-10",
    transaction_amount: 200.0,
    transaction_type: "debit",
    transaction_description: "Electronics purchase",
    merchant_name: "TechStore",
    card_type: "Visa",
  },
  {
    transaction_id: "5",
    transaction_date: "2019-02-14",
    transaction_amount: 30.0,
    transaction_type: "credit",
    transaction_description: "Cashback reward",
    merchant_name: "BankService",
    card_type: "MasterCard",
  },
  {
    transaction_id: "6",
    transaction_date: "2019-02-20",
    transaction_amount: 120.0,
    transaction_type: "debit",
    transaction_description: "Monthly gym membership",
    merchant_name: "FitLife",
    card_type: "Visa",
  },
  {
    transaction_id: "7",
    transaction_date: "2019-03-05",
    transaction_amount: 60.0,
    transaction_type: "credit",
    transaction_description: "Refund for cancelled flight",
    merchant_name: "AirlineXYZ",
    card_type: "Amex",
  },
  {
    transaction_id: "8",
    transaction_date: "2019-03-15",
    transaction_amount: 45.0,
    transaction_type: "debit",
    transaction_description: "Book purchase",
    merchant_name: "Bookstore",
    card_type: "MasterCard",
  },
  {
    transaction_id: "9",
    transaction_date: "2019-03-22",
    transaction_amount: 90.0,
    transaction_type: "debit",
    transaction_description: "Restaurant dinner",
    merchant_name: "RestaurantABC",
    card_type: "Visa",
  },
  {
    transaction_id: "120",
    transaction_date: "2019-04-30",
    transaction_amount: 85.0,
    transaction_type: "debit",
    transaction_description: "Home office supplies",
    merchant_name: "OfficeSupplyStoreABC",
    card_type: "Amex",
  },
];

// ============================================================
// Шаг 2. Функции для анализа транзакций
// ============================================================
/**
 * Возвращает массив уникальных типов транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {string[]} Массив уникальных типов транзакций.
 */
// Используем Set для получения уникальных значений, а затем превращаем его обратно в массив.
function getUniqueTransactionTypes(transactions) {
  return [...new Set(transactions.map((t) => t.transaction_type))];
}

/**
 * Вычисляет сумму всех транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {number} Общая сумма транзакций.
 */
// Используем reduce для суммирования всех значений transaction_amount.
function calculateTotalAmount(transactions) {
  return transactions.reduce((sum, t) => sum + t.transaction_amount, 0);
}

/**
 * Вычисляет общую сумму транзакций за указанный год, месяц и/или день.
 * Все параметры даты необязательны — расчёт ведётся по тем, что переданы.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {number} [year] - Год (необязательно).
 * @param {number} [month] - Месяц 1–12 (необязательно).
 * @param {number} [day] - День 1–31 (необязательно).
 * @returns {number} Сумма транзакций за указанный период.
 */
// Фильтруем транзакции по дате, сравнивая год, месяц и день с переданными параметрами. Затем суммируем отфильтрованные транзакции.
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

/**
 * Возвращает транзакции указанного типа.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {string} type - Тип транзакции: "debit" или "credit".
 * @returns {Transaction[]} Отфильтрованный массив транзакций.
 */
function getTransactionByType(transactions, type) {
  return transactions.filter((t) => t.transaction_type === type);
}

/**
 * Возвращает массив транзакций в указанном диапазоне дат (включительно).
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {string} startDate - Начальная дата в формате "YYYY-MM-DD".
 * @param {string} endDate - Конечная дата в формате "YYYY-MM-DD".
 * @returns {Transaction[]} Транзакции в диапазоне дат.
 */
function getTransactionsInDateRange(transactions, startDate, endDate) {
  return transactions.filter(
    (t) => t.transaction_date >= startDate && t.transaction_date <= endDate
  );
}

/**
 * Возвращает массив транзакций, совершённых у указанного продавца.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {string} merchantName - Название продавца / магазина.
 * @returns {Transaction[]} Транзакции указанного продавца.
 */
function getTransactionsByMerchant(transactions, merchantName) {
  return transactions.filter((t) => t.merchant_name === merchantName);
}

/**
 * Возвращает среднее значение суммы транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {number} Среднее значение, или 0 если массив пуст.
 */
function calculateAverageTransactionAmount(transactions) {
  if (transactions.length === 0) return 0;
  return calculateTotalAmount(transactions) / transactions.length;
}

/**
 * Возвращает транзакции с суммой в заданном диапазоне (включительно).
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {number} minAmount - Минимальная сумма.
 * @param {number} maxAmount - Максимальная сумма.
 * @returns {Transaction[]} Транзакции в диапазоне сумм.
 */
function getTransactionsByAmountRange(transactions, minAmount, maxAmount) {
  return transactions.filter(
    (t) =>
      t.transaction_amount >= minAmount && t.transaction_amount <= maxAmount
  );
}

/**
 * Вычисляет общую сумму дебетовых транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {number} Сумма дебетовых транзакций.
 */
function calculateTotalDebitAmount(transactions) {
  return calculateTotalAmount(getTransactionByType(transactions, "debit"));
}

/**
 * Возвращает номер месяца, в котором было больше всего транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {number|null} Номер месяца (1–12), или null если массив пуст.
 */
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

/**
 * Возвращает номер месяца, в котором было больше всего дебетовых транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {number|null} Номер месяца (1–12), или null если нет дебетовых транзакций.
 */
function findMostDebitTransactionMonth(transactions) {
  return findMostTransactionsMonth(getTransactionByType(transactions, "debit"));
}

/**
 * Определяет, каких транзакций больше: дебетовых, кредитовых или поровну.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {"debit"|"credit"|"equal"} Результат сравнения.
 */
function mostTransactionTypes(transactions) {
  const debitCount = getTransactionByType(transactions, "debit").length;
  const creditCount = getTransactionByType(transactions, "credit").length;
  if (debitCount > creditCount) return "debit";
  if (creditCount > debitCount) return "credit";
  return "equal";
}

/**
 * Возвращает массив транзакций, совершённых до указанной даты (не включая её).
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {string} date - Дата в формате "YYYY-MM-DD".
 * @returns {Transaction[]} Транзакции до указанной даты.
 */
function getTransactionsBeforeDate(transactions, date) {
  return transactions.filter((t) => t.transaction_date < date);
}

/**
 * Возвращает транзакцию по её уникальному идентификатору.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @param {string} id - Уникальный идентификатор транзакции.
 * @returns {Transaction|null} Найденная транзакция или null.
 */
function findTransactionById(transactions, id) {
  return transactions.find((t) => t.transaction_id === id) || null;
}

/**
 * Возвращает новый массив, содержащий только описания транзакций.
 * @param {Transaction[]} transactions - Массив транзакций.
 * @returns {string[]} Массив описаний транзакций.
 */
function mapTransactionDescriptions(transactions) {
  return transactions.map((t) => t.transaction_description);
}

// ============================================================
// Шаг 3. Тестирование функций
// ============================================================

console.log("=".repeat(60));
console.log("       ТЕСТИРОВАНИЕ НА ОСНОВНОМ МАССИВЕ ТРАНЗАКЦИЙ");
console.log("=".repeat(60));

console.log("\n1. Уникальные типы транзакций:");
console.log(getUniqueTransactionTypes(transactions));

console.log("\n2. Общая сумма всех транзакций:");
console.log(calculateTotalAmount(transactions));

console.log("\n3. Сумма транзакций за 2019 год, январь:");
console.log(calculateTotalAmountByDate(transactions, 2019, 1));

console.log("\n4. Сумма транзакций за конкретный день (2019-01-01):");
console.log(calculateTotalAmountByDate(transactions, 2019, 1, 1));

console.log("\n5. Транзакции типа 'debit':");
console.log(getTransactionByType(transactions, "debit"));

console.log("\n6. Транзакции в диапазоне дат (2019-01-01 — 2019-02-28):");
console.log(getTransactionsInDateRange(transactions, "2019-01-01", "2019-02-28"));

console.log("\n7. Транзакции продавца 'RestaurantABC':");
console.log(getTransactionsByMerchant(transactions, "RestaurantABC"));

console.log("\n8. Среднее значение транзакций:");
console.log(calculateAverageTransactionAmount(transactions));

console.log("\n9. Транзакции суммой от 50 до 100:");
console.log(getTransactionsByAmountRange(transactions, 50, 100));

console.log("\n10. Общая сумма дебетовых транзакций:");
console.log(calculateTotalDebitAmount(transactions));

console.log("\n11. Месяц с наибольшим количеством транзакций:");
console.log(findMostTransactionsMonth(transactions));

console.log("\n12. Месяц с наибольшим количеством дебетовых транзакций:");
console.log(findMostDebitTransactionMonth(transactions));

console.log("\n13. Каких транзакций больше:");
console.log(mostTransactionTypes(transactions));

console.log("\n14. Транзакции до даты '2019-02-15':");
console.log(getTransactionsBeforeDate(transactions, "2019-02-15"));

console.log("\n15. Транзакция по ID '120':");
console.log(findTransactionById(transactions, "120"));

console.log("\n16. Описания всех транзакций:");
console.log(mapTransactionDescriptions(transactions));

// ============================================================
// [extra] Тестирование на пустом массиве
// ============================================================

console.log("\n" + "=".repeat(60));
console.log("       [EXTRA] ТЕСТИРОВАНИЕ НА ПУСТОМ МАССИВЕ");
console.log("=".repeat(60));

const emptyTransactions = [];

console.log("\n1. Уникальные типы:", getUniqueTransactionTypes(emptyTransactions));
console.log("2. Общая сумма:", calculateTotalAmount(emptyTransactions));
console.log("3. Среднее значение:", calculateAverageTransactionAmount(emptyTransactions));
console.log("4. Самый активный месяц:", findMostTransactionsMonth(emptyTransactions));
console.log("5. Каких транзакций больше:", mostTransactionTypes(emptyTransactions));
console.log("6. Найти по ID '1':", findTransactionById(emptyTransactions, "1"));
console.log("7. Описания:", mapTransactionDescriptions(emptyTransactions));

// ============================================================
// [extra] Тестирование на массиве с одной транзакцией
// ============================================================

console.log("\n" + "=".repeat(60));
console.log("   [EXTRA] ТЕСТИРОВАНИЕ НА МАССИВЕ С ОДНОЙ ТРАНЗАКЦИЕЙ");
console.log("=".repeat(60));

const singleTransaction = [
  {
    transaction_id: "42",
    transaction_date: "2019-06-15",
    transaction_amount: 250.0,
    transaction_type: "debit",
    transaction_description: "Single test transaction",
    merchant_name: "TestShop",
    card_type: "Visa",
  },
];

console.log("\n1. Уникальные типы:", getUniqueTransactionTypes(singleTransaction));
console.log("2. Общая сумма:", calculateTotalAmount(singleTransaction));
console.log("3. Среднее значение:", calculateAverageTransactionAmount(singleTransaction));
console.log("4. Самый активный месяц:", findMostTransactionsMonth(singleTransaction));
console.log("5. Каких транзакций больше:", mostTransactionTypes(singleTransaction));
console.log("6. Найти по ID '42':", findTransactionById(singleTransaction, "42"));
console.log("7. Описания:", mapTransactionDescriptions(singleTransaction));
