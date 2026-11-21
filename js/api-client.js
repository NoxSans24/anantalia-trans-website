(() => {
  const baseUrl = String(window.ANANTALIA_API_BASE_URL ?? '').replace(/\/$/, '');

  function resolveMediaUrl(rawUrl) {
    if (typeof rawUrl !== 'string') return null;
    const trimmed = rawUrl.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    if (trimmed.startsWith('/')) return `${baseUrl}${trimmed}`;
    return null;
  }

  function mapCatalogModel(model, fallbackCategory = null) {
    const specs = model?.publicSpecs && typeof model.publicSpecs === 'object' ? model.publicSpecs : {};
    const rawImage = model?.imageUrl || specs.imageUrl || null;
    const features = Array.isArray(specs.features)
      ? specs.features.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim())
      : [];
    const seatCount = model?.seatCount ?? null;
    return {
      id: model.id,
      categoryId: model.categoryId || fallbackCategory?.id || '',
      slug: model.slug || '',
      name: model.name || '',
      category: model.category?.name || model.category || fallbackCategory?.name || '',
      categorySlug: model.category?.slug || model.categorySlug || fallbackCategory?.slug || '',
      description: typeof model.description === 'string' ? model.description.trim() : '',
      seatCount,
      capacity: seatCount === null || seatCount === undefined ? '' : `${seatCount} Penumpang`,
      rentalTypes: Array.isArray(model.rentalTypes) ? model.rentalTypes : [],
      image: resolveMediaUrl(rawImage),
      publicSpecs: Object.keys(specs).length ? specs : null,
      transmission: typeof specs.transmission === 'string' ? specs.transmission.trim() : '',
      fuel: typeof specs.fuel === 'string' ? specs.fuel.trim() : '',
      features,
      startingPrice: Number(model.startingPrice) > 0 ? Number(model.startingPrice) : null,
      currency: model.currency || 'IDR',
      billingUnit: model.billingUnit || 'day',
      availableUnits: Number.isFinite(Number(model.availableUnits)) ? Number(model.availableUnits) : 0,
      totalUnits: Number.isFinite(Number(model.totalUnits)) ? Number(model.totalUnits) : 0,
      availabilityStatus: model.availabilityStatus || 'on_request',
      isVerified: true,
    };
  }

  async function request(path) {
    const response = await fetch(`${baseUrl}${path}`, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`Public API unavailable (${response.status})`);
    return response.json();
  }

  async function listAllModels(category, rentalType) {
    const items = [];
    let offset = 0;
    let total = 0;
    do {
      const query = new URLSearchParams({ categoryId: category.id, rentalType, limit: '100', offset: String(offset) });
      const result = await request(`/api/v1/public/vehicle-models?${query}`);
      items.push(...result.items);
      total = result.page.total;
      offset += result.page.limit;
      if (!result.items.length) break;
    } while (offset < total);
    return items;
  }

  async function getPublicFleetCatalog({ categoryId, q, limit = 100, offset = 0 } = {}) {
    try {
      const query = new URLSearchParams({ limit: String(limit), offset: String(offset) });
      if (categoryId) query.set('categoryId', categoryId);
      if (q) query.set('q', q);
      const result = await request(`/api/v1/public/fleet-catalog?${query}`);
      if (Array.isArray(result?.items)) {
        return result.items.map((item) => mapCatalogModel(item));
      }
    } catch (err) {
      // Fallback to legacy endpoints only when /fleet-catalog route is not yet deployed (404)
      if (!String(err?.message || '').includes('(404)')) throw err;
    }

    const { items: types } = await request('/api/v1/public/rental-types');
    const pairs = await Promise.all(types.map(async ({ code }) => {
      const { items: categories } = await request(`/api/v1/public/vehicle-categories?rentalType=${encodeURIComponent(code)}`);
      return Promise.all(categories.map(async (category) => ({
        category,
        rentalType: code,
        models: await listAllModels(category, code),
      })));
    }));
    const byId = new Map();
    for (const { category, rentalType, models } of pairs.flat()) {
      for (const model of models) {
        const record = byId.get(model.id) ?? mapCatalogModel({ ...model, rentalTypes: [] }, category);
        if (!record.rentalTypes.includes(rentalType)) {
          record.rentalTypes.push(rentalType);
        }
        byId.set(model.id, record);
      }
    }
    return [...byId.values()];
  }

  async function getPublicFleetModelDetail(idOrSlug) {
    const result = await request(`/api/v1/public/vehicle-models/${encodeURIComponent(idOrSlug)}`);
    return result?.item ? mapCatalogModel(result.item) : null;
  }

  async function submitBookingRequest(data) {
    const response = await fetch(`${baseUrl}/api/v1/public/booking-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error?.message || `Permintaan booking gagal (${response.status})`);
    }
    return result;
  }

  async function getPublicContent({ section, limit = 50 } = {}) {
    const query = new URLSearchParams({ limit: String(limit) });
    if (section && section !== 'all') query.set('section', section);
    return request(`/api/v1/public/content?${query}`);
  }

  async function getPublicContentBySlug(slug) {
    return request(`/api/v1/public/content/${encodeURIComponent(slug)}`);
  }

  async function submitContactMessage(data) {
    const response = await fetch(`${baseUrl}/api/v1/public/contact-messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(result?.error?.message || `Pengiriman pesan gagal (${response.status})`);
    }
    return result;
  }

  async function getPublicSiteConfig() {
    return request('/api/v1/public/site-config');
  }

  async function recordPageView({ path: pagePath, visitorToken, dnt = false } = {}) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/public/analytics/pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ path: pagePath, visitorToken, dnt }),
        keepalive: true,
      });
      return response.ok ? response.json().catch(() => null) : null;
    } catch {
      return null;
    }
  }

  window.AnantaliaApi = Object.freeze({
    getPublicFleetCatalog,
    getPublicFleetModelDetail,
    resolveMediaUrl,
    submitBookingRequest,
    getPublicContent,
    getPublicContentBySlug,
    submitContactMessage,
    getPublicSiteConfig,
    recordPageView,
  });
})();
