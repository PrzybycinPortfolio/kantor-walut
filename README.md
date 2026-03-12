# KantorFX — Kalkulator Walut NBP

Prosta, responsywna aplikacja webowa do przeliczania walut **PLN / EUR / USD** z oficjalnymi kursami Narodowego Banku Polskiego.

![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?logo=vite&logoColor=white)
![NBP API](https://img.shields.io/badge/API-NBP%20Tabela%20A-CC0000)

---

## Podgląd

> Ciemny, premium interfejs z płynną animacją zamiany walut i live danymi z NBP.

```
┌─────────────────────────────────┐
│  KantorFX          Czas PL 14:23│
├─────────────────────────────────┤
│  Kwota                          │
│  [ 100,00  ]  🇵🇱 PLN  🇪🇺 EUR  🇺🇸 USD│
│              ⇅                  │
│  Wynik                          │
│  [ 23,6700€]  🇵🇱 PLN  🇪🇺 EUR  🇺🇸 USD│
│  1 🇵🇱 PLN = 0.2367 🇪🇺 EUR    │
└─────────────────────────────────┘
   🇪🇺 EUR 4.2240 PLN  │  🇺🇸 USD 3.9876 PLN
```

---

## Funkcje

- **Przeliczanie walut** PLN ↔ EUR ↔ USD w czasie rzeczywistym
- **Oficjalne kursy NBP** — Tabela A (kurs średni), pobierane przy starcie
- **Logika czasowa** (timezone `Europe/Warsaw`):
  - ✅ Po 12:00 w dzień roboczy — kurs aktualny
  - ⏳ Przed 12:00 w dzień roboczy — kurs z poprzedniego dnia (NBP publikuje ~11:45–12:00)
  - 📅 Weekend — kurs z ostatniego dnia roboczego
- **Zamiana walut** jednym kliknięciem (animowany przycisk ⇅)
- **Responsywny design** — działa na mobile i desktop
- Obsługa błędów połączenia z API z możliwością ponowienia

---

## Technologie

| Technologia | Wersja | Zastosowanie |
|---|---|---|
| TypeScript | 5.4 | Logika aplikacji, typy |
| Vite | 5.2 | Bundler, dev server |
| HTML5 | — | Struktura |
| CSS3 | — | Stylowanie (custom properties, grid, flexbox) |
| [NBP API](https://api.nbp.pl/) | v1 | Kursy walut (Tabela A) |

---

## Struktura projektu

```
kantor walut/
├── index.html              # Punkt wejścia
├── package.json
├── tsconfig.json
├── vite.config.ts
├── styles/
│   └── main.css            # Wszystkie style (CSS custom properties, dark theme)
└── src/
    ├── main.ts             # Logika UI, obsługa zdarzeń, konwersja
    ├── types/
    │   └── index.ts        # Interfejsy TypeScript
    ├── api/
    │   └── nbp.ts          # Klient API NBP
    └── utils/
        └── time.ts         # Logika czasu polskiego, status publikacji kursów
```

---

## Szybki start

### Wymagania

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Instalacja i uruchomienie

```bash
# Sklonuj repozytorium
git clone https://github.com/<twoj-login>/kantor-walut.git
cd kantor-walut

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski (http://localhost:3000)
npm run dev
```

### Budowanie produkcyjne

```bash
# Sprawdź typy i zbuduj do /dist
npm run build

# Podgląd wersji produkcyjnej
npm run preview
```

---

## API NBP

Aplikacja korzysta z publicznego API Narodowego Banku Polskiego — brak konieczności rejestracji ani klucza API.

```
GET https://api.nbp.pl/api/exchangerates/tables/A/?format=json
```

Zwraca tabelę kursów średnich (mid) dla wszystkich walut. Aplikacja wyciąga kursy `EUR` i `USD` względem `PLN`.

> Kursy publikowane są w dni robocze, zazwyczaj między 11:45 a 12:00. W weekendy i święta API zwraca kursy z ostatniego dnia roboczego.

---

## Licencja

MIT — dane kursowe udostępniane przez [Narodowy Bank Polski](https://www.nbp.pl/).
