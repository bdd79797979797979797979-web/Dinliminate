# Dinliminate P636 audit — P635-era frontend restoration — 2026-09-26

Frontend source restored from the verified historical premium Dinliminate interface (commit 17278abfe32196f91482301d2615bb53a3ee542c) and made the production entry point.

Restored surfaces:
- Premium Dinliminate home layout and visual hierarchy.
- Food decision card, Tinder-style controls, Quick Cuts, Random Cut One, Add Food, and Pass Around.
- Restaurant decision surface with compact address/radius/location/find controls.
- Address autocomplete + location search controller.
- Restaurant Quick Cuts and same-line restaurant utility controls.
- Restaurant Details, Website/Order, Save, History, Settings, and custom food management.
- Existing V3 restaurant search controller retained.
- Current production restaurant API (restaurant-v706-core) retained separately in api/restaurant-search.js.
- Radius UI supports 1–100 miles.
- Home title restored to “what sounds good tonight?”.
- Legacy clean P4 app shell is no longer the frontend entry point.
- No clean-app.js/clean.css references remain in the restored frontend.
