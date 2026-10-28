(() => {
  const scrollToTopButton = document.getElementById('scrollToTopBtn');
  if (scrollToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollToTopButton.classList.remove('opacity-0', 'translate-y-3', 'pointer-events-none');
        scrollToTopButton.classList.add('opacity-100', 'translate-y-0');
      } else {
        scrollToTopButton.classList.add('opacity-0', 'translate-y-3', 'pointer-events-none');
        scrollToTopButton.classList.remove('opacity-100', 'translate-y-0');
      }
    }, { passive: true });

    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  const desktopNavigation = document.querySelector('[data-site-navigation]') ||
    document.querySelector('header nav:not(#mobile-navigation)');
  const mobileNavigation = document.getElementById('mobile-navigation');
  const toggle = document.querySelector('[data-mobile-nav-toggle]');

  if (!desktopNavigation || !mobileNavigation || !toggle || toggle.dataset.initialized) {
    return;
  }

  toggle.dataset.initialized = 'true';
  const links = Array.from(desktopNavigation.querySelectorAll('a'), (sourceLink) => {
    const link = sourceLink.cloneNode(true);
    link.className = 'block rounded-lg px-space-md py-space-sm text-body-default text-on-surface-variant hover:bg-surface-mint hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
    return link;
  });
  mobileNavigation.replaceChildren(...links);

  const icon = toggle.querySelector('[data-mobile-nav-icon]');
  const setOpen = (open, returnFocus = false) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mobileNavigation.classList.toggle('hidden', !open);
    mobileNavigation.classList.toggle('flex', open);
    mobileNavigation.setAttribute('aria-hidden', String(!open));
    if (icon) icon.textContent = open ? 'close' : 'menu';
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  mobileNavigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('click', (event) => {
    if (toggle.getAttribute('aria-expanded') === 'true' &&
        !toggle.contains(event.target) &&
        !mobileNavigation.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  const desktopBreakpoint = window.matchMedia('(min-width: 1024px)');
  desktopBreakpoint.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();
