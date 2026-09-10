/* ==========================================================================
   DESTAC PISOS — DESIGN MODERNO
   Script Global, Calculadora Interativa & Conversão
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileDrawer();
  initCalculator();
  initGallery();
  initFAQ();
  initLeadForm();
  initScrollAnimations();
  initUTMTracking();
});

/* ── CONFIGURAÇÕES GERAIS ────────────────────────────────────────────────── */
const CONFIG = {
  whatsappNumber: '5511999999999', // Substituir pelo número comercial oficial
  defaultMessage: 'Olá! Gostaria de solicitar uma cotação de pisos na Destac Pisos.',
  obrigadoUrl: 'obrigado.html'
};

/* ── 1. HEADER & STICKY BEHAVIOR ─────────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  const stickyBar = document.getElementById('mobile-sticky-bar');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle('scrolled', scrollY > 40);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── 2. MENU MOBILE DRAWER ───────────────────────────────────────────────── */
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

/* ── 3. CALCULADORA INTERATIVA DE m² ─────────────────────────────────────── */
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
  const btnWhatsApp = document.getElementById('btn-calc-whatsapp');

  if (!slider || !totalDisplay) return;

  function updateCalculation() {
    const sqm = parseFloat(slider.value) || 35;
    if (display) display.textContent = sqm;

    const total = sqm * currentProduct.price;
    const parts = total.toFixed(2).split('.');
    const integerFormatted = Number(parts[0]).toLocaleString('pt-BR');
    
    totalDisplay.textContent = integerFormatted;
    if (centsDisplay) centsDisplay.textContent = ',' + parts[1];

    // Atualiza link do WhatsApp
    const selectedRadio = document.querySelector('input[name="customer-type"]:checked');
    const customerType = selectedRadio ? selectedRadio.value : 'Pessoa Física';

    const msg = `Olá! Fiz uma simulação no site da Destac Pisos:\n\n` +
      `📦 Produto: ${currentProduct.name} (R$ ${currentProduct.price.toFixed(2).replace('.', ',')}/m²)\n` +
      `📐 Metragem estimada: ${sqm} m²\n` +
      `💼 Perfil de compra: ${customerType}\n` +
      `💰 Valor estimado do material: R$ ${integerFormatted},${parts[1]}\n\n` +
      `Gostaria de receber a cotação oficial com cálculo de rodapés e frete!`;

    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    if (btnWhatsApp) {
      btnWhatsApp.href = url;
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

  // Slider de metragem
  slider.addEventListener('input', updateCalculation);

  // Radio button tipo de cliente
  radioInputs.forEach(radio => {
    radio.addEventListener('change', updateCalculation);
  });

  // Executa inicial
  updateCalculation();
}

/* ── 4. GALERIA & LIGHTBOX ───────────────────────────────────────────────── */
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

/* ── 5. FAQ ACCORDION ────────────────────────────────────────────────────── */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Fecha todos os outros
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

/* ── 6. LEAD FORM SUBMISSION ─────────────────────────────────────────────── */
function initLeadForm() {
  const form = document.getElementById('lead-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const product = document.getElementById('lead-product').value;
    const sqm = document.getElementById('lead-sqm').value.trim();

    const msg = `Olá Destac Pisos! Solicito cotação através do formulário do site:\n\n` +
      `👤 Nome: ${name}\n` +
      `📱 Telefone: ${phone}\n` +
      `📦 Interesse: ${product}\n` +
      (sqm ? `📐 Metragem aproximada: ${sqm} m²\n\n` : `\n`) +
      `Aguardo retorno com as condições comerciais!`;

    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`;

    // Armazena dados de sessão para a página de obrigado
    sessionStorage.setItem('destac_lead_name', name);
    sessionStorage.setItem('destac_lead_wa', whatsappUrl);

    // Abre o WhatsApp em nova aba e redireciona para obrigado.html
    window.open(whatsappUrl, '_blank');
    window.location.href = CONFIG.obrigadoUrl;
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

/* ── 8. CAPTURA DE PARÂMETROS UTM ────────────────────────────────────────── */
function initUTMTracking() {
  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const utmCampaign = urlParams.get('utm_campaign');

  if (utmSource || utmCampaign) {
    const utmSummary = ` [Origem: ${utmSource || ''} / Campanha: ${utmCampaign || ''}]`;
    document.querySelectorAll('[data-cta]').forEach(cta => {
      const currentHref = cta.getAttribute('href');
      if (currentHref && currentHref.includes('wa.me')) {
        cta.setAttribute('href', currentHref + encodeURIComponent(utmSummary));
      }
    });
  }
}
