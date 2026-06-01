const islands = document.querySelectorAll('.learning-island');
const detailBadge = document.getElementById('detailBadge');
const detailTitle = document.getElementById('detailTitle');
const detailStatus = document.getElementById('detailStatus');
const claimRewardBtn = document.getElementById('claimRewardBtn');

islands.forEach((island) => {
  island.addEventListener('click', () => {
    islands.forEach((item) => item.classList.remove('selected-island'));
    island.classList.add('selected-island');
    const number = island.dataset.island;
    const title = island.dataset.title;
    const status = island.dataset.status;
    const xp = island.dataset.xp;
    detailBadge.textContent = `Pulau ${number}`;
    detailTitle.textContent = title;
    detailStatus.textContent = `Status: ${status} • ${xp}`;
  });
});

claimRewardBtn?.addEventListener('click', () => {
  claimRewardBtn.textContent = 'Done!';
  claimRewardBtn.disabled = true;
  document.querySelector('.daily-reward-card strong').textContent = 'Reward sudah dituntut';
  document.querySelector('.daily-reward-card span').textContent = '+20 XP demo ditambah ke akaun anak.';
});
