const basePrice = 49.90;
const slotPrice = 10;
let extraSlots = 0;
const maxExtraSlots = 2;

const slotLabel = document.getElementById('slotLabel');
const extraSlot = document.getElementById('extraSlot');
const totalPrice = document.getElementById('totalPrice');
const toast = document.getElementById('payToast');
const toastText = document.getElementById('toastText');

function renderPaymentSummary(){
  const totalChildren = 3 + extraSlots;
  const total = basePrice + (extraSlots * slotPrice);
  slotLabel.textContent = `${totalChildren} / 5`;
  extraSlot.textContent = String(extraSlots);
  totalPrice.textContent = `RM${total.toFixed(2)}`;
}

function showToast(message){
  toastText.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2800);
}

document.getElementById('minusSlot')?.addEventListener('click', () => {
  extraSlots = Math.max(0, extraSlots - 1);
  renderPaymentSummary();
});

document.getElementById('plusSlot')?.addEventListener('click', () => {
  extraSlots = Math.min(maxExtraSlots, extraSlots + 1);
  renderPaymentSummary();
  if(extraSlots === maxExtraSlots){ showToast('Had maksimum ialah 5 anak untuk satu akaun parent.'); }
});

document.getElementById('payButton')?.addEventListener('click', () => {
  const amount = (basePrice + (extraSlots * slotPrice)).toFixed(2);
  const type = extraSlots === 0 ? 'premium_lifetime' : `premium_lifetime_plus_${extraSlots}_slot`;
  showToast(`Demo: create ToyyibPay bill untuk ${type} bernilai RM${amount}.`);
  console.log({ product_type: type, amount, max_children: 3 + extraSlots });
});

renderPaymentSummary();
