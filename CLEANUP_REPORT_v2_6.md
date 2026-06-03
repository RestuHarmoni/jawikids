# Pulau Jawi v2.6 Clean Structure Report

## Tujuan
ZIP ini dikemas kini untuk membuang fail bertindih/duplicate yang boleh mengelirukan semasa maintenance.

## Fail duplicate yang dibuang
- `/orientation-lock.js`
- `/orientation-reset.js`
- `/child-profile.js`
- `/lesson-game.js`
- `/letter-intro.js`

## Lokasi rasmi selepas cleanup
- Orientation lock rasmi: `/js/orientation-lock.js`
- Orientation reset rasmi: `/js/orientation-reset.js`
- Child select rasmi: `/js/child-profile.js`
- Lesson game rasmi: `/js/lesson-game.js`
- Letter intro rasmi: `/js/letter-intro.js`

## Nota penting
- UI Game Map yang telah diluluskan/locked tidak diubah.
- `game-map.html` dan `game-map/index.html` masih menggunakan `/js/orientation-lock.js`.
- Parent/non-game pages masih menggunakan `/js/orientation-reset.js`.
- `sw.js` cache version dikemas kini kepada `pulau-jawi-v2-6-clean-structure` supaya browser/PWA tarik fail baru.

## Fail sengaja dikekalkan walaupun kandungan asset nampak sama
Beberapa SVG avatar/icon dikekalkan kerana banyak page merujuk path berbeza seperti `/assets/characters/...` dan `/assets/avatars/...`. Ia tidak dibuang untuk mengelakkan gambar/avatar rosak di page tertentu.
