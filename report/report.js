// Enhanced Report page with validation and improved functionality

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const reportForm = document.getElementById('reportForm');
  const firstName = document.getElementById('firstName');
  const lastName = document.getElementById('lastName');
  const reportDate = document.getElementById('reportDate');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const wordCounter = document.getElementById('wordCounter');
  const charCounter = document.getElementById('charCounter');

  // State
  let isSubmitting = false;

  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];
  reportDate.value = today;

  // Auto-fill subject if ?user= is present in query string
  const params = new URLSearchParams(window.location.search);
  const reportedUser = params.get('user');
  if (reportedUser) {
    subject.value = reportedUser;
  }

  // Form validation rules
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'First name must contain only letters and be at least 2 characters long'
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: 'Last name must contain only letters and be at least 2 characters long'
    },
    reportDate: {
      required: true,
      maxDate: today,
      message: 'Please select a valid date (not in the future)'
    },
    subject: {
      required: true,
      minLength: 3,
      maxLength: 100,
      message: 'Subject must be between 3 and 100 characters'
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 500,
      message: 'Description must be between 20 and 500 characters'
    }
  };

  // Input event listeners
  [firstName, lastName, reportDate, subject, message].forEach(input => {
    input.addEventListener('input', () => {
      validateField(input);
      updateSubmitButton();
    });

    input.addEventListener('blur', () => {
      validateField(input);
    });
  });

  // Message textarea with word/character count
  message.addEventListener('input', () => {
    updateWordAndCharCount();
    validateField(message);
    updateSubmitButton();
  });

  // Form submission
  reportForm.addEventListener('submit', handleSubmit);

  // Validation Functions
  function validateField(field) {
    const fieldName = field.id;
    const rule = validationRules[fieldName];
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldName + 'Error');
    
    let isValid = true;
    let errorMessage = '';

    // Required check
    if (rule.required && !value) {
      isValid = false;
      errorMessage = `${getFieldLabel(fieldName)} is required`;
    }
    // Length checks
    else if (rule.minLength && value.length < rule.minLength) {
      isValid = false;
      errorMessage = rule.message;
    }
    else if (rule.maxLength && value.length > rule.maxLength) {
      isValid = false;
      errorMessage = rule.message;
    }
    // Pattern check
    else if (rule.pattern && !rule.pattern.test(value)) {
      isValid = false;
      errorMessage = rule.message;
    }
    // Date check
    else if (fieldName === 'reportDate' && rule.maxDate && value > rule.maxDate) {
      isValid = false;
      errorMessage = rule.message;
    }

    // Update UI
    field.classList.toggle('error', !isValid);
    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.toggle('show', !isValid);
    }

    return isValid;
  }

  function getFieldLabel(fieldName) {
    const labels = {
      firstName: 'First name',
      lastName: 'Last name',
      reportDate: 'Date',
      subject: 'Subject',
      message: 'Description'
    };
    return labels[fieldName] || fieldName;
  }

  function validateForm() {
    return [firstName, lastName, reportDate, subject, message]
      .every(field => validateField(field));
  }

  function updateWordAndCharCount() {
    const text = message.value;
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
    const isFormValid = validateFormSilently();
    
    submitBtn.disabled = !(isFormValid && !isSubmitting);
    
    if (isSubmitting) {
      submitBtn.querySelector('.submit-text').textContent = 'Submitting...';
    } else if (isFormValid) {
      submitBtn.querySelector('.submit-text').textContent = 'Submit Report';
    } else {
      submitBtn.querySelector('.submit-text').textContent = 'Please complete all fields';
    }
  }

  function validateFormSilently() {
    // Check all fields without showing errors
    const rules = validationRules;
    return Object.keys(rules).every(fieldName => {
      const field = document.getElementById(fieldName);
      const rule = rules[fieldName];
      const value = field.value.trim();

      if (rule.required && !value) return false;
      if (rule.minLength && value.length < rule.minLength) return false;
      if (rule.maxLength && value.length > rule.maxLength) return false;
      if (rule.pattern && !rule.pattern.test(value)) return false;
      if (fieldName === 'reportDate' && rule.maxDate && value > rule.maxDate) return false;

      return true;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    isSubmitting = true;
    updateSubmitButton();

    try {
      const formData = {
        firstName: firstName.value.trim(),
        lastName: lastName.value.trim(),
        reportDate: reportDate.value,
        subject: subject.value.trim(),
        message: message.value.trim()
      };

      // API call
      const API_BASE = globalThis.__API_BASE__ || '';
      const response = await fetch(API_BASE + '/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showSuccessMessage();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('There was an error submitting your report. Please try again.');
      
      // Reset button state
      isSubmitting = false;
      updateSubmitButton();
    }
  }

  function showSuccessMessage() {
    // Hide form and show success message
    reportForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Auto redirect after 5 seconds
    setTimeout(() => {
      window.location.href = '../home/home.html';
    }, 5000);
  }

  function resetForm() {
    // Reset all form fields
    firstName.value = '';
    lastName.value = '';
    reportDate.value = today;
    subject.value = reportedUser || '';
    message.value = '';
    
    // Clear validation states
    [firstName, lastName, reportDate, subject, message].forEach(field => {
      field.classList.remove('error');
      const errorElement = document.getElementById(field.id + 'Error');
      if (errorElement) {
        errorElement.classList.remove('show');
      }
    });
    
    // Reset counters
    updateWordAndCharCount();
    updateSubmitButton();
    
    // Show form and hide success message
    reportForm.style.display = 'block';
    successMessage.style.display = 'none';
    
    isSubmitting = false;
  }

  // Initialize
  updateWordAndCharCount();
  updateSubmitButton();
  
  // Add reset function to global scope
  globalThis.resetReportForm = resetForm;

  // Enhanced UX: Save draft to localStorage
  function saveDraft() {
    const draft = {
      firstName: firstName.value,
      lastName: lastName.value,
      subject: subject.value,
      message: message.value,
      timestamp: Date.now()
    };
    localStorage.setItem('reportDraft', JSON.stringify(draft));
  }

  function loadDraft() {
    const saved = localStorage.getItem('reportDraft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        // Only load if draft is less than 24 hours old
        if (Date.now() - draft.timestamp < 24 * 60 * 60 * 1000) {
          firstName.value = draft.firstName || '';
          lastName.value = draft.lastName || '';
          if (!reportedUser) subject.value = draft.subject || '';
          message.value = draft.message || '';
          updateWordAndCharCount();
          updateSubmitButton();
        }
      } catch (e) {
        console.log('Could not load draft');
      }
    }
  }

  function clearDraft() {
    localStorage.removeItem('reportDraft');
  }

  // Auto-save draft every 10 seconds
  setInterval(saveDraft, 10000);
  
  // Save draft on form input
  [firstName, lastName, subject, message].forEach(field => {
    field.addEventListener('input', saveDraft);
  });

  // Load draft on page load
  loadDraft();

  // Clear draft on successful submission
  const originalShowSuccess = showSuccessMessage;
  showSuccessMessage = function() {
    clearDraft();
    originalShowSuccess();
  };
});