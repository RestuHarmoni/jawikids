# JawiKids v1.49 Orientation + Responsive UI Deep Fix Report

Punca utama ditemui:
1. Non-game HTML memanggil `js/orientation-reset.js`, tetapi fail itu tidak wujud dalam folder `js/`. Jadi reset orientation tidak berjalan.
2. `js/child-select.js` masih memanggil `screen.orientation.lock('landscape')`. Ini boleh menyebabkan device/PWA kekal landscape.
3. `manifest-game.json` masih `orientation: landscape-primary`.
4. Nav atas terlalu penuh dan tidak boleh hide.

Fix v1.49:
- Tambah `js/orientation-reset.js`.
- Buang forced orientation lock.
- Manifest normal dan game ditukar kepada `orientation: any`.
- Game hanya tunjuk rotate guidance, bukan paksa rotate.
- Tambah `js/nav-toggle.js` untuk hide/show menu atas.
- Tambah responsive CSS untuk phone, tablet, iPad, iPhone, Mac, laptop dan PC.

Upload seluruh ZIP paling selamat.
