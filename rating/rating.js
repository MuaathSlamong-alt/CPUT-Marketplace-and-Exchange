// Rating page: submit rating and review to backend

document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('.star');
  const textarea = document.querySelector('textarea');
  const submitBtn = document.querySelector('.submit-btn');
  const thankYou = document.querySelector('.thank-you');
  let selected = 0;


  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      highlightStars(Number(star.dataset.value));
    });
    star.addEventListener('mouseout', () => {
      highlightStars(Number(selected));
    });
    star.addEventListener('click', () => {
      selected = Number(star.dataset.value);
      highlightStars(selected);
    });
    star.setAttribute('tabindex', '0');
    star.setAttribute('role', 'button');
    star.setAttribute('aria-label', `Rate ${star.dataset.value} star${star.dataset.value > 1 ? 's' : ''}`);
    star.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        selected = Number(star.dataset.value);
        highlightStars(selected);
      }
    });
  });

  function highlightStars(count) {
    stars.forEach(star => {
      star.classList.toggle('selected', Number(star.dataset.value) <= count);
    });
  }

  const API_BASE = globalThis.__API_BASE__ || '';
  submitBtn.addEventListener('click', async () => {
    if (!selected || !textarea.value.trim()) {
      alert('Please select a rating and enter a review.');
      return;
    }
  await fetch(API_BASE + '/api/rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: selected, review: textarea.value })
    });
    thankYou.style.display = 'block';
    textarea.value = '';
    highlightStars(0);
    selected = 0;
    setTimeout(() => { thankYou.style.display = 'none'; }, 2000);
  });
});
