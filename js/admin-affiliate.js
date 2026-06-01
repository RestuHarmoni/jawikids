// JawiKids v1.19 Admin Affiliate Management Base
// UI preview only. Real approve/reject should connect to Supabase after Affiliate Program is enabled.

const affiliateApplications = [
  { name: 'Nurul Aisyah', email: 'aisyah@email.com', bank: 'Maybank', account: '******4321', platform: 'TikTok, WhatsApp' },
  { name: 'Ustaz Farid', email: 'farid@email.com', bank: 'Bank Islam', account: '******0098', platform: 'Facebook, Telegram' },
  { name: 'Teacher Hana', email: 'hana@email.com', bank: 'Agrobank (Other)', account: '******8755', platform: 'YouTube' }
];

function setupApplicationModal() {
  const modal = document.querySelector('[data-application-modal]');
  if (!modal) return;

  document.querySelectorAll('[data-open-application]').forEach((button) => {
    button.addEventListener('click', () => {
      const item = affiliateApplications[Number(button.dataset.openApplication)] || affiliateApplications[0];
      modal.querySelector('[data-modal-name]').textContent = item.name;
      modal.querySelector('[data-modal-email]').textContent = item.email;
      modal.querySelector('[data-modal-bank]').textContent = item.bank;
      modal.querySelector('[data-modal-account]').textContent = item.account;
      modal.querySelector('[data-modal-platform]').textContent = item.platform;
      modal.classList.remove('is-hidden');
    });
  });

  modal.querySelector('[data-close-application]')?.addEventListener('click', () => modal.classList.add('is-hidden'));
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('is-hidden');
  });
}

function setupFeatureOffButtons() {
  document.querySelectorAll('[data-feature-off]').forEach((button) => {
    button.addEventListener('click', () => alert('Affiliate Program masih Feature OFF untuk MVP Beta.'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupApplicationModal();
  setupFeatureOffButtons();
});
