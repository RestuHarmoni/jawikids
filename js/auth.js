/* JawiKids Auth Controller */
(function () {
  const $ = (id) => document.getElementById(id);
  const client = () => window.jawiSupabase;

  function showMessage(targetId, message, type = 'info') {
    const box = $(targetId);
    if (!box) return;
    box.textContent = message;
    box.className = `auth-message ${type}`;
    box.hidden = false;
  }

  function setLoading(button, loading, label) {
    if (!button) return;
    button.disabled = loading;
    button.textContent = loading ? 'Memproses...' : label;
  }

  async function registerParent(event) {
    event.preventDefault();
    const supabase = client();
    if (!supabase) return showMessage('authMessage', 'Supabase belum dikonfigurasi.', 'error');

    const button = $('registerBtn');
    setLoading(button, true, 'Daftar Akaun');

    const fullName = $('fullName')?.value.trim();
    const phone = $('phoneNumber')?.value.trim();
    const email = $('email')?.value.trim();
    const password = $('password')?.value;
    const confirm = $('confirmPassword')?.value;

    if (!fullName || !email || !password) {
      setLoading(button, false, 'Daftar Akaun');
      return showMessage('authMessage', 'Sila lengkapkan nama, email dan kata laluan.', 'error');
    }
    if (password.length < 6) {
      setLoading(button, false, 'Daftar Akaun');
      return showMessage('authMessage', 'Kata laluan minimum 6 aksara.', 'error');
    }
    if (password !== confirm) {
      setLoading(button, false, 'Daftar Akaun');
      return showMessage('authMessage', 'Kata laluan tidak sama.', 'error');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, phone_number: phone },
        emailRedirectTo: `${window.location.origin}/login.html`
      }
    });

    setLoading(button, false, 'Daftar Akaun');

    if (error) return showMessage('authMessage', error.message, 'error');
    showMessage('authMessage', 'Pendaftaran berjaya. Sila semak email untuk pengesahan jika diperlukan.', 'success');

    if (data?.user && data?.session) {
      setTimeout(() => { window.location.href = 'parent-dashboard.html'; }, 800);
    }
  }

  async function loginParent(event) {
    event.preventDefault();
    const supabase = client();
    if (!supabase) return showMessage('authMessage', 'Supabase belum dikonfigurasi.', 'error');

    const button = $('loginBtn');
    setLoading(button, true, 'Log Masuk');

    const email = $('email')?.value.trim();
    const password = $('password')?.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(button, false, 'Log Masuk');

    if (error) return showMessage('authMessage', error.message, 'error');
    showMessage('authMessage', 'Log masuk berjaya.', 'success');
    setTimeout(() => { window.location.href = 'parent-dashboard.html'; }, 500);
  }

  async function loginGoogle() {
    const supabase = client();
    if (!supabase) return showMessage('authMessage', 'Supabase belum dikonfigurasi.', 'error');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/parent-dashboard.html` }
    });
    if (error) showMessage('authMessage', error.message, 'error');
  }

  async function forgotPassword(event) {
    event.preventDefault();
    const supabase = client();
    if (!supabase) return showMessage('authMessage', 'Supabase belum dikonfigurasi.', 'error');

    const button = $('resetBtn');
    setLoading(button, true, 'Hantar Link Reset');
    const email = $('email')?.value.trim();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login.html`
    });
    setLoading(button, false, 'Hantar Link Reset');

    if (error) return showMessage('authMessage', error.message, 'error');
    showMessage('authMessage', 'Link reset kata laluan telah dihantar ke email.', 'success');
  }

  async function logoutParent() {
    const supabase = client();
    if (!supabase) return;
    await supabase.auth.signOut();
    window.location.href = 'login.html';
  }

  async function protectPage() {
    const protectedPages = ['parent-dashboard.html', 'child-select.html', 'game-map.html', 'lesson-game.html'];
    const file = window.location.pathname.split('/').pop();
    if (!protectedPages.includes(file)) return;
    const supabase = client();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) window.location.href = 'login.html';
  }

  window.JawiKidsAuth = { registerParent, loginParent, loginGoogle, forgotPassword, logoutParent, protectPage };
  document.addEventListener('DOMContentLoaded', protectPage);
})();
