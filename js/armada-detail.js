(() => {
  const page = document.querySelector('[data-fleet-catalogue]');
  const grid = document.getElementById('fleet-cards-container');
  const filterList = document.querySelector('[data-fleet-categories]');
  const search = document.getElementById('fleet-search-input');
  const capacityFilter = document.getElementById('fleet-capacity-filter');
  const transmissionFilter = document.getElementById('fleet-transmission-filter');
  const sortSelect = document.getElementById('fleet-sort-select');
  const activeChipsContainer = document.getElementById('active-filter-chips');
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
  let records = [];
  let selectedCategory = 'all';
  let selectedCapacity = 'all';
  let selectedTransmission = 'all';
  let selectedSort = 'default';
  let query = '';
  let showAllVehicles = false;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const renderSkeletonCards = () => {
    const skeletons = Array.from({ length: 6 }, () => {
      const card = make('div', 'fleet-skeleton-card');
      card.setAttribute('aria-hidden', 'true');
      const media = make('div', 'fleet-skeleton-media shimmer-active');
      const body = make('div', 'p-5 flex flex-col gap-3');
      const lineTitle = make('div', 'fleet-skeleton-line w-3/4 h-5 shimmer-active');
      const lineSub = make('div', 'fleet-skeleton-line w-1/2 h-3.5 shimmer-active');
      const lineBtn = make('div', 'fleet-skeleton-line w-full h-10 mt-2 shimmer-active');
      body.append(lineTitle, lineSub, lineBtn);
      card.append(media, body);
      return card;
    });
    grid.replaceChildren(...skeletons);
  };
  renderSkeletonCards();

  const parseCapacityNum = (val) => {
    if (!val) return 0;
    const match = String(val).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  const formatRupiah = (amount) => {
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) return '';
    return `Rp ${new Intl.NumberFormat('id-ID').format(Math.round(num))}`;
  };

  const formatRentalTypes = (types) => {
    if (!Array.isArray(types) || !types.length) return '';
    return types.map((t) => (t === 'self_drive' ? 'Lepas Kunci' : t === 'with_driver' ? 'Dengan Pengemudi' : t)).join(' · ');
  };

  const buildWaUrl = (message) => {
    if (window.AnantaliaWhatsApp?.buildUrl) {
      return window.AnantaliaWhatsApp.buildUrl(message);
    }
    const waPhone = window.__anantaliaWaPhone || '6281383333707';
    return `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`;
  };

  const buildCard = (record) => {
    const card = make('article', 'fleet-item fleet-catalogue-card bg-surface-card rounded-2xl shadow-sm border border-border-subtle/60 overflow-hidden group card-visible');
    card.dataset.vehicleId = record.id;
    card.dataset.cat = record.category;
    card.dataset.model = `${record.name} ${record.category} ${record.description || ''}`;
    for (const [key, value] of Object.entries({
      category: record.category,
      capacity: record.capacity,
      transmission: record.transmission,
    })) {
      if (value !== undefined && value !== null && value !== '') {
        card.dataset[key] = Array.isArray(value) ? value.join(' · ') : String(value);
      }
    }
    const imageWrap = make('div', 'fleet-card-image-wrap');
    const image = make('img', 'fleet-card-image');
    image.src = record.image || '../assets/placeholder-vehicle.svg';
    image.alt = record.imageAlt || `Foto kendaraan ${record.name}`;
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
    if (record.startingPrice) {
      const priceBlock = make('div', 'fleet-card-price-block');
      priceBlock.append(
        make('span', 'fleet-card-price-label', record.capacity || record.category || 'Tarif mulai'),
        make('span', 'fleet-card-price', `Mulai ${formatRupiah(record.startingPrice)}/hari`)
      );
      content.append(priceBlock);
    }
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
    const hasTransmissionData = records.some((record) => Boolean(record.transmission));
    if (hasTransmissionData) {
      transmissionFilter.closest('label')?.removeAttribute('hidden');
    } else {
      transmissionFilter.closest('label')?.setAttribute('hidden', '');
    }
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

  const renderActiveChips = () => {
    if (!activeChipsContainer) return;
    activeChipsContainer.replaceChildren();
    const chips = [];
    if (selectedCategory !== 'all') {
      chips.push({ label: `Kategori: ${selectedCategory}`, clear: () => activateCategory('all') });
    }
    if (selectedCapacity !== 'all') {
      chips.push({ label: `Kapasitas: ${selectedCapacity}`, clear: () => { capacityFilter.value = 'all'; selectedCapacity = 'all'; update(); } });
    }
    if (query) {
      chips.push({ label: `Pencarian: "${search.value.trim()}"`, clear: () => { search.value = ''; query = ''; update(); } });
    }
    if (selectedSort !== 'default') {
      const sortLabel = sortSelect?.selectedOptions?.[0]?.textContent || selectedSort;
      chips.push({ label: `Urutan: ${sortLabel}`, clear: () => { if (sortSelect) sortSelect.value = 'default'; selectedSort = 'default'; applySorting(); update(); } });
    }
    if (!chips.length) {
      activeChipsContainer.classList.add('hidden');
      return;
    }
    activeChipsContainer.classList.remove('hidden');
    chips.forEach(({ label, clear }) => {
      const btn = make('button', 'active-filter-chip');
      btn.type = 'button';
      btn.setAttribute('aria-label', `Hapus filter ${label}`);
      btn.append(make('span', '', label));
      const closeIcon = make('span', 'material-symbols-outlined text-[14px]', 'close');
      closeIcon.setAttribute('aria-hidden', 'true');
      btn.append(closeIcon);
      btn.addEventListener('click', clear);
      activeChipsContainer.append(btn);
    });
  };

  const applySorting = () => {
    const cards = Array.from(grid.querySelectorAll('.fleet-item'));
    if (!cards.length) return;
    const recordMap = new Map(records.map((r, i) => [r.id, { record: r, index: i }]));
    cards.sort((a, b) => {
      const itemA = recordMap.get(a.dataset.vehicleId);
      const itemB = recordMap.get(b.dataset.vehicleId);
      if (!itemA || !itemB) return 0;
      if (selectedSort === 'name-asc') return itemA.record.name.localeCompare(itemB.record.name, 'id');
      if (selectedSort === 'name-desc') return itemB.record.name.localeCompare(itemA.record.name, 'id');
      if (selectedSort === 'capacity-asc') return parseCapacityNum(itemA.record.capacity) - parseCapacityNum(itemB.record.capacity);
      if (selectedSort === 'capacity-desc') return parseCapacityNum(itemB.record.capacity) - parseCapacityNum(itemA.record.capacity);
      return itemA.index - itemB.index;
    });
    grid.replaceChildren(...cards);
  };

  const update = () => {
    let visible = 0;
    grid.querySelectorAll('.fleet-item').forEach((card) => {
      const matchesCategory = selectedCategory === 'all' || card.dataset.cat === selectedCategory;
      const matchesQuery = !query || card.dataset.model.toLocaleLowerCase('id').includes(query);
      const matchesCapacity = selectedCapacity === 'all' || card.dataset.capacity === selectedCapacity;
      const matchesTransmission = selectedTransmission === 'all' || card.dataset.transmission === selectedTransmission;
      const matches = matchesCategory && matchesQuery && matchesCapacity && matchesTransmission;
      card.classList.toggle('hidden', !matches);
      card.classList.toggle('card-visible', matches);
      card.classList.toggle('card-hidden', !matches);
      if (matches) visible += 1;
    });
    counter.textContent = `${visible} model terverifikasi ditampilkan`;
    emptyState.classList.toggle('hidden', visible > 0);
    emptyState.classList.toggle('flex', visible === 0);
    grid.classList.toggle('hidden', visible === 0);
    clearSearch.classList.toggle('hidden', search.value.trim().length === 0);
    if (viewToggle) {
      viewToggle.hidden = true;
    }
    renderActiveChips();
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
    if (sortSelect) sortSelect.value = 'default';
    selectedCapacity = 'all';
    selectedTransmission = 'all';
    selectedSort = 'default';
    showAllVehicles = true;
    applySorting();
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
  sortSelect?.addEventListener('change', () => {
    selectedSort = sortSelect.value;
    applySorting();
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
    ['Kategori', 'category', 'category'],
    ['Kapasitas tempat duduk', 'capacity', 'groups'],
    ['Jenis sewa terverifikasi', 'rentalTypesLabel', 'key'],
    ['Transmisi', 'transmission', 'settings'],
    ['Bahan bakar', 'fuel', 'local_gas_station'],
    ['Tarif mulai', 'startingPriceLabel', 'payments'],
    ['Fasilitas', 'featuresLabel', 'check_circle'],
  ];
  const categoryIcons = { 'City Car / EV': 'electric_car', 'MPV Standar': 'airport_shuttle', 'MPV Keluarga': 'family_restroom', Premium: 'directions_car', Minibus: 'airport_shuttle', 'Bus Medium': 'directions_bus', 'Bus Besar': 'directions_bus' };

  // --- Booking form state ---
  let activeRecord = null;
  let bookingFormVisible = false;

  /** Build the booking request form once and return it. */
  const buildBookingForm = () => {
    const section = make('section', 'vehicle-booking-form');
    section.setAttribute('aria-label', 'Form permintaan sewa');
    section.hidden = true;

    const formTitle = make('h3', 'vehicle-booking-form-title');
    formTitle.textContent = 'Ajukan permintaan sewa';

    const notice = make('div', 'vehicle-booking-notice');
    const noticeIcon = make('span', 'material-symbols-outlined', 'info');
    noticeIcon.setAttribute('aria-hidden', 'true');
    const noticeText = make('p', '');
    noticeText.textContent = 'Konfirmasi ketersediaan dan tarif dilakukan oleh tim kami melalui WhatsApp resmi (+62 813-8333-3707).';
    notice.append(noticeIcon, noticeText);

    const form = document.createElement('form');
    form.id = 'vehicle-booking-request-form';
    form.noValidate = true;

    const stepDefs = [
      {
        step: '1',
        title: 'Data Pemesan & Kontak',
        fields: [
          { id: 'bk-name', label: 'Nama lengkap', type: 'text', name: 'customerName', required: true, placeholder: 'Contoh: Budi Santoso' },
          { id: 'bk-phone', label: 'Nomor WhatsApp (E.164)', type: 'tel', name: 'whatsappPhone', required: true, placeholder: '+6281234567890' },
        ],
      },
      {
        step: '2',
        title: 'Jadwal & Jenis Layanan Sewa',
        fields: [
          { id: 'bk-rental', label: 'Jenis sewa', type: 'select', name: 'rentalType', required: true },
          { id: 'bk-start', label: 'Tanggal mulai sewa', type: 'date', name: 'startsOn', required: true },
          { id: 'bk-end', label: 'Tanggal selesai sewa', type: 'date', name: 'endsOn', required: true },
        ],
        hasDurationPill: true,
      },
      {
        step: '3',
        title: 'Titik Penjemputan & Catatan',
        fields: [
          { id: 'bk-pickup', label: 'Lokasi jemput', type: 'text', name: 'pickupLocation', required: true, placeholder: 'Contoh: Bandara YIA / Stasiun Tugu' },
          { id: 'bk-notes', label: 'Catatan tambahan', type: 'textarea', name: 'additionalNotes', required: false, placeholder: 'Kebutuhan khusus, jumlah penumpang, dll.' },
        ],
      },
    ];

    const durationSummary = make('div', 'booking-duration-pill');
    durationSummary.id = 'booking-duration-summary';
    durationSummary.hidden = true;

    stepDefs.forEach(({ step, title: stepTitle, fields, hasDurationPill }) => {
      const stepBox = make('div', 'booking-step-group');
      const stepHeader = make('div', 'booking-step-header');
      stepHeader.append(make('span', 'booking-step-badge', step), make('span', '', stepTitle));
      stepBox.append(stepHeader);

      fields.forEach(({ id, label, type, name, required, placeholder: ph }) => {
        const group = make('div', 'vehicle-booking-field');
        const lbl = document.createElement('label');
        lbl.htmlFor = id;
        lbl.className = 'vehicle-booking-label';
        lbl.textContent = label + (required ? '' : ' (opsional)');
        let control;
        if (type === 'textarea') {
          control = document.createElement('textarea');
          control.rows = 2;
          control.className = 'vehicle-booking-input';
        } else if (type === 'select') {
          control = document.createElement('select');
          control.className = 'vehicle-booking-input';
          control.add(new Option('Dengan Pengemudi (with_driver)', 'with_driver'));
          control.add(new Option('Lepas Kunci (self_drive)', 'self_drive'));
        } else {
          control = document.createElement('input');
          control.type = type;
          control.className = 'vehicle-booking-input';
        }
        control.id = id;
        control.name = name;
        control.required = !!required;
        if (ph) control.placeholder = ph;
        const err = make('span', 'vehicle-booking-field-error');
        err.setAttribute('role', 'alert');
        err.hidden = true;
        group.append(lbl, control, err);
        stepBox.append(group);
      });

      if (hasDurationPill) {
        stepBox.append(durationSummary);
      }
      form.append(stepBox);
    });

    const updateDurationPill = () => {
      const startVal = form.querySelector('[name="startsOn"]')?.value;
      const endVal = form.querySelector('[name="endsOn"]')?.value;
      if (!startVal || !endVal || endVal < startVal) {
        durationSummary.hidden = true;
        return;
      }
      const startMs = new Date(`${startVal}T00:00:00`).getTime();
      const endMs = new Date(`${endVal}T00:00:00`).getTime();
      const diffDays = Math.floor((endMs - startMs) / 86400000) + 1;
      if (diffDays > 0) {
        durationSummary.textContent = `Estimasi durasi perjalanan: ${diffDays} hari sewa`;
        durationSummary.hidden = false;
      } else {
        durationSummary.hidden = true;
      }
    };

    form.querySelector('[name="startsOn"]')?.addEventListener('change', updateDurationPill);
    form.querySelector('[name="endsOn"]')?.addEventListener('change', updateDurationPill);

    const formStatus = make('p', 'vehicle-booking-status');
    formStatus.setAttribute('role', 'status');
    formStatus.hidden = true;

    const formActions = make('div', 'vehicle-booking-actions');
    const cancelBtn = make('button', 'vehicle-modal-secondary', 'Batal');
    cancelBtn.type = 'button';
    const submitBtn = make('button', 'vehicle-booking-submit', 'Kirim permintaan');
    submitBtn.type = 'submit';
    formActions.append(cancelBtn, submitBtn);

    form.append(formStatus, formActions);
    section.append(formTitle, notice, form);

    // Success panel (shown after successful submission)
    const successPanel = make('div', 'vehicle-booking-success');
    successPanel.hidden = true;
    const successIcon = make('span', 'material-symbols-outlined vehicle-booking-success-icon', 'check_circle');
    successIcon.setAttribute('aria-hidden', 'true');
    const successTitle = make('h3', 'vehicle-booking-success-title', 'Permintaan terkirim');
    const successCode = make('p', 'vehicle-booking-success-code');
    const successNote = make('p', 'vehicle-booking-success-note', 'Tim kami akan meninjau permintaan dan menghubungi Anda.');
    const successWaLink = make('a', 'vehicle-modal-whatsapp');
    successWaLink.target = '_blank';
    successWaLink.rel = 'noopener noreferrer';
    successWaLink.hidden = true;
    const successWaIcon = make('span', 'material-symbols-outlined', 'chat');
    successWaIcon.setAttribute('aria-hidden', 'true');
    successWaLink.append(successWaIcon, make('span', '', 'Konfirmasi Pemesanan via WhatsApp'));
    successPanel.append(successIcon, successTitle, successCode, successNote, successWaLink);
    section.append(successPanel);

    // Form validation helper
    const clearErrors = () => {
      form.querySelectorAll('.vehicle-booking-field-error').forEach((el) => { el.textContent = ''; el.hidden = true; });
    };

    const validateForm = () => {
      let valid = true;
      const fields = form.querySelectorAll('[name]');
      clearErrors();
      fields.forEach((field) => {
        const errEl = field.parentElement?.querySelector('.vehicle-booking-field-error');
        if (field.required && !field.value.trim()) {
          if (errEl) { errEl.textContent = 'Kolom ini wajib diisi.'; errEl.hidden = false; }
          valid = false;
        }
      });
      const nameField = form.querySelector('[name="customerName"]');
      const nameErr = nameField?.parentElement?.querySelector('.vehicle-booking-field-error');
      if (nameField?.value && nameField.value.trim().length > 150) {
        if (nameErr) { nameErr.textContent = 'Nama maksimal 150 karakter.'; nameErr.hidden = false; }
        valid = false;
      }
      const phoneField = form.querySelector('[name="whatsappPhone"]');
      const phoneErr = phoneField?.parentElement?.querySelector('.vehicle-booking-field-error');
      if (phoneField?.value && !/^\+[1-9]\d{6,14}$/.test(phoneField.value.trim())) {
        if (phoneErr) { phoneErr.textContent = 'Format nomor harus E.164: +6281234567890 (awali dengan +).'; phoneErr.hidden = false; }
        valid = false;
      }
      const pickupField = form.querySelector('[name="pickupLocation"]');
      const pickupErr = pickupField?.parentElement?.querySelector('.vehicle-booking-field-error');
      if (pickupField?.value && (pickupField.value.trim().length < 3 || pickupField.value.trim().length > 500)) {
        if (pickupErr) { pickupErr.textContent = 'Lokasi jemput harus 3 hingga 500 karakter.'; pickupErr.hidden = false; }
        valid = false;
      }
      const startField = form.querySelector('[name="startsOn"]');
      const endField = form.querySelector('[name="endsOn"]');
      const endErr = endField?.parentElement?.querySelector('.vehicle-booking-field-error');
      if (startField?.value && endField?.value && endField.value < startField.value) {
        if (endErr) { endErr.textContent = 'Tanggal selesai tidak boleh sebelum tanggal mulai.'; endErr.hidden = false; }
        valid = false;
      }
      return valid;
    };

    // Form submit handler
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearErrors();
      formStatus.hidden = true;

      const data = {};
      new FormData(form).forEach((value, key) => { data[key] = String(value).trim(); });
      if (!validateForm(data)) return;

      submitBtn.disabled = true;
      formStatus.textContent = 'Mengirim permintaan…';
      formStatus.hidden = false;

      try {
        const payload = {
          customerName: data.customerName,
          whatsappPhone: data.whatsappPhone,
          categoryId: activeRecord?.categoryId,
          modelId: activeRecord?.id,
          rentalType: data.rentalType,
          startsOn: data.startsOn,
          endsOn: data.endsOn,
          pickupLocation: data.pickupLocation,
          additionalNotes: data.additionalNotes || undefined,
        };
        const result = await window.AnantaliaApi.submitBookingRequest(payload);
        form.hidden = true;
        const code = result?.bookingCode ?? '';
        successCode.textContent = `Kode permintaan Anda: ${code || '—'}`;
        successNote.textContent = result?.notice || 'Permintaan tersimpan dan menunggu konfirmasi admin.';
        const modelLabel = activeRecord?.name || 'armada pilihan';
        const bookingWaMsg = code
          ? `Halo Anatalia, saya ingin bertanya mengenai pemesanan mobil ${modelLabel} (Kode: ${code}).`
          : `Halo Anatalia, saya ingin bertanya mengenai pemesanan mobil ${modelLabel}.`;
        successWaLink.href = buildWaUrl(bookingWaMsg);
        successWaLink.hidden = false;
        successPanel.hidden = false;
      } catch (error) {
        formStatus.textContent = error.message || 'Permintaan gagal dikirim. Coba lagi.';
        formStatus.setAttribute('role', 'alert');
        submitBtn.disabled = false;
      }
    });

    cancelBtn.addEventListener('click', () => {
      section.hidden = true;
      bookingFormVisible = false;
      const actionsBar = dialog.querySelector('.vehicle-detail-actions');
      if (actionsBar) actionsBar.hidden = false;
    });

    return { section, successPanel, form, formStatus, submitBtn, durationSummary };
  };

  const bookingForm = buildBookingForm();
  const detailContent = dialog.querySelector('.vehicle-detail-content');
  if (detailContent) {
    const actionsBar = detailContent.querySelector('.vehicle-detail-actions');
    if (actionsBar) {
      actionsBar.before(bookingForm.section);
    } else {
      detailContent.append(bookingForm.section);
    }
  }

  const actionsBar = dialog.querySelector('.vehicle-detail-actions');
  const requestBookingBtn = make('button', 'vehicle-booking-trigger', 'Ajukan Sewa');
  requestBookingBtn.type = 'button';
  requestBookingBtn.setAttribute('aria-controls', 'vehicle-booking-request-form');
  if (actionsBar) actionsBar.append(requestBookingBtn);

  requestBookingBtn.addEventListener('click', () => {
    bookingForm.form.reset();
    bookingForm.durationSummary.hidden = true;
    const rentalSelect = bookingForm.form.querySelector('[name="rentalType"]');
    if (rentalSelect && activeRecord) {
      const supported = Array.isArray(activeRecord.rentalTypes) ? activeRecord.rentalTypes : [];
      [...rentalSelect.options].forEach((option) => { option.hidden = supported.length > 0 && !supported.includes(option.value); option.disabled = option.hidden; });
      const first = [...rentalSelect.options].find((option) => !option.disabled);
      if (first) rentalSelect.value = first.value;
    }
    bookingForm.form.querySelectorAll('.vehicle-booking-field-error').forEach((el) => { el.textContent = ''; el.hidden = true; });
    bookingForm.formStatus.hidden = true;
    bookingForm.formStatus.textContent = '';
    bookingForm.submitBtn.disabled = false;
    bookingForm.form.hidden = false;
    bookingForm.successPanel.hidden = true;
    bookingFormVisible = true;
    bookingForm.section.hidden = false;
    actionsBar.hidden = true;
    bookingForm.section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  const openDetails = (record) => {
    activeRecord = record;
    bookingFormVisible = false;
    bookingForm.section.hidden = true;
    bookingForm.form.hidden = false;
    bookingForm.successPanel.hidden = true;
    if (actionsBar) actionsBar.hidden = false;

    title.textContent = record.name;
    description.textContent = record.description || 'Model armada terverifikasi di katalog Anatalia Trans. Hubungi tim kami untuk konfirmasi jadwal dan ketersediaan unit.';
    descriptionIcon.textContent = categoryIcons[record.category] || 'info';
    status.textContent = record.availabilityStatus === 'available'
      ? `Tersedia (${record.availableUnits} unit siap)`
      : record.availabilityStatus === 'in_use'
        ? 'Unit sedang digunakan — konfirmasi jadwal via WhatsApp'
        : 'Data model terverifikasi dari server';
    const enrichedRecord = {
      ...record,
      rentalTypesLabel: formatRentalTypes(record.rentalTypes),
      startingPriceLabel: record.startingPrice ? `Mulai ${formatRupiah(record.startingPrice)}/hari` : '',
      featuresLabel: Array.isArray(record.features) && record.features.length ? record.features.join(' · ') : '',
    };
    specs.replaceChildren();
    detailFields.forEach(([label, key, iconName]) => {
      let value = enrichedRecord[key];
      if (Array.isArray(value)) value = value.join(' · ');
      if (!value) return;
      const item = make('li');
      const icon = make('span', 'material-symbols-outlined vehicle-detail-spec-icon', iconName); icon.setAttribute('aria-hidden', 'true');
      item.append(icon, make('span', 'vehicle-detail-spec-label', label), make('span', 'vehicle-detail-spec-value', String(value)));
      specs.append(item);
    });
    sources.replaceChildren();
    sources.hidden = true;
    const showPlaceholder = () => { image.hidden = true; placeholder.hidden = false; };
    image.onerror = showPlaceholder;
    if (record.image) {
      image.hidden = false;
      placeholder.hidden = true;
      image.src = record.image;
      image.alt = record.imageAlt || `Foto kendaraan ${record.name}`;
    } else {
      image.removeAttribute('src');
      showPlaceholder();
    }
    if (whatsapp) {
      const waMsg = `Halo Anatalia, saya ingin bertanya mengenai mobil ${record.name}.`;
      whatsapp.href = buildWaUrl(waMsg);
      whatsapp.target = '_blank';
      whatsapp.rel = 'noopener noreferrer';
      whatsapp.hidden = false;
    }
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

  const applyUrlQueryParams = async () => {
    const params = new URLSearchParams(window.location.search);
    const paramQ = params.get('q');
    const paramCategory = params.get('category');
    const paramCapacity = params.get('capacity');
    const paramModel = params.get('model');
    if (paramQ) {
      search.value = paramQ.trim();
      query = search.value.toLocaleLowerCase('id');
    }
    if (paramCapacity && [...capacityFilter.options].some(opt => opt.value === paramCapacity)) {
      capacityFilter.value = paramCapacity;
      selectedCapacity = paramCapacity;
    }
    if (paramCategory && paramCategory !== 'all') {
      const matchingBtn = [...filterList.querySelectorAll('.category-filter-btn')]
        .find(btn => btn.dataset.category?.toLocaleLowerCase('id') === paramCategory.toLocaleLowerCase('id'));
      if (matchingBtn) {
        activateCategory(matchingBtn.dataset.category);
      } else {
        update();
      }
    } else {
      update();
    }

    if (paramModel) {
      const needle = paramModel.trim().toLowerCase();
      let match = records.find((item) => item.slug?.toLowerCase() === needle || item.id?.toLowerCase() === needle);
      if (!match && window.AnantaliaApi?.getPublicFleetModelDetail) {
        try {
          match = await window.AnantaliaApi.getPublicFleetModelDetail(paramModel.trim());
        } catch {
          match = null;
        }
      }
      if (match) openDetails(match);
    }
  };

  // Optional capacity guide quick-filter buttons
  document.querySelectorAll('[data-quick-category]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetCat = btn.getAttribute('data-quick-category');
      if (!targetCat) return;
      activateCategory(targetCat);
      filterPanel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.AnantaliaApi.getPublicFleetCatalog()
    .then(items => {
      records = items;
      const headerCount = document.getElementById('fleet-header-count');
      if (headerCount) headerCount.textContent = `${records.length} model`;
      renderFilters();
      grid.replaceChildren(...records.map(buildCard));
      void applyUrlQueryParams();
    })
    .catch(error => {
      console.error('Katalog armada gagal dimuat:', error);
      grid.replaceChildren();
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
