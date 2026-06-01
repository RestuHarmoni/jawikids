const toast = document.getElementById('payToast');
const toastText = document.getElementById('toastText');
const lifetimeButton = document.getElementById('payLifetimeButton');
const childSlotButton = document.getElementById('payChildSlotButton');

function showToast(message) {
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function setLoading(button, isLoading, normalLabel) {
  if (!button) return;
  button.disabled = isLoading;
  button.textContent = isLoading ? 'Sedang buka FPX...' : normalLabel;
}

async function getCurrentUser() {
  const supabase = window.getJawiSupabase ? window.getJawiSupabase() : window.jawiSupabase;
  if (!supabase) return { supabase: null, user: null };
  const { data, error } = await supabase.auth.getUser();
  if (error) return { supabase, user: null };
  return { supabase, user: data?.user || null };
}

async function getCurrentProfile(supabase, userId) {
  const { data } = await supabase
    .from('profiles')
    .select('max_children,premium_lifetime,subscription_status')
    .eq('id', userId)
    .maybeSingle();
  return data || null;
}

async function createPendingPayment(supabase, userId, product, profile) {
  const maxChildrenAfterPayment = product.id === 'child_slot'
    ? Math.min(5, Number(profile?.max_children || 3) + 1)
    : 3;

  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      amount: product.amount,
      status: 'pending',
      product_type: product.id,
      max_children_after_payment: maxChildrenAfterPayment,
      raw_payload: { source: 'frontend_payment_page', version: 'v1.23', mode: 'toyyibpay_direct_link' }
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

async function startPayment(productType, button, normalLabel) {
  try {
    setLoading(button, true, normalLabel);
    const product = window.getJawiKidsProductByType
      ? window.getJawiKidsProductByType(productType)
      : null;

    if (!product) throw new Error('Produk pembayaran tidak dijumpai.');

    const { supabase, user } = await getCurrentUser();
    if (!supabase) {
      showToast('Supabase belum dikonfigurasi. Sila semak js/supabase-client.js.');
      return;
    }

    if (!user) {
      showToast('Sila login dahulu sebelum membuat bayaran.');
      window.setTimeout(() => { window.location.href = 'login.html'; }, 900);
      return;
    }

    const profile = await getCurrentProfile(supabase, user.id);

    if (product.id === 'child_slot') {
      if (!profile?.premium_lifetime) {
        showToast('Aktifkan Lifetime Access dahulu sebelum tambah slot anak.');
        return;
      }
      if (Number(profile?.max_children || 3) >= 5) {
        showToast('Had maksimum 5 anak sudah dicapai.');
        return;
      }
    }

    await createPendingPayment(supabase, user.id, product, profile);

    const bill = await window.createToyyibPayBill({ productType: product.id });
    window.location.href = bill.bill_url;
  } catch (error) {
    showToast(error.message || 'Pembayaran gagal dimulakan. Sila cuba lagi.');
  } finally {
    setLoading(button, false, normalLabel);
  }
}

lifetimeButton?.addEventListener('click', () => startPayment('lifetime', lifetimeButton, 'Bayar Lifetime RM49.90 / FPX'));
childSlotButton?.addEventListener('click', () => startPayment('child_slot', childSlotButton, 'Tambah Slot Anak RM10 / FPX'));
