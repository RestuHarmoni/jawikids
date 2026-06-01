# JawiKids Orientation Fix Report v1.48.1

## Punca ditemui

1. Parent/admin pages load `js/orientation-reset.js`, tetapi fail tersebut tiada dalam folder `js/`. Ini menyebabkan reset orientation gagal dan state landscape boleh tertinggal.
2. `js/child-select.js` cuba menjalankan `screen.orientation.lock('landscape')` terus dari page child-select. Ini boleh menyebabkan page profil/dashboard mula rotate sebelum masuk game.
3. Terdapat dua salinan orientation controller (`orientation-lock.js` di root dan `js/orientation-lock.js`) dengan versi/logik berbeza.
4. LocalStorage flag `jawikids_game_wide_mode` / `jawikids_game_mode` boleh kekal jika user keluar game tanpa reset yang berjaya.

## Patch dibuat

- Tambah fail sebenar `js/orientation-reset.js`.
- Samakan logic root `orientation-reset.js` dan `js/orientation-reset.js`.
- Samakan logic root `orientation-lock.js` dan `js/orientation-lock.js`.
- Buang direct `screen.orientation.lock('landscape')` daripada `js/child-select.js` dan `child-select.js`.
- Wide mode kini hanya aktif pada page game yang ada `data-jk-orientation="game"`.
- Parent/dashboard/profile/admin/support/payment pages akan clear localStorage game mode dan unlock orientation.
- Naikkan cache/version query ke `v=1.48.1` supaya browser/PWA lebih mudah ambil fail baru.

## Page yang kekal normal portrait

- index.html
- login.html
- register.html
- parent-dashboard.html
- child-select.html
- parent-inbox.html
- parent-analytics.html
- support.html
- ticket-thread.html
- payment pages
- admin pages

## Page yang boleh wide/game mode

- game-map.html
- letter-intro.html
- lesson-practice.html
- lesson-game.html
- lesson-2.html
- boss-challenge.html

## Nota selepas upload

Selepas deploy, pada telefon Android/iPhone, clear site cache atau uninstall/install semula PWA jika masih nampak cache lama.
