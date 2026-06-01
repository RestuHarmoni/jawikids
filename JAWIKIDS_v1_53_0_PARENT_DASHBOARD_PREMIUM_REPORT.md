# JawiKids v1.53.0 — TASK-021 Parent Dashboard Premium Redesign

## Status
READY PACKAGE

## Perubahan Utama
- Parent Dashboard disusun semula ikut struktur rasmi:
  1. Assalamualaikum Parent
  2. Pilih Anak — rotate/swipe card
  3. Kemajuan Pembelajaran
  4. Aktiviti Hari Ini
  5. Pencapaian Terbaru
  6. Analitik Parent
  7. Inbox
  8. Quick Menu FAB
- Quick Menu FAB v1.52.0 dikekalkan.
- Orientation SOP dikekalkan:
  - System pages = portrait only
  - Game Map / Lesson Game / Future Mini Games = force landscape
- PWA cache dinaikkan kepada v1.53.0.

## Fail Terlibat
- parent-dashboard.html
- js/dashboard.js
- app.css
- sw.js
- pwa-register.js
- semua HTML/CSS/JS version query dinaikkan ke v1.53.0 untuk elak cache lama.

## Nota QA
- Test dashboard selepas login parent.
- Test rotate child card untuk 1 hingga 5 anak.
- Test butang Sambung Belajar simpan selected child dan masuk game-map.
- Test mobile/tablet/desktop.
- Test PWA selepas uninstall dan install semula jika cache lama masih wujud.
