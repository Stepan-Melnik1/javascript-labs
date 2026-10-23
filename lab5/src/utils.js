/**
 * @module utils
 * @description Вспомогательные утилиты: генерация ID и форматирование дат.
 */

/**
 * Генерирует уникальный идентификатор на основе текущего времени и случайного числа.
 * @returns {string} Уникальный ID вида "txn_<timestamp>_<random>".
 */
export function generateId() {
  return `txn_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Форматирует объект Date в строку вида "ДД.ММ.ГГГГ ЧЧ:ММ".
 * @param {Date} date - Объект даты для форматирования.
 * @returns {string} Отформатированная строка даты и времени.
 */
export function formatDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

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

/**
 * Форматирует число как строку с символом валюты.
 * @param {number} amount - Сумма транзакции.
 * @returns {string} Форматированная строка, например "+1 200.00 ₽" или "-500.00 ₽".
 */
export function formatAmount(amount) {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${amount.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₽`;
}
