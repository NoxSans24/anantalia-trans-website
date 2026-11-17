(() => {
  const officialWaBase = 'https://api.whatsapp.com/send/?phone=6281383333707';
  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach((link) => {
    const rawHref = link.getAttribute('href') || '';
    let textParam = '';
    try {
      const parsed = new URL(rawHref, window.location.origin);
      textParam = parsed.searchParams.get('text') || '';
    } catch {
      textParam = '';
    }
    const queryText = textParam ? `&text=${encodeURIComponent(textParam)}` : '&text';
    link.setAttribute('href', `${officialWaBase}${queryText}&type=phone_number&app_absent=0`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.hidden = false;
    link.removeAttribute('aria-disabled');
  });

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

  const initRevealAnimations = () => {
    const reveals = document.querySelectorAll('.reveal-on-scroll');
    if (!reveals.length) return;
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            currentObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
      reveals.forEach((element) => observer.observe(element));
    } else {
      reveals.forEach((element) => element.classList.add('is-visible'));
    }
  };
  initRevealAnimations();

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
    const isActive = sourceLink.getAttribute('aria-current') === 'page';
    link.className = isActive
      ? 'block rounded-lg px-space-md py-space-sm text-body-default bg-surface-mint text-primary font-body-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
      : 'block rounded-lg px-space-md py-space-sm text-body-default text-on-surface-variant hover:bg-surface-mint hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary';
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

  const hydratePublicCmsContent = async () => {
    if (!window.AnantaliaApi?.getPublicContent) return;
    try {
      const { items = [] } = await window.AnantaliaApi.getPublicContent({ limit: 50 });
      if (!Array.isArray(items) || !items.length) return;

      const pathSlug = window.location.pathname
        .split('/')
        .pop()
        .replace(/\.html$/i, '') || 'beranda';
      const pageMatch = items.find((i) => i.slug === pathSlug);
      if (pageMatch?.meta?.metaTitle) {
        document.title = pageMatch.meta.metaTitle;
      }
      if (pageMatch?.meta?.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.name = 'description';
          document.head.appendChild(metaDesc);
        }
        metaDesc.content = pageMatch.meta.metaDescription;
      }

      const promo = items.find((i) => i.section === 'promo');
      if (promo && !document.getElementById('cms-live-promo-bar')) {
        const bar = document.createElement('div');
        bar.id = 'cms-live-promo-bar';
        bar.className = 'bg-[#153B3A] text-white text-xs sm:text-sm py-2 px-4 flex flex-wrap items-center justify-center gap-3';
        const badge = document.createElement('span');
        badge.className = 'rounded-full bg-[#C4A46C] text-[#153B3A] font-bold px-2.5 py-0.5 text-[11px] uppercase';
        badge.textContent = promo.meta?.promoCode || 'Promo';
        const title = document.createElement('span');
        title.className = 'font-medium';
        title.textContent = promo.title;
        bar.append(badge, title);
        if (promo.meta?.ctaLabel && promo.meta?.ctaUrl) {
          const cta = document.createElement('a');
          cta.href = promo.meta.ctaUrl;
          cta.className = 'underline font-semibold text-[#E4EFEB] hover:text-white';
          cta.textContent = promo.meta.ctaLabel;
          bar.append(cta);
        }
        document.body.prepend(bar);
      }

      const faqItems = items.filter((i) => i.section === 'faq');
      const faqList = document.querySelector('.faq-list, [data-cms-faq]');
      if (faqItems.length && faqList) {
        faqItems.forEach((item) => {
          const card = document.createElement('div');
          card.className = 'faq-item rounded-xl border border-[#E4EFEB] bg-white p-4 mb-3 shadow-sm';
          const q = document.createElement('h3');
          q.className = 'text-sm font-bold text-[#153B3A] mb-1';
          q.textContent = item.title;
          const a = document.createElement('p');
          a.className = 'text-sm text-slate-600 leading-relaxed';
          a.textContent = String(item.body || '').replace(/<[^>]*>/g, '');
          card.append(q, a);
          faqList.append(card);
        });
      }
    } catch {
      // Graceful fallback to static HTML when API is unavailable
    }
  };

  const mountPublicContactForm = () => {
    if (!window.location.pathname.includes('pusat-bantuan')) return;
    if (document.getElementById('public-contact-form')) return;
    const host = document.querySelector('main');
    if (!host || !window.AnantaliaApi?.submitContactMessage) return;

    const section = document.createElement('section');
    section.style.cssText = 'max-width:760px;margin:2rem auto;padding:1.5rem;border:1px solid #d1d5db;border-radius:14px;background:#ffffff;';
    section.innerHTML = `
      <h2 style="margin:0 0 0.35rem;font-size:1.25rem;color:#202A2B;">Kirim Pesan ke Tim Anatalia Trans</h2>
      <p style="margin:0 0 1rem;font-size:0.92rem;color:#4b5563;">Ada pertanyaan armada, sewa, atau kerja sama? Pesan Anda langsung masuk ke Inbox Admin.</p>
      <form id="public-contact-form" style="display:grid;gap:0.75rem;">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;">
          <input name="senderName" type="text" required placeholder="Nama Lengkap *" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;" />
          <input name="senderEmail" type="email" required placeholder="Email *" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;" />
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;">
          <input name="phone" type="text" placeholder="Nomor WhatsApp / Telepon" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;" />
          <select name="category" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;background:#fff;">
            <option value="general">Pertanyaan Umum</option>
            <option value="booking">Pemesanan &amp; Armada</option>
            <option value="pricing">Penawaran Harga</option>
            <option value="complaint">Keluhan Layanan</option>
            <option value="partnership">Kerja Sama / Korporat</option>
          </select>
        </div>
        <input name="subject" type="text" required placeholder="Subjek Pesan *" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;" />
        <textarea name="content" rows="4" required minlength="10" placeholder="Tulis detail pesan Anda (minimal 10 karakter) *" style="padding:0.6rem 0.75rem;border:1px solid #d1d5db;border-radius:8px;"></textarea>
        <input name="website" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;opacity:0;" />
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <button type="submit" style="padding:0.65rem 1.25rem;border:none;border-radius:8px;background:#079E98;color:#fff;font-weight:600;cursor:pointer;">Kirim Pesan</button>
          <span id="public-contact-status" style="font-size:0.88rem;color:#374151;"></span>
        </div>
      </form>
    `;
    host.appendChild(section);

    const form = section.querySelector('#public-contact-form');
    const statusEl = section.querySelector('#public-contact-status');
    const submitBtn = section.querySelector('button[type="submit"]');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const payload = {
        senderName: String(fd.get('senderName') || '').trim(),
        senderEmail: String(fd.get('senderEmail') || '').trim(),
        phone: String(fd.get('phone') || '').trim(),
        category: String(fd.get('category') || 'general'),
        subject: String(fd.get('subject') || '').trim(),
        content: String(fd.get('content') || '').trim(),
        website: String(fd.get('website') || ''),
      };
      if (!payload.senderName || !payload.senderEmail || payload.content.length < 10) {
        statusEl.textContent = 'Lengkapi nama, email valid, dan pesan minimal 10 karakter.';
        statusEl.style.color = '#b91c1c';
        return;
      }
      submitBtn.disabled = true;
      submitBtn.textContent = 'Mengirim...';
      statusEl.textContent = '';
      try {
        await window.AnantaliaApi.submitContactMessage(payload);
        form.reset();
        statusEl.textContent = 'Pesan berhasil dikirim dan tercatat di sistem kami.';
        statusEl.style.color = '#065f46';
      } catch (err) {
        statusEl.textContent = err?.message || 'Gagal mengirim pesan. Silakan coba lagi.';
        statusEl.style.color = '#b91c1c';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Kirim Pesan';
      }
    });
  };
  const hydratePublicSiteConfig = async () => {
    if (!window.AnantaliaApi?.getPublicSiteConfig) return;
    try {
      const cfg = await window.AnantaliaApi.getPublicSiteConfig();
      if (!cfg || typeof cfg !== 'object') return;
      if (cfg.websiteTitle && document.title && !document.title.includes(cfg.companyName)) {
        document.title = cfg.websiteTitle;
      }
      if (cfg.whatsappNumber) {
        const waDigits = String(cfg.whatsappNumber).replace(/[^\d]/g, '');
        if (waDigits.length >= 8) {
          document.querySelectorAll('a[href*="wa.me/"]').forEach((link) => {
            link.href = link.href.replace(/https:\/\/wa\.me\/\d+/, `https://wa.me/${waDigits}`);
          });
        }
      }
      if (cfg.maintenanceMode === true && !document.getElementById('public-maintenance-banner')) {
        const banner = document.createElement('div');
        banner.id = 'public-maintenance-banner';
        banner.setAttribute('role', 'status');
        banner.style.cssText = 'background:#153B3A;color:#FFFFFF;padding:0.75rem 1rem;text-align:center;font-size:0.875rem;border-bottom:2px solid #C4A46C;';
        banner.textContent = cfg.maintenanceMessage || 'Website sedang dalam pemeliharaan terjadwal. Silakan hubungi WhatsApp resmi kami.';
        document.body.prepend(banner);
      }
    } catch {
      // Safe fallback to static site configuration when API is unavailable
    }
  };

  const runPublicIntegrations = () => {
    void hydratePublicSiteConfig();
    void hydratePublicCmsContent();
    mountPublicContactForm();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runPublicIntegrations, { once: true });
  } else {
    runPublicIntegrations();
  }
})();
