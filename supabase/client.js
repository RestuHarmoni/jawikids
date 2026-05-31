// JawiKids Supabase Browser Client v1.04
// This file is intentionally NOT an ES module.
// It works with normal <script src="..."></script> tags.

(function () {
  const url = window.JAWIKIDS_SUPABASE_URL;
  const key = window.JAWIKIDS_SUPABASE_ANON_KEY || window.JAWIKIDS_SUPABASE_PUBLISHABLE_KEY;

  const hasSupabaseLibrary = !!window.supabase;
  const hasValidConfig = !!url && !!key && !String(url).includes("YOUR_") && !String(key).includes("YOUR_");

  window.jawikidsSupabase = hasSupabaseLibrary && hasValidConfig
    ? window.supabase.createClient(url, key)
    : null;

  if (!window.jawikidsSupabase) {
    console.warn("JawiKids Supabase client not initialized. Check CDN/config.js.");
  }
})();
