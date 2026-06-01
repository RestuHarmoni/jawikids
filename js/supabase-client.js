/* JawiKids Supabase Client
   Replace the values below with your real Supabase project URL and anon key. */
(function () {
  const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
  const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

  window.JAWIKIDS_SUPABASE_READY = false;
  window.jawiSupabase = null;

  if (!window.supabase) {
    console.warn('Supabase SDK not loaded. Add https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    return;
  }

  if (SUPABASE_URL.includes('YOUR_PROJECT_ID') || SUPABASE_ANON_KEY.includes('YOUR_SUPABASE')) {
    console.warn('Supabase config still uses placeholders. Update js/supabase-client.js before production.');
  }

  window.jawiSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  window.JAWIKIDS_SUPABASE_READY = true;
})();
