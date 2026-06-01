/* JawiKids ToyyibPay helper - v1.23
   Mode beta: guna direct ToyyibPay FPX link.
   Nota production: untuk auto unlock premium/slot, sambungkan webhook ToyyibPay ke Supabase.
*/
(function () {
  const PRODUCTS = {
    lifetime: {
      label: 'JawiKids Lifetime Access',
      amount: 49.90,
      max_children: 3,
      bill_url: 'https://toyyibpay.com/jawikidsGo'
    },
    child_slot: {
      label: 'Tambah Slot Anak',
      amount: 10.00,
      max_children: null,
      bill_url: 'https://toyyibpay.com/Avatar-Add-On'
    }
  };

  function getProductByType(type) {
    return type === 'child_slot'
      ? { id: 'child_slot', ...PRODUCTS.child_slot }
      : { id: 'lifetime', ...PRODUCTS.lifetime };
  }

  async function createToyyibPayBill({ productType }) {
    const product = getProductByType(productType);
    return { bill_url: product.bill_url, mode: 'direct_link' };
  }

  window.JAWIKIDS_PRODUCTS = PRODUCTS;
  window.getJawiKidsProductByType = getProductByType;
  window.createToyyibPayBill = createToyyibPayBill;
})();
