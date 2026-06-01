// JawiKids v1.19 Affiliate Management Base
// Feature status: OFF / Coming Soon. UI + database structure are prepared.

const JAWIKIDS_AFFILIATE_STATUS = 'coming_soon';

function isAffiliateEnabled() {
  return JAWIKIDS_AFFILIATE_STATUS === 'enabled';
}

function maskBankAccount(accountNumber) {
  const clean = String(accountNumber || '').replace(/\s+/g, '');
  if (clean.length <= 4) return '****';
  return '*'.repeat(Math.max(clean.length - 4, 4)) + clean.slice(-4);
}

function getSelectedPlatforms(form) {
  return Array.from(form.querySelectorAll('input[name="platform"]:checked')).map((item) => item.value);
}

function setupAffiliateForm() {
  const form = document.querySelector('[data-affiliate-form]');
  if (!form) return;

  const bankSelect = form.querySelector('[data-bank-select]');
  const otherBankField = form.querySelector('[data-other-bank-field]');
  const otherBankInput = otherBankField?.querySelector('input');

  function syncOtherBankField() {
    const isOther = bankSelect.value === 'OTHER';
    otherBankField?.classList.toggle('is-hidden', !isOther);
    if (otherBankInput) {
      otherBankInput.required = isOther;
      if (!isOther) otherBankInput.value = '';
    }
  }

  bankSelect?.addEventListener('change', syncOtherBankField);
  syncOtherBankField();

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const bankName = data.get('bank_name') === 'OTHER' ? data.get('bank_name_other') : data.get('bank_name');
    const platforms = getSelectedPlatforms(form);

    const summary = [
      'Permohonan affiliate draft disediakan.',
      `Bank: ${bankName || '-'}`,
      `No Akaun: ${maskBankAccount(data.get('bank_account_number'))}`,
      `Platform: ${platforms.length ? platforms.join(', ') : '-'}`,
      'Status: Coming Soon / belum dihantar ke Supabase.'
    ].join('
');

    alert(summary);
  });
}

document.addEventListener('DOMContentLoaded', setupAffiliateForm);
