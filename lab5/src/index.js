/**
 * @module index
 * @description Главный модуль приложения. Инициализирует обработчики событий,
 * связывает форму с логикой добавления транзакций, управляет удалением
 * и отображением деталей транзакции.
 */

import { generateId } from './utils.js';
import {
  addTransaction,
  removeTransaction,
  getTransactionById,
  calculateTotal,
} from './transactions.js';
import {
  renderTransactionRow,
  removeTransactionRow,
  renderTotal,
  renderTransactionDetail,
  highlightRow,
} from './ui.js';

/** @type {string|null} ID текущей выбранной транзакции (для деталей) */
let selectedId = null;

// ─── Инициализация при загрузке страницы ────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initTableEvents();
  updateTotal();
  showEmptyState();
});

// ─── Форма ──────────────────────────────────────────────────────────────────

/**
 * Инициализирует обработчик отправки формы добавления транзакции.
 * @returns {void}
 */
function initForm() {
  const form = document.getElementById('transactionForm');
  form.addEventListener('submit', handleFormSubmit);
}

/**
 * Обрабатывает отправку формы: валидирует поля, создаёт транзакцию,
 * обновляет таблицу и сумму, сбрасывает форму.
 *
 * @param {SubmitEvent} event - Событие отправки формы.
 * @returns {void}
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const amountInput = document.getElementById('amount');
  const categoryInput = document.getElementById('category');
  const descriptionInput = document.getElementById('description');

  const isValid = validateForm(amountInput, categoryInput, descriptionInput);
  if (!isValid) return;

  /** @type {import('./transactions.js').Transaction} */
  const transaction = {
    id: generateId(),
    date: new Date(),
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    description: descriptionInput.value.trim(),
  };

  addTransaction(transaction);
  renderTransactionRow(transaction);
  updateTotal();

  event.target.reset();
  clearErrors();
}

// ─── Валидация ───────────────────────────────────────────────────────────────

/**
 * Валидирует поля формы и показывает сообщения об ошибках.
 *
 * @param {HTMLInputElement}  amountInput      - Поле суммы.
 * @param {HTMLSelectElement} categoryInput    - Поле категории.
 * @param {HTMLInputElement}  descriptionInput - Поле описания.
 * @returns {boolean} true, если все поля заполнены корректно.
 */
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

/**
 * Показывает сообщение об ошибке для конкретного поля.
 *
 * @param {string}      errorElId - ID элемента для вывода ошибки.
 * @param {HTMLElement} inputEl   - Поле ввода, которое нужно пометить.
 * @param {string}      message   - Текст ошибки.
 * @returns {void}
 */
function showError(errorElId, inputEl, message) {
  document.getElementById(errorElId).textContent = message;
  inputEl.classList.add('error');
}

/**
 * Очищает все сообщения об ошибках и убирает CSS-класс error с полей.
 * @returns {void}
 */
function clearErrors() {
  ['amountError', 'categoryError', 'descriptionError'].forEach((id) => {
    document.getElementById(id).textContent = '';
  });
  ['amount', 'category', 'description'].forEach((id) => {
    document.getElementById(id).classList.remove('error');
  });
}

// ─── Таблица: удаление и детали ──────────────────────────────────────────────

/**
 * Инициализирует делегированный обработчик событий на таблице:
 * — клик по кнопке "удалить" → удаление транзакции;
 * — клик по строке → отображение деталей транзакции.
 *
 * @returns {void}
 */
function initTableEvents() {
  const table = document.getElementById('transactionsTable');

  table.addEventListener('click', (event) => {
    // Удаление транзакции
    const deleteBtn = event.target.closest('.btn-delete');
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;
      handleDelete(id);
      return;
    }

    // Отображение деталей при клике на строку
    const row = event.target.closest('tr[data-id]');
    if (row) {
      handleRowClick(row.dataset.id);
    }
  });
}

/**
 * Удаляет транзакцию из данных и DOM, обновляет общую сумму.
 * Если удалена выбранная транзакция — сбрасывает панель деталей.
 *
 * @param {string} id - Идентификатор транзакции для удаления.
 * @returns {void}
 */
function handleDelete(id) {
  removeTransaction(id);
  removeTransactionRow(id);
  updateTotal();

  if (selectedId === id) {
    selectedId = null;
    renderTransactionDetail(null);
    highlightRow(null);
  }
}

/**
 * Обрабатывает клик по строке таблицы:
 * показывает детали транзакции или скрывает их при повторном клике.
 *
 * @param {string} id - Идентификатор транзакции из data-id строки.
 * @returns {void}
 */
function handleRowClick(id) {
  if (selectedId === id) {
    // Повторный клик — сбрасываем выделение
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

// ─── Общая сумма ─────────────────────────────────────────────────────────────

/**
 * Пересчитывает и отображает общую сумму всех транзакций.
 * @returns {void}
 */
function updateTotal() {
  renderTotal(calculateTotal());
}

// ─── Заглушка пустой таблицы ─────────────────────────────────────────────────

/**
 * При старте показывает заглушку, если таблица пустая.
 * @returns {void}
 */
function showEmptyState() {
  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  if (tbody.children.length === 0) {
    emptyState.classList.add('visible');
  }
}
