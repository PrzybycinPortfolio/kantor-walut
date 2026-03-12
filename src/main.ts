import { fetchExchangeRates } from './api/nbp';
import { getRateStatus, formatEffectiveDate } from './utils/time';
import type { CurrencyCode, CurrencyMeta, ExchangeRates } from './types/index';

// ─── Currency config ────────────────────────────────────────────────────────

const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  PLN: { code: 'PLN', name: 'Złoty polski', flag: '🇵🇱', symbol: 'zł', color: '#dc2626' },
  EUR: { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€', color: '#2563eb' },
  USD: { code: 'USD', name: 'Dolar amerykański', flag: '🇺🇸', symbol: '$', color: '#16a34a' },
};

// ─── State ───────────────────────────────────────────────────────────────────

let rates: ExchangeRates | null = null;
let fromCurrency: CurrencyCode = 'PLN';
let toCurrency: CurrencyCode = 'EUR';

// ─── DOM helpers ─────────────────────────────────────────────────────────────

function el<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

// ─── Conversion logic ─────────────────────────────────────────────────────────

function convert(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (!rates) return 0;
  if (from === to) return amount;
  // rates.X = PLN per 1 unit of X  →  convert via PLN
  const inPLN = amount * rates[from];
  return inPLN / rates[to];
}

function formatMoney(amount: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount) + ' ' + CURRENCIES[currency].symbol;
}

// ─── UI updates ───────────────────────────────────────────────────────────────

function updateResult(): void {
  if (!rates) return;
  const amountInput = el<HTMLInputElement>('amount-input');
  const amount = parseFloat(amountInput.value) || 0;
  const result = convert(amount, fromCurrency, toCurrency);

  el('result-display').textContent = formatMoney(result, toCurrency);

  const rate1 = convert(1, fromCurrency, toCurrency);
  const from = CURRENCIES[fromCurrency];
  const to = CURRENCIES[toCurrency];
  el('rate-text').textContent =
    `1 ${from.flag} ${from.code} = ${rate1.toFixed(4)} ${to.flag} ${to.code}`;
}

function setCurrencyButtons(group: 'from' | 'to', selected: CurrencyCode): void {
  const container = el(`${group}-currencies`);
  container.querySelectorAll<HTMLButtonElement>('.currency-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.currency === selected);
  });
}

function selectFrom(currency: CurrencyCode): void {
  if (currency === toCurrency) {
    toCurrency = fromCurrency;
    setCurrencyButtons('to', toCurrency);
  }
  fromCurrency = currency;
  setCurrencyButtons('from', fromCurrency);
  updateResult();
}

function selectTo(currency: CurrencyCode): void {
  if (currency === fromCurrency) {
    fromCurrency = toCurrency;
    setCurrencyButtons('from', fromCurrency);
  }
  toCurrency = currency;
  setCurrencyButtons('to', toCurrency);
  updateResult();
}

function swap(): void {
  [fromCurrency, toCurrency] = [toCurrency, fromCurrency];
  setCurrencyButtons('from', fromCurrency);
  setCurrencyButtons('to', toCurrency);
  const swapBtn = el('swap-btn');
  swapBtn.classList.add('rotating');
  setTimeout(() => swapBtn.classList.remove('rotating'), 400);
  updateResult();
}

function updateRateCards(): void {
  if (!rates) return;
  el('eur-rate').textContent = rates.EUR.toFixed(4);
  el('eur-inverse').textContent = (1 / rates.EUR).toFixed(6);
  el('usd-rate').textContent = rates.USD.toFixed(4);
  el('usd-inverse').textContent = (1 / rates.USD).toFixed(6);
}

function updatePolandClock(): void {
  const status = getRateStatus();
  el('poland-time').textContent = status.polandTime;

  const statusEl = el('rate-status');
  statusEl.textContent = status.message;
  statusEl.className = `rate-status status-${status.statusType}`;
}

function showLoading(visible: boolean): void {
  el('loading-overlay').classList.toggle('hidden', !visible);
}

function showError(message: string): void {
  el('error-card').classList.remove('hidden');
  el('error-message').textContent = message;
}

function hideError(): void {
  el('error-card').classList.add('hidden');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init(): Promise<void> {
  hideError();
  showLoading(true);

  try {
    rates = await fetchExchangeRates();

    el('rate-date').textContent =
      `Kurs z dnia: ${formatEffectiveDate(rates.effectiveDate)} · Tabela ${rates.tableNo}`;

    updateRateCards();
    updateResult();
  } catch (err) {
    showError(err instanceof Error ? err.message : 'Nieznany błąd podczas pobierania kursów.');
  } finally {
    showLoading(false);
  }
}

// ─── Event listeners ──────────────────────────────────────────────────────────

el<HTMLInputElement>('amount-input').addEventListener('input', updateResult);
el('swap-btn').addEventListener('click', swap);
el('retry-btn').addEventListener('click', init);

document.querySelectorAll<HTMLButtonElement>('#from-currencies .currency-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const c = btn.dataset.currency as CurrencyCode;
    if (c) selectFrom(c);
  });
});

document.querySelectorAll<HTMLButtonElement>('#to-currencies .currency-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const c = btn.dataset.currency as CurrencyCode;
    if (c) selectTo(c);
  });
});

// ─── Bootstrap ────────────────────────────────────────────────────────────────

updatePolandClock();
setInterval(updatePolandClock, 30_000);
init();
