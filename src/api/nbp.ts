import type { NbpTable, ExchangeRates } from '../types/index';

const NBP_API_BASE = 'https://api.nbp.pl/api';

export async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch(
    `${NBP_API_BASE}/exchangerates/tables/A/?format=json`,
    {
      headers: { Accept: 'application/json' },
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Brak danych NBP dla bieżącego dnia (święto lub weekend).');
    }
    throw new Error(`Błąd API NBP: ${response.status} ${response.statusText}`);
  }

  const tables: NbpTable[] = await response.json();

  if (!tables || tables.length === 0) {
    throw new Error('NBP API zwróciło pustą odpowiedź.');
  }

  const table = tables[0];
  const eurRate = table.rates.find((r) => r.code === 'EUR');
  const usdRate = table.rates.find((r) => r.code === 'USD');

  if (!eurRate || !usdRate) {
    throw new Error('Nie znaleziono kursów EUR lub USD w tabeli NBP.');
  }

  return {
    PLN: 1,
    EUR: eurRate.mid,
    USD: usdRate.mid,
    effectiveDate: table.effectiveDate,
    tableNo: table.no,
  };
}
