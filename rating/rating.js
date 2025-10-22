
// Enhanced Rating page with word count and improved functionality

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const stars = document.querySelectorAll('.star');
  const textarea = document.getElementById('reviewTextarea');
  const submitBtn = document.getElementById('submitBtn');
  const thankYou = document.getElementById('thankYou');
  const ratingText = document.getElementById('ratingText');
  const wordCounter = document.getElementById('wordCounter');
  const charCounter = document.getElementById('charCounter');
  
  // State
  let selectedRating = 0;
  let isSubmitting = false;
  
  // Rating descriptions
  const ratingDescriptions = {
    0: 'Click a star to rate',
    1: '⭐ Poor - Very unsatisfied',
    2: '⭐⭐ Fair - Somewhat unsatisfied',
    3: '⭐⭐⭐ Good - Neutral experience',
    4: '⭐⭐⭐⭐ Very Good - Quite satisfied',
    5: '⭐⭐⭐⭐⭐ Excellent - Extremely satisfied'
  };

  // Initialize star rating functionality
  stars.forEach(star => {
    // Mouse events
    star.addEventListener('mouseover', () => {
      if (!isSubmitting) {
        const rating = Number(star.dataset.value);
        highlightStars(rating);
        updateRatingText(rating);
      }
    });
    
    star.addEventListener('mouseout', () => {
      if (!isSubmitting) {
        highlightStars(selectedRating);
        updateRatingText(selectedRating);
      }
    });
    
    star.addEventListener('click', () => {
      if (!isSubmitting) {
        selectedRating = Number(star.dataset.value);
        highlightStars(selectedRating);
        updateRatingText(selectedRating);
        updateSubmitButton();
        
        // Add a small animation effect
        star.style.transform = 'scale(1.3)';
        setTimeout(() => {
          star.style.transform = 'scale(1.1)';
        }, 150);
      }
    });
    
    // Keyboard accessibility
    star.setAttribute('tabindex', '0');
    star.setAttribute('role', 'button');
    star.setAttribute('aria-label', `Rate ${star.dataset.value} star${star.dataset.value > 1 ? 's' : ''}`);
    
    star.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && !isSubmitting) {
        e.preventDefault();
        selectedRating = Number(star.dataset.value);
        highlightStars(selectedRating);
        updateRatingText(selectedRating);
        updateSubmitButton();
      }
    });
  });

  // Textarea functionality with word and character count
  textarea.addEventListener('input', () => {
    updateWordAndCharCount();
    updateSubmitButton();
  });

  // Submit button functionality
  submitBtn.addEventListener('click', handleSubmit);

  // Helper Functions
  function highlightStars(count) {
    stars.forEach(star => {
      const starValue = Number(star.dataset.value);
      star.classList.toggle('selected', starValue <= count);
    });
  }

  function updateRatingText(rating) {
    ratingText.textContent = ratingDescriptions[rating];
    ratingText.style.color = rating > 0 ? '#27ae60' : '#666';
  }

  function updateWordAndCharCount() {
    const text = textarea.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const maxChars = 500;
    
    // Update word count
    wordCounter.textContent = `${words} word${words !== 1 ? 's' : ''}`;
    
    // Update character count with color coding
    charCounter.textContent = `${chars} / ${maxChars} characters`;
    charCounter.classList.remove('warning', 'danger');
    
    if (chars > maxChars * 0.9) {
      charCounter.classList.add('danger');
    } else if (chars > maxChars * 0.75) {
      charCounter.classList.add('warning');
    }
  }

  function updateSubmitButton() {
    const hasRating = selectedRating > 0;
    const hasReview = textarea.value.trim().length >= 10; // Minimum 10 characters
    
    submitBtn.disabled = !(hasRating && hasReview);
    
    if (hasRating && hasReview) {
      submitBtn.querySelector('.submit-text').textContent = 'Submit Rating';
    } else if (!hasRating) {
      submitBtn.querySelector('.submit-text').textContent = 'Please select a rating';
    } else {
      submitBtn.querySelector('.submit-text').textContent = 'Please write a review (min 10 chars)';
    }
  }

  async function handleSubmit() {
    if (isSubmitting || selectedRating === 0 || textarea.value.trim().length < 10) {
      return;
    }

    isSubmitting = true;
    const originalText = submitBtn.querySelector('.submit-text').textContent;
    
    try {
      // Update UI to show loading state
      submitBtn.querySelector('.submit-text').textContent = 'Submitting...';
      submitBtn.querySelector('.submit-icon').textContent = '⏳';
      submitBtn.disabled = true;
      
      // API call
      const API_BASE = globalThis.__API_BASE__ || '';
      const response = await fetch(API_BASE + '/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          rating: selectedRating, 
          review: textarea.value.trim() 
        })
      });

      if (response.ok) {
        // Success - show thank you message
        showSuccessMessage();
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('There was an error submitting your rating. Please try again.');
      
      // Reset button state
      submitBtn.querySelector('.submit-text').textContent = originalText;
      submitBtn.querySelector('.submit-icon').textContent = '⭐';
      updateSubmitButton();
    } finally {
      isSubmitting = false;
    }
  }

  function showSuccessMessage() {
    // Hide the form and show thank you message
    document.querySelector('.rating-section').style.display = 'none';
    document.querySelector('.review-section').style.display = 'none';
    submitBtn.style.display = 'none';
    thankYou.style.display = 'block';
    
    // Scroll to top to ensure user sees the message
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto redirect after 5 seconds
    setTimeout(() => {
      window.location.href = '../home/home.html';
    }, 5000);
  }

  function resetForm() {
    selectedRating = 0;
    textarea.value = '';
    highlightStars(0);
    updateRatingText(0);
    updateWordAndCharCount();
    updateSubmitButton();
    
    // Show form sections again
    document.querySelector('.rating-section').style.display = 'block';
    document.querySelector('.review-section').style.display = 'block';
    submitBtn.style.display = 'flex';
    thankYou.style.display = 'none';
    
    // Reset button text
    submitBtn.querySelector('.submit-text').textContent = 'Submit Rating';
    submitBtn.querySelector('.submit-icon').textContent = '⭐';
  }

  // Initialize counters
  updateWordAndCharCount();
  updateSubmitButton();
  
  // Add a reset function to global scope for potential use
  globalThis.resetRatingForm = resetForm;
});
