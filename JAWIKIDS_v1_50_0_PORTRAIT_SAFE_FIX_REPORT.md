# JawiKids v1.51.0 Portrait Safe Fix

Tujuan: hentikan auto rotate / force landscape sepenuhnya.

Fail utama dikemaskini:
- manifest.json
- manifest-game.json
- sw.js
- pwa-register.js
- orientation-lock.js
- js/orientation-lock.js
- orientation-reset.js
- js/orientation-reset.js
- child-select.js
- js/child-select.js
- app.css
- semua HTML version query dinaikkan ke v=1.51.0

Perubahan penting:
1. Semua manifest ditukar kepada `orientation: portrait-primary`.
2. Semua HTML game tidak lagi guna `manifest-game.json`; disamakan kepada `manifest.json`.
3. `screen.orientation.lock('landscape')` dibuang sepenuhnya.
4. `requestFullscreen()` untuk orientation lock dibuang.
5. LocalStorage `jawikids_game_wide_mode` dan `jawikids_game_mode` tidak lagi diset dari child-select.
6. Service worker guna cache baru `jawikids-v1-51-0-portrait-safe` dan delete cache lama.
7. CSS overlay rotate disembunyikan secara hard override.

Nota deployment:
- Upload semua fail dalam ZIP ini.
- Di GitHub, pastikan fail lama overwrite, bukan merge separuh.
- PWA lama perlu uninstall dan install semula kerana Android boleh kekalkan manifest lama.
