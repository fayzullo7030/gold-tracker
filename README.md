# Gold Tracker

PWA для отслеживания цены 5-граммового золотого слитка ЦБ Узбекистана.

## Что внутри
- `index.html` — приложение с современным графиком и локальным хранением истории.
- `data.json` — данные, которые обновляет GitHub Actions.
- `.github/workflows/update-gold.yml` — автоматическое получение данных каждый день в 09:35 по Ташкенту.
- `sw.js` — service worker.
- `manifest.webmanifest` — настройки PWA.

Источник данных: https://cbu.uz/ru/banknotes-coins/gold-bars/prices/
