(() => {
  const items = Array.from(document.querySelectorAll('.faq-item'));
  const pendingClosures = new WeakMap();

  const closeItem = (item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    if (!trigger || !content) return;

    item.setAttribute('data-state', 'closed');
    trigger.setAttribute('aria-expanded', 'false');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    icon?.classList.remove('rotate-180');

    const previousTimer = pendingClosures.get(content);
    if (previousTimer) clearTimeout(previousTimer);
    pendingClosures.set(content, setTimeout(() => {
      if (item.getAttribute('data-state') === 'closed') content.classList.add('hidden');
      pendingClosures.delete(content);
    }, 280));
  };

  const openItem = (item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    if (!trigger || !content) return;

    const previousTimer = pendingClosures.get(content);
    if (previousTimer) clearTimeout(previousTimer);
    pendingClosures.delete(content);
    item.setAttribute('data-state', 'open');
    trigger.setAttribute('aria-expanded', 'true');
    content.classList.remove('hidden');
    content.style.maxHeight = '0px';
    content.style.opacity = '0';
    requestAnimationFrame(() => {
      if (item.getAttribute('data-state') !== 'open') return;
      content.style.maxHeight = `${content.scrollHeight}px`;
      content.style.opacity = '1';
    });
    icon?.classList.add('rotate-180');
  };

  items.forEach((item, index) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    const questionId = `faq-question-${index + 1}`;
    const contentId = `faq-answer-${index + 1}`;
    trigger.id = questionId;
    trigger.setAttribute('aria-controls', contentId);
    content.id = contentId;
    content.setAttribute('role', 'region');
    content.setAttribute('aria-labelledby', questionId);

    if (item.getAttribute('data-state') === 'open') {
      content.classList.remove('hidden');
      content.style.maxHeight = `${content.scrollHeight}px`;
      content.style.opacity = '1';
      trigger.setAttribute('aria-expanded', 'true');
      item.querySelector('.faq-icon')?.classList.add('rotate-180');
    } else {
      content.classList.add('hidden');
      content.style.maxHeight = '0px';
      content.style.opacity = '0';
      trigger.setAttribute('aria-expanded', 'false');
      item.querySelector('.faq-icon')?.classList.remove('rotate-180');
    }

    trigger.addEventListener('click', () => {
      const isOpen = item.getAttribute('data-state') === 'open';
      items.forEach((other) => {
        if (other !== item) closeItem(other);
      });
      if (isOpen) closeItem(item);
      else openItem(item);
    });
  });

  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-visible'));
  }
})();
