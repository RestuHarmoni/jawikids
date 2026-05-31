# JawiKids App Real MVP v1.03

Base rasmi development JawiKids selepas semakan source.

## Upload ke GitHub
Upload semua fail/folder kecuali jika mahu production clean boleh abaikan `/docs` dan `/storage-notes`.

## Supabase
Run SQL mengikut turutan:
1. `/supabase/schema.sql`
2. `/supabase/rls.sql`
3. `/supabase/seed.sql` pilihan untuk test

## Config
Tukar nilai dalam `/supabase/config.js`:
```js
window.JAWIKIDS_SUPABASE_URL = "...";
window.JAWIKIDS_SUPABASE_ANON_KEY = "...";
```

## Demo local
Email: demo@jawikids.com  
Password: demo12345

## Status
Versi ini belum final production untuk jualan penuh, tetapi sudah menjadi Real MVP Build yang boleh diuji dan disambung development.


## v1.10 FULL SCHEMA SYNC
Semua file JS utama telah diselaraskan dengan Supabase schema semasa. Service worker cache v1.10.
