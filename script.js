/* ==========================================================================
   DESTAC PISOS — DESIGN MODERNO
   Script Global, Calculadora Interativa & Conversão Respondi App
   Pixel Studio
   ========================================================================== */

/* ── CONFIGURAÇÃO CENTRAL DE CONVERSÃO RESPONDI APP ──────────────────────── */
// CONFIGURE AQUI O LINK OFICIAL DO FORMULÁRIO RESPONDI APP QUANDO GERADO:
const FORMS = {
  default:   "https://form.respondi.app/destac",       // Formulário Geral / Cotação
  belka:     "https://form.respondi.app/destac-belka", // Oferta Belka
  arquitech: "https://form.respondi.app/destac-arq",   // Oferta Arquitech
  revenda:   "https://form.respondi.app/destac-cnpj"   // Revenda / Construtoras
};

document.addEventListener('DOMContentLoaded', () => {
  applyCTA();
  initHeader();
  initMobileDrawer();
  initCalculator();
  initGallery();
  initFAQ();
  initScrollAnimations();
});

/* ── 1. ATRIBUIÇÃO CENTRAL DE CONVERSÃO RESPONDI APP ─────────────────────── */
function applyCTA() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmString = window.location.search; // Mantém UTMs da campanha

  document.querySelectorAll("[data-cta='form'], .float-cta, .mobile-sticky-bar a").forEach(el => {
    const specificProd = el.getAttribute('data-product');
    let targetForm = FORMS.default;

    if (specificProd && FORMS[specificProd]) {
      targetForm = FORMS[specificProd];
    }

    // Anexa parâmetros UTM se existirem
    const finalUrl = utmString ? `${targetForm}${targetForm.includes('?') ? '&' : '?'}${urlParams.toString()}` : targetForm;
    
    el.href = finalUrl;
    el.target = "_blank";
    el.rel = "noopener noreferrer";
  });
}

/* ── 2. HEADER & STICKY BEHAVIOR ─────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── 3. MENU MOBILE DRAWER ───────────────────────────────────────────────── */
function initMobileDrawer() {
  const toggleBtn = document.getElementById('menu-toggle');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!drawer) return;

  const openDrawer = () => {
    drawer.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    drawer.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (toggleBtn) toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  links.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ── 4. CALCULADORA INTERATIVA DE m² ─────────────────────────────────────── */
let currentProduct = {
  name: 'Vinílico Belka',
  price: 48.99
};

function selectProductInCalc(type) {
  const pills = document.querySelectorAll('.calc-pill');
  pills.forEach(p => {
    const prod = p.getAttribute('data-product');
    if (type === 'vinilico' && (prod === 'belka' || prod === 'arquitech')) {
      p.click();
    } else if (type === 'laminado' && prod === 'laminado') {
      p.click();
    }
  });
}

function initCalculator() {
  const slider = document.getElementById('metragem-slider');
  const display = document.getElementById('metragem-display');
  const pills = document.querySelectorAll('.calc-pill');
  const radioInputs = document.querySelectorAll('input[name="customer-type"]');
  const totalDisplay = document.getElementById('calc-total-display');
  const centsDisplay = document.getElementById('calc-cents-display');
  const btnCalc = document.getElementById('btn-calc-action');

  if (!slider || !totalDisplay) return;

  function updateCalculation() {
    const sqm = parseFloat(slider.value) || 35;
    if (display) display.textContent = sqm;

    const total = sqm * currentProduct.price;
    const parts = total.toFixed(2).split('.');
    const integerFormatted = Number(parts[0]).toLocaleString('pt-BR');
    
    totalDisplay.textContent = integerFormatted;
    if (centsDisplay) centsDisplay.textContent = ',' + parts[1];

    if (btnCalc) {
      btnCalc.href = FORMS.default;
      btnCalc.target = "_blank";
      btnCalc.rel = "noopener noreferrer";
    }
  }

  // Eventos de pills de produto
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const nameSpan = pill.querySelector('span');
      currentProduct.name = nameSpan ? nameSpan.textContent : 'Piso Selecionado';
      currentProduct.price = parseFloat(pill.getAttribute('data-price')) || 48.99;

      updateCalculation();
    });
  });

  slider.addEventListener('input', updateCalculation);

  radioInputs.forEach(radio => {
    radio.addEventListener('change', updateCalculation);
  });

  updateCalculation();
}

/* ── 5. GALERIA & LIGHTBOX ───────────────────────────────────────────────── */
const galleryData = [
  { src: 'images/ambiente-living.jpg', title: 'Living Integrado', sub: 'Piso Vinílico Amadeirado Acetinado' },
  { src: 'images/ambiente-sala.jpg', title: 'Sala Contemporânea', sub: 'Acabamento sem emendas aparentes' },
  { src: 'images/ambiente-quarto.jpg', title: 'Dormitório Master', sub: 'Conforto térmico e suavidade' },
  { src: 'images/ambiente-suite.jpg', title: 'Suíte de Alto Padrão', sub: 'Textura e sofisticação visual' },
  { src: 'images/ambiente-comercial.jpg', title: 'Espaço Corporativo & Comercial', sub: 'Alta resistência a tráfego intenso' },
  { src: 'images/ambiente-decor.jpg', title: 'Ambiente Decorado', sub: 'Harmonização perfeita com móveis' }
];

let currentLightboxIndex = 0;

function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Teclado para fechar/navegar no lightbox
  document.addEventListener('keydown', (e) => {
    const modal = document.getElementById('lightbox-modal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightboxImage(-1);
    if (e.key === 'ArrowRight') changeLightboxImage(1);
  });
}

function openLightbox(index) {
  currentLightboxIndex = index;
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');

  if (!modal || !img) return;

  const data = galleryData[index];
  img.src = data.src;
  img.alt = data.title;
  if (caption) caption.textContent = `${data.title} — ${data.sub}`;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function changeLightboxImage(direction) {
  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = galleryData.length - 1;
  if (currentLightboxIndex >= galleryData.length) currentLightboxIndex = 0;

  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  const data = galleryData[currentLightboxIndex];

  if (img) {
    img.src = data.src;
    img.alt = data.title;
  }
  if (caption) {
    caption.textContent = `${data.title} — ${data.sub}`;
  }
}

/* ── 6. FAQ ACCORDION ────────────────────────────────────────────────────── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      faqItems.forEach(i => {
        i.classList.remove('active');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ── 7. ANIMAÇÕES NO SCROLL (IntersectionObserver) ───────────────────────── */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-fade');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
