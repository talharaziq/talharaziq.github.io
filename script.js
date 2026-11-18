(() => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Reveal sections as they enter the viewport. The page still works without JS.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, io) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  // Copy email address, with a small fallback for browsers without Clipboard API.
  const copyButton = document.querySelector('[data-copy-email]');
  const toast = document.querySelector('.toast');
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };

  if (copyButton) {
    copyButton.addEventListener('click', async () => {
      const email = copyButton.getAttribute('data-copy-email');
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
          showToast('Email address copied to clipboard.');
        } else {
          const helper = document.createElement('textarea');
          helper.value = email;
          helper.setAttribute('readonly', '');
          helper.style.position = 'absolute';
          helper.style.left = '-9999px';
          document.body.appendChild(helper);
          helper.select();
          const copied = document.execCommand('copy');
          helper.remove();
          showToast(copied ? 'Email address copied to clipboard.' : `Email: ${email}`);
        }
      } catch (error) {
        showToast(`Email: ${email}`);
      }
    });
  }
})();
