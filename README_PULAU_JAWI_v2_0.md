# Pulau Jawi v2.0 - 10 Game Demo UI

Rebuild daripada `jawikids_v1.0.zip` mengikut perbincangan terbaru:

- Fokus umur 5–8 tahun sahaja.
- Rebrand demo kepada **Pulau Jawi** untuk elak konflik nama JawiKids.
- 10 pulau utama dengan 10 konsep game berbeza.
- UI premium kids education: warna ceria, avatar Zafri/Zainab, peta pulau, reward dan badge.
- Parent page portrait friendly.
- Game page wide/landscape friendly untuk smartphone.
- Audio demo menggunakan Web Audio + browser speechSynthesis `ms-MY` sebagai placeholder.

## Fail utama yang dikemas kini

- `index.html` - landing page + demo game CTA + 10 pulau.
- `game-map.html` - peta 10 pulau.
- `lesson-game.html` - engine demo interaktif 10 pulau.
- `parent-dashboard.html` - dashboard parent.
- `child-select.html` - pilih anak.
- `achievement.html` - badge/pencapaian.
- `reward.html` - reward harian.
- `avatar-shop.html` - shop cosmetic.
- `app.css` - design system baru.
- `js/pulau-jawi-data.js` - data 10 pulau dan soalan demo.

## Nota penting

Fail Supabase/payment/admin asal tidak dipadam. Versi ini fokus kemasan UI dan game demo. Untuk production, audio sebenar MP3 kanak-kanak Melayu perlu dimasukkan menggantikan speechSynthesis.
