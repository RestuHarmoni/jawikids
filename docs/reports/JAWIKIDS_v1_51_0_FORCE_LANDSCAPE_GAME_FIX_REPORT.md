# JawiKids v1.51.0 — Force Landscape Game Mode Fix

## Official Orientation SOP

### Portrait Only
- Landing Page
- Login / Register
- Parent Dashboard
- Child Profile
- Achievement / Reward / Avatar Shop
- Support / Inbox / Payment
- Admin pages

### Force Landscape
- Game Map
- Lesson Game
- Lesson Practice / Letter Intro / Boss Challenge
- Future Mini Games

## Files Updated
- `js/orientation-lock.js`
- `orientation-lock.js`
- `js/orientation-reset.js`
- `orientation-reset.js`
- `pwa-register.js`
- `sw.js`
- `manifest.json`
- `manifest-game.json`
- `app.css`
- all version query strings from `1.50.0` to `1.51.0`

## Notes
- Non-game pages unlock orientation and clear game mode state.
- Game pages request `screen.orientation.lock('landscape')` when supported.
- Game pages also retry lock after the first user tap/click because Android browsers may require a user gesture.
- iPhone/iPad Safari may not allow forced orientation; overlay asks user to rotate manually.
- Service Worker cache name is updated to force fresh JS/CSS/manifest.
