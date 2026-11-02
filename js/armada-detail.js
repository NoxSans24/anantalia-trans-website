(() => {
  const page = document.querySelector('[data-fleet-catalogue]');
  const grid = document.getElementById('fleet-cards-container');
  const filterList = document.querySelector('[data-fleet-categories]');
  const search = document.getElementById('fleet-search-input');
  const capacityFilter = document.getElementById('fleet-capacity-filter');
  const transmissionFilter = document.getElementById('fleet-transmission-filter');
  const clearSearch = document.getElementById('clear-search-btn');
  const counter = document.getElementById('inventory-counter-text');
  const viewToggle = document.getElementById('fleet-view-toggle');
  const filterPanel = document.getElementById('fleet-filter-panel');
  const emptyState = document.getElementById('fleet-empty-state');
  const resetButton = document.getElementById('empty-state-reset-btn');
  const dialog = document.getElementById('vehicle-detail-modal');
  if (!page || !grid || !filterList || !search || !dialog) return;

  const categoryActive = ['bg-surface-mint', 'text-primary', 'shadow-sm', 'border-primary/20'];
  const categoryIdle = ['bg-surface-card', 'text-on-surface-variant', 'border-border-subtle'];
  const recommendedVehicleIds = new Set([
    'fleet-01-toyota-calya',
    'fleet-02-toyota-grand-new-avanza',
    'fleet-15-mitsubishi-xpander',
    'fleet-32-toyota-all-new-innova-zenix',
    'fleet-44-toyota-all-new-alphard',
    'fleet-38-toyota-hiace-premio'
  ]);
  let records = [];
  let selectedCategory = 'all';
  let selectedCapacity = 'all';
  let selectedTransmission = 'all';
  let query = '';
  let showAllVehicles = false;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const buildCard = (record) => {
    const card = make('article', 'fleet-item fleet-catalogue-card bg-surface-card rounded-2xl shadow-sm border border-border-subtle/60 overflow-hidden group card-visible');
    card.dataset.vehicleId = record.id;
    card.dataset.cat = record.category;
    card.dataset.model = `${record.name} ${record.category}`;
    for (const [key, value] of Object.entries({
      entryType: record.entryType, verificationStatus: record.verificationStatus,
      isDummy: String(record.isDummy), source: record.source, category: record.category,
      description: record.description, features: record.features, rentalTerms: record.rentalTerms,
      useCase: record.useCase, capacity: record.capacity, transmission: record.transmission,
      fuel: record.fuel, cityTariff: record.cityTariff, cityTariffPackage: record.cityTariffPackage,
      outOfCityTariff: record.outOfCityTariff, outOfCityTariffPackage: record.outOfCityTariffPackage,
      availability: record.availability, imageSearchUrl: record.imageSearchUrl,
      imageNote: record.imageNote, imageSourceProvider: record.imageSource?.provider,
      imageSourceUrl: record.imageSource?.url, imageLicense: record.imageSource?.license,
      imageCredit: record.imageSource?.credit, imageSourceNote: record.imageSource?.note,
      informationSourceUrl: record.informationSourceUrl
    })) {
      if (value !== undefined && value !== null) card.dataset[key] = Array.isArray(value) ? value.join(' · ') : String(value);
    }
    const imageWrap = make('div', 'fleet-card-image-wrap');
    const image = make('img', 'fleet-card-image');
    image.src = record.image || '../assets/placeholder-vehicle.svg';
    image.alt = record.imageAlt || `Ilustrasi kendaraan ${record.name}`;
    image.loading = 'lazy';
    image.addEventListener('error', () => {
      if (!image.src.endsWith('/assets/placeholder-vehicle.svg')) {
        image.src = '../assets/placeholder-vehicle.svg';
        image.alt = `Ilustrasi kendaraan ${record.name}; foto referensi tidak tersedia`;
      }
    }, { once: true });
    imageWrap.append(image);
    const content = make('div', 'fleet-card-content');
    content.append(make('h2', 'fleet-card-name', record.name));
    const priceBlock = make('div', 'fleet-card-price-block');
    priceBlock.append(make('span', 'fleet-card-price-label', 'Tarif dalam kota'), make('span', 'fleet-card-price', record.cityTariff || 'Belum tersedia'));
    content.append(priceBlock);
    const button = make('button', 'toggle-detail-btn');
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'vehicle-detail-modal');
    button.setAttribute('aria-label', `Lihat detail ${record.name}`);
    button.dataset.vehicleId = record.id;
    button.append(make('span', '', 'Lihat Detail'));
    const arrow = make('span', 'material-symbols-outlined', 'arrow_forward');
    arrow.setAttribute('aria-hidden', 'true');
    button.append(arrow);
    content.append(button);
    card.append(imageWrap, content);
    return card;
  };

  const renderFilters = () => {
    const all = make('button', `category-filter-btn px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all duration-200 ${categoryActive.join(' ')} active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30`, 'Semua');
    all.type = 'button'; all.dataset.category = 'all'; all.setAttribute('role', 'tab'); all.setAttribute('aria-selected', 'true');
    filterList.replaceChildren(all);
    [...new Set(records.map(record => record.category))].forEach(category => {
      const button = make('button', `category-filter-btn px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all duration-200 ${categoryIdle.join(' ')} hover:bg-surface-mint/70 hover:text-primary border border-border-subtle active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30`, category);
      button.type = 'button'; button.dataset.category = category; button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', 'false');
      filterList.append(button);
    });

    const populateSelect = (select, field, label) => {
      const options = [...new Set(records.map(record => record[field]).filter(Boolean))]
        .sort((left, right) => left.localeCompare(right, 'id'));
      select.replaceChildren(new Option(`Semua ${label}`, 'all'));
      options.forEach(value => select.add(new Option(value, value)));
    };
    populateSelect(capacityFilter, 'capacity', 'kapasitas');
    populateSelect(transmissionFilter, 'transmission', 'transmisi');
  };

  const update = () => {
    let visible = 0;
    const isRecommendedView = !showAllVehicles && selectedCategory === 'all' &&
      selectedCapacity === 'all' && selectedTransmission === 'all' && !query;
    grid.querySelectorAll('.fleet-item').forEach((card, index) => {
      const matchesCategory = selectedCategory === 'all' || card.dataset.cat === selectedCategory;
      const matchesQuery = !query || card.dataset.model.toLocaleLowerCase('id').includes(query);
      const matchesCapacity = selectedCapacity === 'all' || card.dataset.capacity === selectedCapacity;
      const matchesTransmission = selectedTransmission === 'all' || card.dataset.transmission === selectedTransmission;
      const matchesRecommendation = !isRecommendedView || recommendedVehicleIds.has(card.dataset.vehicleId);
      const matches = matchesCategory && matchesQuery && matchesCapacity && matchesTransmission && matchesRecommendation;
      card.classList.toggle('hidden', !matches);
      card.classList.toggle('card-visible', matches);
      card.classList.toggle('card-hidden', !matches);
      if (matches) visible += 1;
    });
    counter.textContent = isRecommendedView
      ? `${visible} mobil rekomendasi ditampilkan`
      : `${visible} item katalog ditampilkan`;
    emptyState.classList.toggle('hidden', visible > 0);
    emptyState.classList.toggle('flex', visible === 0);
    grid.classList.toggle('hidden', visible === 0);
    clearSearch.classList.toggle('hidden', search.value.trim().length === 0);
    if (viewToggle) {
      const canToggleDefaultView = selectedCategory === 'all' && selectedCapacity === 'all' &&
        selectedTransmission === 'all' && !query;
      viewToggle.hidden = !canToggleDefaultView || records.length <= recommendedVehicleIds.size;
      viewToggle.setAttribute('aria-expanded', String(showAllVehicles));
      viewToggle.textContent = showAllVehicles
        ? 'Tampilkan rekomendasi saja'
        : `Lihat semua armada (${records.length})`;
    }
  };

  const activateCategory = (category) => {
    selectedCategory = category;
    showAllVehicles = true;
    filterList.querySelectorAll('.category-filter-btn').forEach(button => {
      const active = button.dataset.category === category;
      button.classList.remove(...categoryActive, ...categoryIdle);
      button.classList.add(...(active ? categoryActive : categoryIdle));
      button.setAttribute('aria-selected', String(active));
    });
    update();
  };

  const reset = () => {
    search.value = '';
    query = '';
    capacityFilter.value = 'all';
    transmissionFilter.value = 'all';
    selectedCapacity = 'all';
    selectedTransmission = 'all';
    showAllVehicles = true;
    activateCategory('all');
  };
  filterList.addEventListener('click', (event) => {
    const button = event.target.closest('.category-filter-btn');
    if (button) activateCategory(button.dataset.category);
  });
  search.addEventListener('input', () => {
    query = search.value.trim().toLocaleLowerCase('id');
    showAllVehicles = true;
    update();
  });
  capacityFilter.addEventListener('change', () => {
    selectedCapacity = capacityFilter.value;
    showAllVehicles = true;
    update();
  });
  transmissionFilter.addEventListener('change', () => {
    selectedTransmission = transmissionFilter.value;
    showAllVehicles = true;
    update();
  });
  clearSearch.addEventListener('click', () => { search.value = ''; query = ''; update(); search.focus(); });
  resetButton?.addEventListener('click', reset);
  viewToggle?.addEventListener('click', () => {
    showAllVehicles = !showAllVehicles;
    update();
    filterPanel?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    });
  });

  const title = document.getElementById('vehicle-detail-title');
  const description = document.getElementById('vehicle-detail-description');
  const descriptionIcon = document.getElementById('vehicle-detail-description-icon');
  const image = document.getElementById('vehicle-detail-image');
  const placeholder = document.getElementById('vehicle-photo-placeholder');
  const specs = document.getElementById('vehicle-detail-specs');
  const whatsapp = document.getElementById('vehicle-detail-whatsapp');
  const status = document.getElementById('vehicle-detail-status-text');
  const sources = document.getElementById('vehicle-detail-sources');
  const detailFields = [
    ['Kategori', 'category', 'category'], ['Kegunaan', 'useCase', 'route'],
    ['Kapasitas', 'capacity', 'groups'], ['Transmisi', 'transmission', 'settings'],
    ['Bahan bakar', 'fuel', 'local_gas_station'], ['Fitur', 'features', 'star'],
    ['Tarif dalam kota', 'cityTariff', 'payments'], ['Paket dalam kota', 'cityTariffPackage', 'schedule'],
    ['Tarif luar kota', 'outOfCityTariff', 'payments'], ['Paket luar kota', 'outOfCityTariffPackage', 'route'],
    ['Ketersediaan', 'availability', 'event_available'], ['Fasilitas dan ketentuan', 'rentalTerms', 'rule'],
    ['Catatan gambar', 'imageNote', 'image'], ['Sumber gambar', 'imageSourceProvider', 'travel_explore'],
    ['Catatan sumber gambar', 'imageSourceNote', 'info']
  ];
  const categoryIcons = { 'City Car / EV': 'electric_car', 'MPV Standar': 'airport_shuttle', 'MPV Keluarga': 'family_restroom', Premium: 'directions_car', Minibus: 'airport_shuttle', 'Bus Medium': 'directions_bus', 'Bus Besar': 'directions_bus' };
  const openDetails = (record) => {
    title.textContent = record.name;
    description.textContent = record.description || 'Rincian belum tersedia pada data prototipe.';
    descriptionIcon.textContent = categoryIcons[record.category] || 'info';
    status.textContent = record.isDummy ? 'Data dummy untuk prototipe' : (record.verificationStatus || 'Status belum tersedia');
    specs.replaceChildren();
    detailFields.forEach(([label, key, iconName]) => {
      let value = record[key];
      if (Array.isArray(value)) value = value.join(' · ');
      if (key === 'imageSourceProvider') value = record.imageSource?.provider;
      if (key === 'imageSourceNote') value = record.imageSource?.note;
      if (!value) return;
      const item = make('li');
      const icon = make('span', 'material-symbols-outlined vehicle-detail-spec-icon', iconName); icon.setAttribute('aria-hidden', 'true');
      item.append(icon, make('span', 'vehicle-detail-spec-label', label), make('span', 'vehicle-detail-spec-value', String(value)));
      specs.append(item);
    });
    sources.replaceChildren();
    const links = [
      ['Cari gambar di Google', record.imageSearchUrl, 'image_search'],
      [record.imageSource?.license ? `Sumber foto · ${record.imageSource.license}${record.imageSource.credit ? ` · ${record.imageSource.credit}` : ''}` : 'Sumber foto', record.imageSource?.url, 'photo_library'],
      ['Sumber informasi', record.informationSourceUrl, 'open_in_new']
    ].filter(([, href]) => href);
    links.forEach(([label, href, iconName]) => {
      const link = make('a'); link.href = href; link.target = '_blank'; link.rel = 'noopener noreferrer';
      const icon = make('span', 'material-symbols-outlined', iconName); icon.setAttribute('aria-hidden', 'true');
      link.append(icon, make('span', '', label)); sources.append(link);
    });
    sources.hidden = links.length === 0;
    image.hidden = false; placeholder.hidden = true; image.removeAttribute('src');
    image.src = record.image || '../assets/placeholder-vehicle.svg';
    image.alt = record.imageAlt || `Ilustrasi kendaraan ${record.name}`;
    const showPlaceholder = () => { image.hidden = true; placeholder.hidden = false; };
    image.onerror = showPlaceholder;
    const message = encodeURIComponent(`Halo ANANTALIA TRANS, saya ingin bertanya tentang ${record.name}.`);
    whatsapp.href = `https://wa.me/6281383333707?text=${message}`;
    dialog.showModal();
  };
  grid.addEventListener('click', (event) => {
    const button = event.target.closest('.toggle-detail-btn');
    if (!button) return;
    const record = records.find(item => item.id === button.dataset.vehicleId);
    if (record) openDetails(record);
  });
  let closeTimer = null;
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
  dialog.querySelectorAll('[data-close-vehicle-modal]').forEach(button => button.addEventListener('click', closeDialog));
  dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(); });
  dialog.addEventListener('close', () => {
    if (closeTimer) window.clearTimeout(closeTimer);
    closeTimer = null;
    dialog.classList.remove('is-closing');
  });

  fetch('../fleet.json')
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(payload => {
      if (!Array.isArray(payload.fleet) || payload.fleet.length !== 63) throw new Error('Data katalog tidak berisi 63 unit.');
      records = payload.fleet;
      renderFilters();
      grid.replaceChildren(...records.map(buildCard));
      update();
    })
    .catch(error => {
      console.error('Katalog armada gagal dimuat:', error);
      counter.textContent = 'Katalog belum dapat dimuat';
      emptyState.classList.remove('hidden'); emptyState.classList.add('flex');
      const heading = emptyState.querySelector('h3');
      const message = emptyState.querySelector('p');
      if (heading) heading.textContent = 'Katalog belum tersedia';
      if (message) message.textContent = 'Data armada gagal dimuat. Muat ulang halaman atau hubungi pengelola situs.';
      const button = emptyState.querySelector('#empty-state-reset-btn');
      if (button) button.hidden = true;
    });
})();
