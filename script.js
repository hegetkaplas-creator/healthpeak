(function () {
  const formAnchor = document.querySelector('#lead-form');
  const stickyCta = document.querySelector('#stickyCta');
  const scrollButtons = document.querySelectorAll('.scroll-to-form');
  const forms = document.querySelectorAll('.lead-form');
  const faqQuestions = document.querySelectorAll('.faq-question');
  const revealItems = document.querySelectorAll('.reveal');

  function smoothScrollToForm(event) {
    if (event) event.preventDefault();
    if (!formAnchor) return;

    formAnchor.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  scrollButtons.forEach((button) => {
    button.addEventListener('click', smoothScrollToForm);
  });

  function validateName(value) {
    return value.trim().length >= 2;
  }

  function normalizePhone(value) {
    return value.replace(/[^\d+]/g, '').trim();
  }

  function validatePhone(value) {
    const normalized = normalizePhone(value);
    const digitsOnly = normalized.replace(/\D/g, '');
    return digitsOnly.length >= 9;
  }

  function setMessage(container, text, type) {
    if (!container) return;
    container.textContent = text;
    container.className = 'form-message ' + type;
  }

  forms.forEach((form) => {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const nameInput = form.querySelector('input[name="name"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      const message = form.querySelector('.form-message');

      const name = nameInput ? nameInput.value : '';
      const phone = phoneInput ? phoneInput.value : '';

      if (!validateName(name)) {
        setMessage(message, 'Silakan isi nama minimal 2 karakter.', 'error');
        if (nameInput) nameInput.focus();
        return;
      }

      if (!validatePhone(phone)) {
        setMessage(message, 'Silakan isi nomor telepon yang valid.', 'error');
        if (phoneInput) phoneInput.focus();
        return;
      }

      setMessage(
        message,
        'Data siap dikirim. Hubungkan submit handler ini ke backend / endpoint Anda.',
        'success'
      );

      /*
        TODO:
        Hubungkan pengiriman data ke backend di sini.
        Contoh alur:
        1. Ambil nilai form
        2. Kirim via fetch() ke endpoint Anda
        3. Tampilkan status sukses / gagal
      */

      console.log('Lead form payload:', {
        name: name.trim(),
        phone: normalizePhone(phone)
      });
    });
  });

  faqQuestions.forEach((button) => {
    button.addEventListener('click', function () {
      const parent = button.closest('.faq-item');
      if (!parent) return;

      const isActive = parent.classList.contains('active');

      faqQuestions.forEach((q) => {
        const item = q.closest('.faq-item');
        if (item) item.classList.remove('active');
      });

      if (!isActive) {
        parent.classList.add('active');
      }
    });
  });

  function handleStickyVisibility() {
    if (!stickyCta || !formAnchor) return;

    const rect = formAnchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    // Прячем sticky CTA, когда пользователь уже рядом с основной формой
    const nearForm = rect.top < viewportHeight * 0.7 && rect.bottom > 0;

    if (nearForm) {
      stickyCta.classList.add('hidden');
    } else {
      stickyCta.classList.remove('hidden');
    }
  }

  window.addEventListener('scroll', handleStickyVisibility, { passive: true });
  window.addEventListener('resize', handleStickyVisibility);
  handleStickyVisibility();

  if ('IntersectionObserver' in window && revealItems.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('in-view'));
  }
})();