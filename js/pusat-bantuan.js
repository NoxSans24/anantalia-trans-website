(() => {
  const dialog = document.getElementById('modal-cabang-jakarta');
  if (!dialog) return;

  const openButtons = Array.from(document.querySelectorAll('[data-open-branch-modal]'));
  const closeButtons = Array.from(dialog.querySelectorAll('[data-close-branch-modal]'));
  if (!openButtons.length || !closeButtons.length) return;

  let activeTrigger = null;
  const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const closeDialog = () => {
    dialog.classList.add('hidden');
    dialog.setAttribute('aria-hidden', 'true');
    activeTrigger?.setAttribute('aria-expanded', 'false');
    activeTrigger?.focus();
  };

  openButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeTrigger = button;
      dialog.classList.remove('hidden');
      dialog.setAttribute('aria-hidden', 'false');
      button.setAttribute('aria-expanded', 'true');
      closeButtons[0].focus();
    });
  });

  closeButtons.forEach((button) => button.addEventListener('click', closeDialog));

  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });

  document.addEventListener('keydown', (event) => {
    if (dialog.classList.contains('hidden')) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      closeDialog();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll(focusableSelector))
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
