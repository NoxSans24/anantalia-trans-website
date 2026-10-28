(() => {
  const dialog = document.getElementById('service-detail-modal');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const title = document.getElementById('service-detail-title');
  const description = document.getElementById('service-detail-description');
  const image = document.getElementById('service-detail-image');
  const placeholder = document.getElementById('service-photo-placeholder');
  const extra = document.getElementById('service-detail-extra');
  const features = document.getElementById('service-detail-features');
  const whatsapp = document.getElementById('service-detail-whatsapp');
  let closeTimer = null;

  const showPhotoPlaceholder = () => {
    image.hidden = true;
    placeholder.hidden = false;
  };
  image.addEventListener('error', showPhotoPlaceholder);

  const closeDialog = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    closeTimer = window.setTimeout(() => {
      if (dialog.open) dialog.close();
      dialog.classList.remove('is-closing');
      closeTimer = null;
    }, reducedMotion ? 10 : 170);
  };

  dialog.querySelectorAll('[data-close-service-modal]').forEach((button) => button.addEventListener('click', closeDialog));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDialog();
  });
  dialog.addEventListener('close', () => {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-closing');
  });

  document.querySelectorAll('[data-service-detail-trigger]').forEach((trigger, index) => {
    const card = trigger.closest('.service-card');
    if (!card) return;

    const titleElement = card.querySelector('h2');
    const serviceName = titleElement?.textContent.trim() || `Layanan ${index + 1}`;
    const serviceId = `service-${String(index + 1).padStart(2, '0')}-${(card.dataset.category || 'layanan').replace(/[^a-z0-9-]/gi, '')}`;
    card.dataset.serviceId = serviceId;
    trigger.dataset.serviceId = serviceId;

    trigger.addEventListener('click', () => {
      const sourceImage = card.querySelector('img');
      const summary = card.querySelector('p.font-body-default');
      const sourceFeatures = card.querySelector('.p-6 ul, .md\\:p-8 ul, ul');
      const detailPanel = card.querySelector('[id^="detail-"]');

      title.textContent = serviceName;
      description.textContent = summary?.textContent.trim() || 'Informasi layanan belum tersedia.';
      extra.replaceChildren();
      features.replaceChildren();

      if (detailPanel) {
        Array.from(detailPanel.children).forEach((child) => extra.append(child.cloneNode(true)));
      }
      if (sourceFeatures) {
        Array.from(sourceFeatures.children).forEach((item) => features.append(item.cloneNode(true)));
      }
      if (!extra.children.length && !features.children.length) {
        const item = document.createElement('li');
        item.textContent = 'Rincian layanan belum tersedia.';
        features.append(item);
      }

      image.hidden = false;
      placeholder.hidden = true;
      image.removeAttribute('src');
      if (sourceImage?.currentSrc || sourceImage?.src) {
        image.src = sourceImage.currentSrc || sourceImage.src;
        image.alt = sourceImage.alt || `Foto layanan ${serviceName}`;
      } else {
        showPhotoPlaceholder();
      }

      const sourceWhatsApp = card.querySelector('a[href*="wa.me/"]');
      whatsapp.href = sourceWhatsApp?.href || 'https://wa.me/6281383333707';
      dialog.showModal();
    });
  });
})();

