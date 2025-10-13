// Rating page: submit rating and review to backend

document.addEventListener('DOMContentLoaded', () => {
  const stars = document.querySelectorAll('.star');
  const textarea = document.querySelector('textarea');
  const submitBtn = document.querySelector('.submit-btn');
  const thankYou = document.querySelector('.thank-you');
  let selected = 0;

  stars.forEach(star => {
    star.addEventListener('mouseover', () => {
      highlightStars(star.dataset.value);
    });
    star.addEventListener('mouseout', () => {
      highlightStars(selected);
    });
    star.addEventListener('click', () => {
      selected = star.dataset.value;
      highlightStars(selected);
    });
  });

  function highlightStars(count) {
    stars.forEach(star => {
      star.classList.toggle('selected', star.dataset.value <= count);
    });
  }

  submitBtn.addEventListener('click', async () => {
    if (!selected || !textarea.value.trim()) {
      alert('Please select a rating and enter a review.');
      return;
    }
    await fetch('/api/rating', {
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
