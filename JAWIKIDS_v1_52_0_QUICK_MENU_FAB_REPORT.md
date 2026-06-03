# JawiKids v1.52.0 — Quick Menu FAB Update

## Status
Siap dipasang untuk system pages dan admin pages.

## Polisi Menu Rasmi
- System pages: Quick Menu FAB aktif di mobile/tablet.
- Desktop/laptop: menu penuh dikekalkan.
- Game pages: tiada Quick Menu FAB supaya permainan kekal fokus landscape.

## Fail Utama Dikemaskini
- `js/quick-menu.js`
- `app.css`
- `admin.css`
- `sw.js`
- semua system/admin HTML untuk load `js/quick-menu.js?v=1.52.0`

## Menu Parent Seragam
- Dashboard
- Profil Anak
- Pencapaian
- Ganjaran Harian
- Kedai Avatar
- Analytics
- Bayaran
- Inbox
- Bantuan
- Affiliate
- Logout

## Menu Admin Seragam
- Overview
- Users / Parents
- Learning Modules
- Questions Bank
- Audio Manager
- Payments
- Support Center
- Affiliate
- Notifications
- Settings

## Nota PWA
Cache version dinaikkan kepada `jawikids-v1-52-0-quick-menu-force-landscape-game` supaya PWA ambil fail menu baru.
