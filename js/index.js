// script.js
// Roteamento por hash + slider com transição igual à referência.
// Coloque imagens em /assets/produto1.jpg ... produto5.jpg

const ANIM_MS = 550;
const SLIDES = [
    {
        id: 0, name: "Model S", img: "../assets/ANEL_ORING.png", title: "Model S — Velocidade Urbana", desc: "Motor elétrico de última geração, autonomia de 480 km e design eficiente.", color: "#0ea5a4"
    },
    { id: 1, name: "Model X", img: "../assets/D229.png", title: "Model X — Espaço Premium", desc: "Capacidade família + tecnologia embarcada.", color: "#ef4444" },
    { id: 2, name: "Model 3", img: "../assets/VEDADOR_X12.png", title: "Model 3 — Compacto Eficiente", desc: "Desempenho sólido em um corpo compacto.", color: "#3b82f6" },
    { id: 3, name: "Roadster", img: "../assets/x10.png", title: "Roadster — Esportivo", desc: "Aceleração instantânea para quem busca adrenalina.", color: "#f59e0b" },
];

// templates: cada página é um fragmento HTML injetado no #app
const TEMPLATES = {
    '/sobre': `
    <section class="page page--sobre" aria-labelledby="sobre-title">
      <div class="hero">
        <div>
          <p class="eyebrow">Institucional</p>
          <h1 id="sobre-title">Quem somos — Empresa Exemplo</h1>
          <p class="lead">Fundada em 2018, Empresa Exemplo combina design enxuto, engenharia eficiente e foco em resultados. Nossa cultura prioriza autonomia, responsabilidade e aprendizado contínuo.</p>
          <div class="cta-row">
            <a class="btn primary" href="#/produtos" data-route>Ver produtos</a>
            <a class="btn ghost" href="#/contato" data-route>Fale conosco</a>
          </div>

          <h3 style="margin-top:1.25rem">Missão</h3>
          <p style="color:var(--muted)">Entregar soluções digitais de alto desempenho que consumam menos recursos e gerem impacto mensurável para clientes de todos os portes.</p>

          <h3 style="margin-top:1rem">Cultura</h3>
          <ul style="color:var(--muted)">
            <li>Autonomia responsável</li>
            <li>Foco em resultados</li>
            <li>Feedback contínuo</li>
            <li>Inclusão e respeito</li>
          </ul>
        </div>

        <aside class="hero-right" aria-label="Demonstração de produto">
          <nav class="product-nav" aria-label="Modelos disponíveis">
            <ul id="productList">
              ${SLIDES.map((s, i) => `<li><button data-index="${i}" class="product-link ${i === 0 ? 'active' : ''}">${s.name}</button></li>`).join('')}
            </ul>
          </nav>

          <div class="slider" id="slider" aria-live="polite">
            ${SLIDES.map((s, i) => `
              <div class="slide ${i === 0 ? 'current' : ''}" data-index="${i}">
                <picture>
                  <source media="(max-width:599px)" srcset="${s.img}">
                  <img src="${s.img}" alt="${s.title}" loading="lazy" width="1200" height="675">
                </picture>
                <div class="slide-info">
                  <h3 class="slide-title">${s.title}</h3>
                  <p class="slide-desc">${s.desc}</p>
                </div>
              </div>
            `).join('')}
          </div>
        </aside>
      </div>

      <section style="margin-top:2rem">
        <h2>Equipe e Liderança</h2>
        <p style="color:var(--muted)">Direção: Adriana Silva (CEO) — CTO: Rafael Costa — COO: Marina Lopes.</p>
      </section>

      <section style="margin-top:1rem">
        <h2>Carreiras</h2>
        <p style="color:var(--muted)">Vagas fictícias: Engenheiro Frontend, Engenheiro Backend, Product Designer. Envie CV para <strong>carreiras@exemplo.com</strong> (fictício).</p>
      </section>
    </section>
  `,
    '/produtos': `
    <section class="page page--produtos" aria-labelledby="produtos-title">
      <h1 id="produtos-title">Produtos — Visão geral</h1>
      <p style="color:var(--muted)">Catálogo de produtos fictícios, cada item tem imagem em assets/ e descrição curta.</p>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem;margin-top:1rem">
        ${SLIDES.map(s => `
          <article style="padding:1rem;border-radius:10px;border:1px solid rgba(255,255,255,0.04)">
            <img src="${s.img}" alt="${s.name}" loading="lazy" style="width:100%;height:140px;object-fit:cover;border-radius:6px">
            <h3 style="margin:.5rem 0">${s.name}</h3>
            <p style="color:var(--muted)">${s.desc}</p>
            <div style="margin-top:.5rem"><a class="btn ghost" href="#/catalogo" data-route>Ver catálogo</a></div>
          </article>
        `).join('')}
      </div>
    </section>
  `,
    '/catalogo': `
    <section class="page page--catalogo" aria-labelledby="catalogo-title">
      <h1 id="catalogo-title">Catálogo</h1>
      <p style="color:var(--muted)">PDFs e fichas técnicas otimizadas (fictícias). Exemplo de item:</p>
      <ul style="color:var(--muted)">
        <li>Ficha técnica — Model S (PDF fictício)</li>
        <li>Ficha técnica — Model X (PDF fictício)</li>
      </ul>
    </section>
  `,
    '/imprensa': `
    <section class="page page--imprensa" aria-labelledby="imprensa-title">
      <h1 id="imprensa-title">Imprensa</h1>
      <p style="color:var(--muted)">Sala de imprensa — notas, releases e recursos de mídia (exemplo fictício).</p>
      <p style="color:var(--muted)">Contato de imprensa: imprensa@exemplo.com (fictício)</p>
    </section>
  `,
    '/contato': `
    <section class="page page--contato" aria-labelledby="contato-title">
      <h1 id="contato-title">Contato</h1>
      <p style="color:var(--muted)">Envie sua mensagem para: contato@exemplo.com — Telefone (11) 4000-0000 (fictício).</p>
      <form style="margin-top:1rem;display:grid;gap:.6rem;max-width:520px">
        <input name="nome" placeholder="Nome" required style="padding:.6rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--fg)">
        <input type="email" name="email" placeholder="E-mail" required style="padding:.6rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--fg)">
        <textarea name="mensagem" rows="4" placeholder="Mensagem" style="padding:.6rem;border-radius:8px;border:1px solid rgba(255,255,255,0.06);background:transparent;color:var(--fg)"></textarea>
        <button class="btn primary" type="submit">Enviar (fictício)</button>
      </form>
    </section>
  `
};

// Router & page transitions
const app = document.getElementById('app');
const links = document.querySelectorAll('a[data-route]');
const menuToggleBtn = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const themeToggleBtn = document.getElementById('themeToggle');

function renderRoute(path, options = {}) {
    const newHtml = TEMPLATES[path] || TEMPLATES['/sobre'];
    const outgoing = app.firstElementChild;
    // create incoming node
    const incoming = document.createElement('div');
    incoming.innerHTML = newHtml;
    const page = incoming.firstElementChild;
    page.classList.add('page-enter');
    // insert before removing outgoing to animate
    app.appendChild(page);
    // allow screen readers to jump to main content
    page.setAttribute('tabindex', '-1');

    // trigger reflow then start enter animation
    // remove outgoing with exit animation if exists
    requestAnimationFrame(() => {
        page.classList.add('page-enter-active');
        page.classList.remove('page-enter');
    });

    if (outgoing) {
        outgoing.classList.add('page-exit');
        // start exit active
        requestAnimationFrame(() => {
            outgoing.classList.add('page-exit-active');
        });
        setTimeout(() => {
            if (outgoing && outgoing.parentNode) outgoing.parentNode.removeChild(outgoing);
            // after route changed, focus on content for accessibility
            page.focus();
            // if route is sobre, initialize slider
            if (path === '/sobre') initSlider(); // safe to call multiple times
        }, ANIM_MS + 30);
    } else {
        // no outgoing (first load)
        setTimeout(() => {
            page.focus();
            if (path === '/sobre') initSlider();
        }, 60);
    }

    // update active nav highlighting
    document.querySelectorAll('.nav-list a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + path));
    // close mobile menu if open
    closeMobileMenu();
    // update hash (this keeps behavior consistent)
    if (location.hash !== '#' + path) location.hash = path;
}

// Link click handler
links.forEach(a => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href');
        const path = href.replace('#', '') || '/sobre';
        navigateTo(path);
    });
});

// navigation helper
function navigateTo(path) {
    renderRoute(path);
}

// hashchange (back/forward)
window.addEventListener('hashchange', () => {
    const path = location.hash.replace('#', '') || '/sobre';
    renderRoute(path);
});

// Mobile menu toggle
menuToggleBtn.addEventListener('click', () => {
    const expanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
    menuToggleBtn.setAttribute('aria-expanded', String(!expanded));
    const hidden = mobileMenu.getAttribute('aria-hidden') === 'true';
    mobileMenu.setAttribute('aria-hidden', String(!hidden));
    mobileMenu.style.display = hidden ? 'block' : 'none';
});

// close mobile menu
function closeMobileMenu() {
    menuToggleBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    mobileMenu.style.display = 'none';
}

// theme toggle (persist)
(function () {
    const lightClass = 'theme-light';
    const saved = localStorage.getItem('site-theme');
    if (saved === 'light') document.documentElement.classList.add(lightClass);
    themeToggleBtn.addEventListener('click', () => {
        const active = document.documentElement.classList.toggle(lightClass);
        themeToggleBtn.setAttribute('aria-pressed', String(active));
        localStorage.setItem('site-theme', active ? 'light' : 'dark');
    });
})();

/* -------------------------
   Slider (used in /sobre)
   Transition logic matches the original reference:
   - clicking product buttons triggers enter/exit classes
------------------------- */
let activeIndex = 0;
let isAnimating = false;

function initSlider() {
    const sliderEl = document.getElementById('slider');
    if (!sliderEl) return;
    const productButtons = Array.from(document.querySelectorAll('.product-link'));
    // attach listeners once
    productButtons.forEach(btn => {
        btn.removeEventListener('click', onProductClick);
        btn.addEventListener('click', onProductClick);
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
        });
    });
}

function onProductClick(e) {
    const idx = Number(e.currentTarget.dataset.index);
    transitionTo(idx);
}

function transitionTo(newIndex) {
    if (isAnimating || newIndex === activeIndex) return;
    isAnimating = true;

    const sliderEl = document.getElementById('slider');
    if (!sliderEl) { isAnimating = false; return; }

    const outgoing = sliderEl.querySelector(`.slide[data-index="${activeIndex}"]`);
    const incoming = sliderEl.querySelector(`.slide[data-index="${newIndex}"]`);
    if (!incoming || !outgoing) { isAnimating = false; return; }

    // update product button active state
    document.querySelectorAll('.product-link').forEach(b => b.classList.toggle('active', Number(b.dataset.index) === newIndex));

    // add classes for exit/enter (match reference)
    outgoing.classList.add('slide-exit');
    incoming.classList.add('slide-enter');

    // force reflow
    // eslint-disable-next-line no-unused-expressions
    incoming.offsetHeight;

    // start active transitions
    outgoing.classList.add('slide-exit-active');
    incoming.classList.add('slide-enter-active');

    // after animation, clean up
    setTimeout(() => {
        outgoing.classList.remove('current', 'slide-exit', 'slide-exit-active');
        incoming.classList.remove('slide-enter', 'slide-enter-active');
        incoming.classList.add('current');
        document.documentElement.style.setProperty('--accent', SLIDES[newIndex].color);
        activeIndex = newIndex;
        isAnimating = false;
    }, ANIM_MS + 20);
}

/* keyboard navigation for slider (left/right) */
document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    // only operate when /sobre is active
    const activePath = (location.hash.replace('#', '') || '/sobre');
    if (activePath !== '/sobre') return;
    const next = e.key === 'ArrowRight' ? Math.min(activeIndex + 1, SLIDES.length - 1) : Math.max(activeIndex - 1, 0);
    if (next !== activeIndex) transitionTo(next);
});

// initial load: route from hash (default /sobre)
document.addEventListener('DOMContentLoaded', () => {
    const initial = location.hash.replace('#', '') || '/sobre';
    // render immediately without double animation on first load
    app.innerHTML = TEMPLATES[initial] || TEMPLATES['/sobre'];
    // focus for accessibility
    const page = app.querySelector('.page');
    if (page) page.setAttribute('tabindex', '-1');
    if (initial === '/sobre') {
        // slider already injected -> ensure event listeners attached
        initSlider();
    }
    // set nav active
    document.querySelectorAll('.nav-list a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + initial));
    // make sure hash is set
    if (!location.hash) location.hash = initial;
});
