(() => {
  const grid = document.getElementById('home-fleet-grid');
  const loadingState = document.getElementById('home-fleet-loading');
  const emptyState = document.getElementById('home-fleet-empty');
  const errorState = document.getElementById('home-fleet-error');
  const retryBtn = document.getElementById('home-fleet-retry-btn');
  const heroCategorySelect = document.getElementById('hero-quick-category');
  if (!grid) return;

  const MAX_HOME_CARDS = 8;
  const PLACEHOLDER_IMG = './assets/placeholder-vehicle.svg';

  const make = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const formatRupiah = (amount) => {
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(num))}`;
  };

  const formatBillingUnit = (unit) => {
    const map = { day: '/hari', hour: '/jam', trip: '/trip', package: '/paket' };
    return map[unit] || '/hari';
  };

  const buildWaUrl = (message) => {
    if (window.AnantaliaWhatsApp?.buildUrl) {
      return window.AnantaliaWhatsApp.buildUrl(message);
    }
    const phone = window.__anantaliaWaPhone || '6281383333707';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const populateHeroCategories = (items) => {
    if (!heroCategorySelect || !Array.isArray(items) || !items.length) return;
    const categories = [...new Set(items.map((item) => item.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'id'));
    if (!categories.length) return;
    const currentVal = heroCategorySelect.value || 'all';
    heroCategorySelect.replaceChildren(new Option('Semua Kategori', 'all'));
    categories.forEach((cat) => {
      heroCategorySelect.add(new Option(cat, cat));
    });
    if (categories.includes(currentVal)) {
      heroCategorySelect.value = currentVal;
    }
  };

  const buildSpecRow = (iconName, label) => {
    const row = make('div', 'flex items-center gap-1.5');
    const icon = make('span', 'material-symbols-outlined text-[16px] text-primary', iconName);
    icon.setAttribute('aria-hidden', 'true');
    row.append(icon, make('span', '', label));
    return row;
  };

  const buildHomeCard = (record) => {
    const card = make('article', 'bg-surface-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between');
    card.dataset.vehicleId = record.id;

    const topWrap = make('div', '');
    const mediaWrap = make('div', 'relative h-48 w-full overflow-hidden bg-surface-container');
    const img = make('img', 'w-full h-full object-cover hover:scale-105 transition-transform duration-500');
    img.src = record.image || PLACEHOLDER_IMG;
    img.alt = `Foto kendaraan ${record.name}`;
    img.loading = 'lazy';
    img.addEventListener('error', () => {
      if (!img.src.endsWith('/assets/placeholder-vehicle.svg')) {
        img.src = PLACEHOLDER_IMG;
        img.alt = `Ilustrasi kendaraan ${record.name}; foto belum tersedia`;
      }
    }, { once: true });
    mediaWrap.append(img);

    if (record.category) {
      const badgeWrap = make('div', 'absolute top-3 left-3 bg-surface-card/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm');
      badgeWrap.append(make('span', 'font-label-sm text-caption font-bold text-primary', record.category));
      mediaWrap.append(badgeWrap);
    }

    const body = make('div', 'p-5 flex flex-col gap-3');
    const head = make('div', '');
    head.append(make('h3', 'font-card-h3 text-headline-sm text-on-surface', record.name));
    const descText = record.description || 'Model armada terverifikasi siap untuk kebutuhan perjalanan Anda.';
    head.append(make('p', 'font-caption text-caption text-text-secondary', descText));
    body.append(head);

    const specsGrid = make('div', 'grid grid-cols-2 gap-2 text-text-secondary font-caption text-caption pt-1');
    if (record.capacity) {
      specsGrid.append(buildSpecRow('group', record.capacity));
    }
    if (record.transmission) {
      specsGrid.append(buildSpecRow('settings', record.transmission));
    }
    if (record.fuel) {
      specsGrid.append(buildSpecRow('local_gas_station', record.fuel));
    }
    if (record.rentalTypes?.length) {
      const rentalLabel = record.rentalTypes.includes('with_driver') && record.rentalTypes.includes('self_drive')
        ? 'Sopir / Lepas Kunci'
        : record.rentalTypes.includes('with_driver')
          ? 'Dengan Pengemudi'
          : 'Lepas Kunci';
      specsGrid.append(buildSpecRow('key', rentalLabel));
    }
    if (record.features?.length && specsGrid.children.length < 4) {
      for (const feat of record.features.slice(0, 4 - specsGrid.children.length)) {
        specsGrid.append(buildSpecRow('check_circle', feat));
      }
    }
    if (specsGrid.children.length) {
      body.append(specsGrid);
    }

    const priceBox = make('div', 'bg-surface-mint/60 p-3 rounded-xl flex flex-col gap-1.5 mt-2');
    const priceRow = make('div', 'flex items-center justify-between font-caption text-caption');
    priceRow.append(make('span', 'text-text-secondary', 'Tarif Mulai:'));
    if (record.startingPrice) {
      const priceVal = make('span', 'font-headline-sm text-body-sm text-primary font-bold', `Mulai ${formatRupiah(record.startingPrice)}`);
      priceVal.append(make('span', 'font-caption text-[11px] text-text-secondary font-normal', formatBillingUnit(record.billingUnit)));
      priceRow.append(priceVal);
    } else {
      priceRow.append(make('span', 'font-headline-sm text-body-sm text-primary font-bold', 'Konfirmasi via WA'));
    }
    priceBox.append(priceRow);

    const availRow = make('div', 'flex items-center justify-between font-caption text-caption pt-1 border-t border-primary/10');
    availRow.append(make('span', 'text-text-secondary', 'Ketersediaan:'));
    const availText = record.availabilityStatus === 'available'
      ? `Tersedia (${record.availableUnits} unit)`
      : record.availabilityStatus === 'in_use'
        ? 'Sedang digunakan'
        : 'Tersedia sesuai jadwal';
    availRow.append(make('span', 'font-headline-sm text-caption text-on-surface font-semibold', availText));
    priceBox.append(availRow);
    body.append(priceBox);

    topWrap.append(mediaWrap, body);

    const actions = make('div', 'p-5 pt-0 flex flex-col gap-2');
    const waLink = make('a', 'w-full py-2.5 px-3 rounded-lg bg-whatsapp-green hover:bg-[#20ba5a] text-on-primary font-headline-sm text-body-sm text-center transition-colors duration-200 flex items-center justify-center gap-1');
    waLink.href = buildWaUrl(`Halo Anatalia, saya ingin bertanya mengenai mobil ${record.name}.`);
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    const waIcon = make('span', 'material-symbols-outlined text-[18px]', 'chat');
    waIcon.setAttribute('aria-hidden', 'true');
    waLink.append(waIcon, make('span', '', 'Tanya Unit'));

    const detailLink = make('a', 'w-full py-2 px-3 rounded-lg bg-surface-page hover:bg-surface-mint text-primary font-headline-sm text-caption text-center transition-colors duration-200 flex items-center justify-center gap-1');
    detailLink.href = `./pages/armada.html?model=${encodeURIComponent(record.slug || record.id)}`;
    const arrowIcon = make('span', 'material-symbols-outlined text-[15px]', 'arrow_forward');
    arrowIcon.setAttribute('aria-hidden', 'true');
    detailLink.append(make('span', '', 'Lihat Detail Armada'), arrowIcon);

    actions.append(waLink, detailLink);
    card.append(topWrap, actions);
    return card;
  };

  const setViewState = (state) => {
    if (loadingState) loadingState.classList.toggle('hidden', state !== 'loading');
    if (emptyState) emptyState.classList.toggle('hidden', state !== 'empty');
    if (errorState) errorState.classList.toggle('hidden', state !== 'error');
    grid.classList.toggle('hidden', state !== 'ready');
  };

  const loadHomeFleet = async () => {
    setViewState('loading');
    if (!window.AnantaliaApi?.getPublicFleetCatalog) {
      setViewState('error');
      return;
    }
    try {
      const items = await window.AnantaliaApi.getPublicFleetCatalog({ limit: 100 });
      if (!Array.isArray(items) || items.length === 0) {
        grid.replaceChildren();
        setViewState('empty');
        return;
      }
      populateHeroCategories(items);
      const featured = items.slice(0, MAX_HOME_CARDS);
      grid.replaceChildren(...featured.map(buildHomeCard));
      setViewState('ready');
    } catch (error) {
      console.error('Gagal memuat armada beranda:', error);
      grid.replaceChildren();
      setViewState('error');
    }
  };

  retryBtn?.addEventListener('click', () => {
    void loadHomeFleet();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { void loadHomeFleet(); }, { once: true });
  } else {
    void loadHomeFleet();
  }
})();
