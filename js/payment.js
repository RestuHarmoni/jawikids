const basePrice = 49.90;
const slotPrice = 10;
let extraSlots = 0;
const maxExtraSlots = 2;

const slotLabel = document.getElementById('slotLabel');
const extraSlot = document.getElementById('extraSlot');
const totalPrice = document.getElementById('totalPrice');
const toast = document.getElementById('payToast');
const toastText = document.getElementById('toastText');
const payButton = document.getElementById('payButton');

function renderPaymentSummary() {
  const totalChildren = 3 + extraSlots;
  const total = basePrice + (extraSlots * slotPrice);
  if (slotLabel) slotLabel.textContent = `${totalChildren} / 5`;
  if (extraSlot) extraSlot.textContent = String(extraSlots);
  if (totalPrice) totalPrice.textContent = `RM${total.toFixed(2)}`;
}

function showToast(message) {
  if (!toast || !toastText) return;
  toastText.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 3200);
}

function setLoading(isLoading) {
  if (!payButton) return;
  payButton.disabled = isLoading;
  payButton.textContent = isLoading ? 'Sedang cipta bill...' : 'Bayar Dengan ToyyibPay / FPX';
}

async function getCurrentUser() {
  const supabase = window.getJawiSupabase ? window.getJawiSupabase() : window.jawiSupabase;
  if (!supabase) return { supabase: null, user: null };
  const { data, error } = await supabase.auth.getUser();
  if (error) return { supabase, user: null };
  return { supabase, user: data?.user || null };
}

async function createPendingPayment(supabase, userId, product) {
  const { data, error } = await supabase
    .from('payments')
    .insert({
      user_id: userId,
      amount: product.amount,
      status: 'pending',
      product_type: product.id,
      max_children_after_payment: product.max_children,
      raw_payload: { source: 'frontend_payment_page', version: 'v1.22' }
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

async function handlePayment() {
  try {
    setLoading(true);
    const product = window.getJawiKidsProductByExtraSlots
      ? window.getJawiKidsProductByExtraSlots(extraSlots)
      : {
          id: extraSlots === 2 ? 'premium_lifetime_5_children' : extraSlots === 1 ? 'premium_lifetime_4_children' : 'premium_lifetime',
          amount: basePrice + (extraSlots * slotPrice),
          max_children: 3 + extraSlots
        };

    const { supabase, user } = await getCurrentUser();
    if (!supabase) {
      showToast('Supabase belum dikonfigurasi. Sila isi URL dan anon key dahulu.');
      return;
    }

    if (!user) {
      showToast('Sila login dahulu sebelum membuat bayaran.');
      window.setTimeout(() => { window.location.href = 'login.html'; }, 900);
      return;
    }

    const pending = await createPendingPayment(supabase, user.id, product);

    if (typeof window.createToyyibPayBill !== 'function') {
      showToast('Endpoint ToyyibPay belum disambungkan. Rekod pending payment telah dibuat untuk semakan admin.');
      return;
    }

    const bill = await window.createToyyibPayBill({
      productType: product.id,
      extraSlots,
      userId: user.id,
      paymentId: pending.id
    });

    const billUrl = bill.bill_url || bill.url || bill.payment_url;
    if (!billUrl) throw new Error('Serverless ToyyibPay tidak pulangkan bill_url.');
    window.location.href = billUrl;
  } catch (error) {
    showToast(error.message || 'Pembayaran gagal dimulakan. Sila cuba lagi.');
  } finally {
    setLoading(false);
  }
}

document.getElementById('minusSlot')?.addEventListener('click', () => {
  extraSlots = Math.max(0, extraSlots - 1);
  renderPaymentSummary();
});

document.getElementById('plusSlot')?.addEventListener('click', () => {
  extraSlots = Math.min(maxExtraSlots, extraSlots + 1);
  renderPaymentSummary();
  if (extraSlots === maxExtraSlots) showToast('Had maksimum ialah 5 anak untuk satu akaun parent.');
});

payButton?.addEventListener('click', handlePayment);
renderPaymentSummary();
