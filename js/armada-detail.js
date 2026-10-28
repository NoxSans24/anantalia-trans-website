(() => {
  const dialog = document.getElementById('vehicle-detail-modal');
  if (!(dialog instanceof HTMLDialogElement)) return;

  const title = document.getElementById('vehicle-detail-title');
  const description = document.getElementById('vehicle-detail-description');
  const descriptionIcon = document.getElementById('vehicle-detail-description-icon');
  const image = document.getElementById('vehicle-detail-image');
  const placeholder = document.getElementById('vehicle-photo-placeholder');
  const specs = document.getElementById('vehicle-detail-specs');
  const whatsapp = document.getElementById('vehicle-detail-whatsapp');
  const status = document.getElementById('vehicle-detail-status-text');
  const sources = document.getElementById('vehicle-detail-sources');
  const closeButtons = dialog.querySelectorAll('[data-close-vehicle-modal]');
  let closeTimer = null;
  const triggers = document.querySelectorAll('.toggle-detail-btn');
  const cardPlaceholderUrl = new URL('../assets/placeholder-vehicle.svg', document.baseURI).href;

  document.querySelectorAll('.fleet-card-image').forEach((cardImage) => {
    cardImage.addEventListener('error', () => {
      if (cardImage.src === cardPlaceholderUrl) return;
      cardImage.src = cardPlaceholderUrl;
      cardImage.alt = 'Ilustrasi kendaraan; foto referensi tidak dapat dimuat';
    }, { once: true });
  });

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

  closeButtons.forEach((button) => button.addEventListener('click', closeDialog));
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

  const detailFields = [
    ['Kategori', 'category', 'category'],
    ['Kegunaan', 'useCase', 'route'],
    ['Kapasitas', 'capacity', 'groups'],
    ['Transmisi', 'transmission', 'settings'],
    ['Bahan bakar', 'fuel', 'local_gas_station'],
    ['Fitur', 'features', 'star'],
    ['Tarif dalam kota', 'cityTariff', 'payments'],
    ['Paket dalam kota', 'cityTariffPackage', 'schedule'],
    ['Tarif luar kota', 'outOfCityTariff', 'payments'],
    ['Paket luar kota', 'outOfCityTariffPackage', 'route'],
    ['Ketersediaan', 'availability', 'event_available'],
    ['Fasilitas dan ketentuan', 'rentalTerms', 'rule'],
    ['Catatan gambar', 'imageNote', 'image'],
    ['Sumber gambar', 'imageSourceProvider', 'travel_explore'],
    ['Catatan sumber gambar', 'imageSourceNote', 'info'],
  ];

  const categoryIcons = {
    'City Car / EV': 'electric_car',
    'MPV Standar': 'airport_shuttle',
    'MPV Keluarga': 'family_restroom',
    Premium: 'directions_car',
    Minibus: 'airport_shuttle',
    'Bus Medium': 'directions_bus',
    'Bus Besar': 'directions_bus',
  };

  triggers.forEach((trigger, index) => {
    const card = trigger.closest('.fleet-item');
    if (!card) return;

    const modelName = card.querySelector('.fleet-card-name')?.textContent.trim() || `Unit katalog ${index + 1}`;
    const modelId = card.dataset.vehicleId || `fleet-${String(index + 1).padStart(2, '0')}`;
    trigger.dataset.vehicleId = modelId;

    trigger.addEventListener('click', () => {
      const sourceImage = card.querySelector('.fleet-card-image');
      const availableDetails = detailFields
        .map(([label, key, iconName]) => [label, key, iconName, card.dataset[key]?.trim()])
        .filter(([, , , value]) => Boolean(value));

      title.textContent = modelName;
      description.textContent = card.dataset.description?.trim() || 'Rincian belum tersedia pada data prototipe.';
      descriptionIcon.textContent = categoryIcons[card.dataset.category] || 'info';
      specs.replaceChildren();
      if (!availableDetails.length) {
        availableDetails.push(['Informasi', '', 'info', 'Spesifikasi dan ketersediaan belum tersedia.']);
      }
      status.textContent = card.dataset.isDummy === 'true'
        ? 'Data dummy untuk prototipe'
        : card.dataset.verificationStatus || 'Status belum tersedia';
      availableDetails.forEach(([label, key, iconName, fallbackValue]) => {
        const item = document.createElement('li');
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined vehicle-detail-spec-icon';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = iconName;
        const labelElement = document.createElement('span');
        labelElement.className = 'vehicle-detail-spec-label';
        labelElement.textContent = label;
        const valueElement = document.createElement('span');
        valueElement.className = 'vehicle-detail-spec-value';
        valueElement.textContent = fallbackValue || card.dataset[key]?.trim() || '';
        item.append(icon, labelElement, valueElement);
        specs.append(item);
      });

      sources.replaceChildren();
      const referenceLinks = [
        ['Cari gambar di Google', card.dataset.imageSearchUrl, 'image_search'],
        [
          card.dataset.imageLicense
            ? `Sumber foto · ${card.dataset.imageLicense}${card.dataset.imageCredit ? ` · ${card.dataset.imageCredit}` : ''}`
            : 'Sumber foto',
          card.dataset.imageSourceUrl,
          'photo_library',
        ],
        ['Sumber informasi', card.dataset.informationSourceUrl],
      ].filter(([, href]) => Boolean(href));
      referenceLinks.forEach(([label, href, iconName = 'open_in_new']) => {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        const icon = document.createElement('span');
        icon.className = 'material-symbols-outlined';
        icon.setAttribute('aria-hidden', 'true');
        icon.textContent = iconName;
        const text = document.createElement('span');
        text.textContent = label;
        link.append(icon, text);
        sources.append(link);
      });
      sources.hidden = referenceLinks.length === 0;

      image.hidden = false;
      placeholder.hidden = true;
      image.removeAttribute('src');
      if (sourceImage?.currentSrc || sourceImage?.src) {
        image.src = sourceImage.currentSrc || sourceImage.src;
        image.alt = sourceImage.alt || `Ilustrasi kendaraan ${modelName}`;
      } else {
        showPhotoPlaceholder();
      }

      const message = encodeURIComponent(`Halo ANANTALIA TRANS, saya ingin bertanya tentang ${modelName}.`);
      whatsapp.href = `https://wa.me/6281383333707?text=${message}`;
      dialog.showModal();
    });
  });
})();
