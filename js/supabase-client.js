/* JawiKids Supabase Client - v1.22 Official Sync Patch
   Cara guna:
   1) Ganti SUPABASE_URL dan SUPABASE_ANON_KEY dengan nilai sebenar dari Supabase Project Settings > API.
   2) Jangan masukkan SERVICE_ROLE key di frontend.
   3) Pastikan setiap page yang guna Supabase load SDK dahulu:
      https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
*/
(function () {
  const SUPABASE_URL = 'https://tuwbamxobhkbbkaodvkg.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_zuXeYtmjbpYaFCJq9Ker7A_ngs5_VOu';

  const isPlaceholder =
    SUPABASE_URL.includes('YOUR_PROJECT_ID') ||
    SUPABASE_ANON_KEY.includes('YOUR_SUPABASE') ||
    !SUPABASE_URL.startsWith('https://') ||
    SUPABASE_ANON_KEY.length < 40;

  window.JAWIKIDS_SUPABASE_READY = false;
  window.JAWIKIDS_SUPABASE_CONFIGURED = !isPlaceholder;
  window.jawiSupabase = null;

  window.getJawiSupabase = function getJawiSupabase() {
    if (!window.JAWIKIDS_SUPABASE_CONFIGURED || !window.jawiSupabase) return null;
    return window.jawiSupabase;
  };

  if (!window.supabase) {
    console.error('Supabase SDK tidak dimuatkan. Sila pastikan CDN supabase-js@2 ada sebelum js/supabase-client.js.');
    return;
  }

  if (isPlaceholder) {
    console.warn('JawiKids Supabase belum dikonfigurasi. Ganti SUPABASE_URL dan SUPABASE_ANON_KEY dalam js/supabase-client.js sebelum production.');
    return;
  }

  window.jawiSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  });

  window.JAWIKIDS_SUPABASE_READY = true;
})();
