/*
  JawiKids ToyyibPay client helper (frontend placeholder)
  ------------------------------------------------------
  Production note:
  - Jangan letak secret key ToyyibPay di frontend.
  - Frontend perlu call serverless endpoint /api/create-toyyibpay-bill.
  - Endpoint itu akan cipta bill dan pulangkan bill URL kepada browser.
*/

export const JAWIKIDS_PRODUCTS = {
  premium_lifetime: {
    label: 'JawiKids Premium Lifetime',
    amount: 49.90,
    max_children: 3,
  },
  child_slot: {
    label: 'JawiKids Tambah Slot Anak',
    amount: 10.00,
    max_extra_slots: 2,
  },
};

export async function createToyyibPayBill({ productType, extraSlots = 0, userId }) {
  const response = await fetch('/api/create-toyyibpay-bill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productType, extraSlots, userId }),
  });

  if (!response.ok) {
    throw new Error('Gagal cipta bill ToyyibPay. Sila cuba lagi.');
  }

  return response.json();
}
