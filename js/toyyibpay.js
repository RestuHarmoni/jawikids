/* JawiKids ToyyibPay helper - v1.22
   Production note:
   - Jangan letak ToyyibPay secret key di frontend.
   - Frontend call serverless endpoint /api/create-toyyibpay-bill.
   - Endpoint perlu pulangkan { bill_url } atau { url } atau { payment_url }.
*/
(function () {
  const PRODUCTS = {
    premium_lifetime: {
      label: 'JawiKids Premium Lifetime',
      amount: 49.90,
      max_children: 3,
    },
    premium_lifetime_4_children: {
      label: 'JawiKids Premium Lifetime + 1 Slot Anak',
      amount: 59.90,
      max_children: 4,
    },
    premium_lifetime_5_children: {
      label: 'JawiKids Premium Lifetime + 2 Slot Anak',
      amount: 69.90,
      max_children: 5,
    },
  };

  function getProductByExtraSlots(extraSlots) {
    const slots = Math.max(0, Math.min(2, Number(extraSlots || 0)));
    if (slots === 1) return { id: 'premium_lifetime_4_children', ...PRODUCTS.premium_lifetime_4_children };
    if (slots === 2) return { id: 'premium_lifetime_5_children', ...PRODUCTS.premium_lifetime_5_children };
    return { id: 'premium_lifetime', ...PRODUCTS.premium_lifetime };
  }

  async function createToyyibPayBill({ productType, extraSlots = 0, userId, paymentId }) {
    const response = await fetch('/api/create-toyyibpay-bill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productType, extraSlots, userId, paymentId }),
    });

    if (!response.ok) {
      throw new Error('Gagal cipta bill ToyyibPay. Sila cuba lagi atau hubungi admin.');
    }

    return response.json();
  }

  window.JAWIKIDS_PRODUCTS = PRODUCTS;
  window.getJawiKidsProductByExtraSlots = getProductByExtraSlots;
  window.createToyyibPayBill = createToyyibPayBill;
})();
