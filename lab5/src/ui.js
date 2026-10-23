/**
 * @module ui
 * @description Модуль для работы с DOM: отрисовка строк таблицы,
 * обновление итога и отображение деталей транзакции.
 */

import { formatDate, formatAmount, truncateWords } from './utils.js';

/**
 * Добавляет строку транзакции в таблицу.
 * Строка окрашивается в зелёный (положительная сумма) или красный (отрицательная).
 *
 * @param {import('./transactions.js').Transaction} transaction - Объект транзакции.
 * @returns {void}
 */
export function renderTransactionRow(transaction) {
  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');

  emptyState.classList.remove('visible');

  const tr = document.createElement('tr');
  tr.dataset.id = transaction.id;
  tr.classList.add(transaction.amount >= 0 ? 'positive' : 'negative');

  tr.innerHTML = `
    <td class="date-cell">${formatDate(transaction.date)}</td>
    <td>${escapeHtml(transaction.category)}</td>
    <td>${escapeHtml(truncateWords(transaction.description))}</td>
    <td class="amount-cell">${formatAmount(transaction.amount)}</td>
    <td><button class="btn-delete" data-id="${transaction.id}">удалить</button></td>
  `;

  tbody.appendChild(tr);
}

/**
 * Удаляет строку таблицы по идентификатору транзакции.
 * Если строк больше не осталось, показывает заглушку "пусто".
 *
 * @param {string} id - Идентификатор транзакции.
 * @returns {void}
 */
export function removeTransactionRow(id) {
  const row = document.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();

  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  if (tbody.children.length === 0) {
    emptyState.classList.add('visible');
  }
}

/**
 * Обновляет отображение общей суммы транзакций в шапке.
 * Цвет меняется в зависимости от знака суммы.
 *
 * @param {number} total - Общая сумма всех транзакций.
 * @returns {void}
 */
export function renderTotal(total) {
  const el = document.getElementById('totalAmount');
  el.textContent = formatAmount(total);
  el.style.color = total >= 0 ? 'var(--green)' : 'var(--red)';
}

/**
 * Отображает подробную информацию о транзакции в блоке деталей.
 * При повторном клике на ту же строку — сбрасывает выделение и скрывает детали.
 *
 * @param {import('./transactions.js').Transaction|null} transaction - Объект транзакции или null для сброса.
 * @returns {void}
 */
export function renderTransactionDetail(transaction) {
  const container = document.getElementById('transactionDetail');

  if (!transaction) {
    container.innerHTML = '<span class="detail-placeholder">Нажмите на строку в таблице, чтобы увидеть детали.</span>';
    return;
  }

  const amountClass = transaction.amount >= 0 ? 'pos' : 'neg';

  container.innerHTML = `
    <div class="detail-grid">
      <span class="detail-key">ID</span>
      <span class="detail-val"><code>${escapeHtml(transaction.id)}</code></span>

      <span class="detail-key">Дата</span>
      <span class="detail-val">${formatDate(transaction.date)}</span>

      <span class="detail-key">Категория</span>
      <span class="detail-val">${escapeHtml(transaction.category)}</span>

      <span class="detail-key">Сумма</span>
      <span class="detail-val ${amountClass}">${formatAmount(transaction.amount)}</span>

      <span class="detail-key">Описание</span>
      <span class="detail-val">${escapeHtml(transaction.description)}</span>
    </div>
  `;
}

/**
 * Подсвечивает выбранную строку таблицы и снимает выделение с остальных.
 * @param {string|null} id - ID строки для выделения или null для сброса.
 * @returns {void}
 */
export function highlightRow(id) {
  document.querySelectorAll('#tableBody tr').forEach((row) => {
    row.classList.toggle('selected', row.dataset.id === id);
  });
}

/**
 * Экранирует HTML-символы для безопасной вставки пользовательского текста в DOM.
 * @param {string} str - Исходная строка.
 * @returns {string} Экранированная строка.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
