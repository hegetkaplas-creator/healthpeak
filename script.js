document.addEventListener("DOMContentLoaded", () => {
  const formSection = document.getElementById("form-section");
  const stickyCta = document.getElementById("stickyCta");
  const scrollButtons = document.querySelectorAll(".scroll-to-form");
  const revealItems = document.querySelectorAll(".reveal");
  const faqItems = document.querySelectorAll(".faq-item");
  const leadForm = document.getElementById("leadForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const formSuccess = document.getElementById("formSuccess");

  function scrollToForm() {
    if (!formSection) return;
    formSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }

  scrollButtons.forEach((button) => {
    button.addEventListener("click", scrollToForm);
  });

  function handleStickyVisibility() {
    if (!stickyCta || !formSection) return;

    const formRect = formSection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    const formVisible = formRect.top < viewportHeight * 0.75 && formRect.bottom > viewportHeight * 0.15;
    const nearTop = window.scrollY < 120;

    if (formVisible || nearTop) {
      stickyCta.classList.add("hidden");
    } else {
      stickyCta.classList.remove("hidden");
    }
  }

  handleStickyVisibility();
  window.addEventListener("scroll", handleStickyVisibility, { passive: true });
  window.addEventListener("resize", handleStickyVisibility);

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12
    });

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!button || !answer) return;

    button.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        const faqButton = faq.querySelector(".faq-question");
        const faqAnswer = faq.querySelector(".faq-answer");

        if (faqButton) faqButton.setAttribute("aria-expanded", "false");
        if (faqAnswer) faqAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        button.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });

  function validateName(value) {
    const cleaned = value.trim();
    if (cleaned.length < 2) {
      return "Masukkan nama yang valid.";
    }
    return "";
  }

  function validatePhone(value) {
    const cleaned = value.replace(/[^\d+]/g, "").trim();
    const digitsOnly = cleaned.replace(/\D/g, "");

    if (digitsOnly.length < 9) {
      return "Masukkan nomor telepon yang valid.";
    }

    return "";
  }

  function showFieldError(field, errorElement, message) {
    if (!field || !errorElement) return;
    errorElement.textContent = message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
  }

  if (nameInput) {
    nameInput.addEventListener("input", () => {
      showFieldError(nameInput, nameError, validateName(nameInput.value));
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", () => {
      showFieldError(phoneInput, phoneError, validatePhone(phoneInput.value));
    });
  }

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameValue = nameInput ? nameInput.value : "";
      const phoneValue = phoneInput ? phoneInput.value : "";

      const nameValidationMessage = validateName(nameValue);
      const phoneValidationMessage = validatePhone(phoneValue);

      showFieldError(nameInput, nameError, nameValidationMessage);
      showFieldError(phoneInput, phoneError, phoneValidationMessage);

      if (nameValidationMessage || phoneValidationMessage) {
        formSuccess.style.display = "none";
        return;
      }

      const payload = {
        name: nameValue.trim(),
        phone: phoneValue.trim()
      };

      // Hubungkan di sini ke backend / endpoint pengiriman form.
      // Contoh:
      // fetch("YOUR_ENDPOINT_HERE", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload)
      // })

      console.log("Lead form payload:", payload);

      formSuccess.style.display = "block";
      formSuccess.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });

      leadForm.reset();
      showFieldError(nameInput, nameError, "");
      showFieldError(phoneInput, phoneError, "");
    });
  }
});