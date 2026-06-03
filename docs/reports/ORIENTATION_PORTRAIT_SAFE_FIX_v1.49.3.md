# JawiKids Portrait Safe Fix v1.49.3

Fix dibuat untuk hentikan semua force auto-rotate.

## Fail kritikal dikemaskini
- manifest.json -> orientation any
- manifest-game.json -> orientation any
- sw.js -> cache baru, network-only untuk manifest/orientation scripts
- pwa-register.js -> clear semua cache dan orientation state
- js/orientation-lock.js / orientation-lock.js -> no-op, tiada screen.orientation.lock
- js/orientation-reset.js / orientation-reset.js -> clear state dan unlock sahaja
- js/child-profile.js / child-select.js -> tidak set localStorage game wide mode
- Semua HTML -> manifest-game.json ditukar kepada manifest.json
- app.css -> CSS safety override untuk elak class lama memaksa layout wide

## Nota deploy penting
Upload semua fail dari ZIP ini. Jika PWA lama sudah install, uninstall PWA lama dan install semula kerana browser boleh simpan manifest lama.
