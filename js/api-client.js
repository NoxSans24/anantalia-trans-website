(() => {
  const baseUrl = String(window.ANANTALIA_API_BASE_URL ?? '').replace(/\/$/, '');

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

  async function getPublicFleetCatalog() {
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
        const record = byId.get(model.id) ?? {
          id: model.id,
          categoryId: category.id,
          slug: model.slug,
          name: model.name,
          category: category.name,
          capacity: model.seatCount === null ? '' : String(model.seatCount),
          rentalTypes: [],
          image: null,
          isVerified: true,
        };
        record.rentalTypes.push(rentalType);
        byId.set(model.id, record);
      }
    }
    return [...byId.values()];
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
    submitBookingRequest,
    getPublicContent,
    getPublicContentBySlug,
    submitContactMessage,
    getPublicSiteConfig,
    recordPageView,
  });
})();
