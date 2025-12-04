// js/contato.js
(() => {
    // helpers
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // elements
    const body = document.documentElement;
    const darkBtn = $('#darkModeToggle');
    const flagToggle = $('#flagToggle');
    const flagMenu = $('#flagMenu');
    const flagOptions = $$('.flag-option');
    const searchToggle = $('#searchToggle');

    // ---------- Dark mode (persistente) ----------
    const DM_KEY = 'site:darkMode';
    function applyDarkMode(isDark) {
        if (isDark) {
            body.classList.add('dark');
            darkBtn.setAttribute('aria-pressed', 'true');
            const icon = darkBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-sun';
            }
        } else {
            body.classList.remove('dark');
            darkBtn.setAttribute('aria-pressed', 'false');
            const icon = darkBtn.querySelector('i');
            if (icon) {
                icon.className = 'fa-solid fa-moon';
            }
        }
    }

    // inicializa com preferencia: localStorage > prefers-color-scheme
    try {
        const stored = localStorage.getItem(DM_KEY);
        if (stored !== null) {
            applyDarkMode(stored === '1');
        } else {
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyDarkMode(prefersDark);
        }
    } catch (e) {
        // silent
    }

    if (darkBtn) {
        darkBtn.addEventListener('click', () => {
            const isDark = !body.classList.contains('dark');
            applyDarkMode(isDark);
            try { localStorage.setItem(DM_KEY, isDark ? '1' : '0'); } catch (e) { }
        });
    }

    // ---------- Flags / idioma ----------
    // utilities for toggling class 'hidden' used in markup
    function isHidden(el) {
        return el.classList.contains('hidden');
    }
    function show(el) {
        el.classList.remove('hidden');
        el.setAttribute('aria-hidden', 'false');
    }
    function hide(el) {
        el.classList.add('hidden');
        el.setAttribute('aria-hidden', 'true');
    }

    if (flagToggle && flagMenu) {
        flagToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const open = isHidden(flagMenu) === false;
            if (open) {
                hide(flagMenu);
                flagToggle.setAttribute('aria-expanded', 'false');
            } else {
                show(flagMenu);
                flagToggle.setAttribute('aria-expanded', 'true');
                // focus first option for keyboard users
                const first = flagMenu.querySelector('.flag-option');
                if (first) first.focus();
            }
        });

        // close on outside click
        document.addEventListener('click', (ev) => {
            if (!flagMenu.contains(ev.target) && ev.target !== flagToggle) {
                hide(flagMenu);
                flagToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // keyboard: ESC closes
        document.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') {
                hide(flagMenu);
                flagToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // clicking an option sets the flag icon and saves preference
        const LANG_KEY = 'site:lang';
        flagOptions.forEach(opt => {
            opt.addEventListener('click', (e) => {
                const lang = opt.getAttribute('data-lang');
                // update visible flag in toggle
                const flagClass = {
                    pt: 'flag-icon-br',
                    en: 'flag-icon-us',
                    es: 'flag-icon-es'
                }[lang] || 'flag-icon-br';

                // update DOM inside flagToggle (keep chevron icon)
                flagToggle.querySelectorAll('.flag-icon').forEach(el => el.remove());
                const span = document.createElement('span');
                span.className = `flag-icon ${flagClass}`;
                span.setAttribute('aria-hidden', 'true');
                flagToggle.insertBefore(span, flagToggle.firstChild);

                try { localStorage.setItem(LANG_KEY, lang); } catch (e) { }
                hide(flagMenu);
                flagToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // apply saved lang on load
        try {
            const saved = localStorage.getItem(LANG_KEY);
            if (saved) {
                const map = { pt: 'flag-icon-br', en: 'flag-icon-us', es: 'flag-icon-es' };
                const cls = map[saved] || 'flag-icon-br';
                flagToggle.querySelectorAll('.flag-icon').forEach(el => el.remove());
                const span = document.createElement('span');
                span.className = `flag-icon ${cls}`;
                span.setAttribute('aria-hidden', 'true');
                flagToggle.insertBefore(span, flagToggle.firstChild);
            }
        } catch (e) { }
    }

    // ---------- Search toggle (basic behavior) ----------
    // If you have a search overlay in index.js, adapt this. This implementation toggles a simple input.
    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            // try to find existing overlay
            let overlay = $('#site-search-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'site-search-overlay';
                overlay.style.cssText = 'position:fixed;inset:0;display:flex;align-items:flex-start;justify-content:center;padding:80px 20px;background:rgba(13,30,64,0.35);z-index:10000;';
                overlay.innerHTML = `
          <div style="width:100%;max-width:760px;background:#fff;padding:18px;border-radius:12px;box-shadow:0 12px 40px rgba(2,6,23,0.6);">
            <label for="siteSearch" style="display:block;margin-bottom:8px;color:#6b7380;font-weight:600">Pesquisar produtos</label>
            <div style="display:flex;gap:8px;">
              <input id="siteSearch" type="search" placeholder="Digite e pressione Enter..." style="flex:1;padding:10px 12px;border-radius:8px;border:1px solid #e6e9ef;font-size:15px;">
              <button id="closeSearch" style="padding:10px 12px;border-radius:8px;background:#0d6efd;color:white;border:0;font-weight:700">Fechar</button>
            </div>
          </div>
        `;
                document.body.appendChild(overlay);

                // focus input
                setTimeout(() => {
                    const inp = $('#siteSearch', overlay);
                    if (inp) inp.focus();
                }, 30);

                // close handlers
                $('#closeSearch', overlay).addEventListener('click', () => overlay.remove());
                overlay.addEventListener('click', (ev) => {
                    if (ev.target === overlay) overlay.remove();
                });
                document.addEventListener('keydown', function onEsc(ev) {
                    if (ev.key === 'Escape') {
                        overlay.remove();
                        document.removeEventListener('keydown', onEsc);
                    }
                });
            } else {
                overlay.remove();
            }
        });
    }

    // ---------- small form helpers ----------
    const form = $('#contactForm');
    const mensagem = $('#mensagem');
    const charCount = $('#charCount');
    if (mensagem && charCount) {
        mensagem.addEventListener('input', () => {
            charCount.textContent = `${mensagem.value.length} / ${mensagem.getAttribute('maxlength') || 3000}`;
        });
    }

    // basic submit simulation (keeps the same UX as previous)
    const submitBtn = $('#submitBtn');
    const sending = $('#sending');
    const alertEl = $('#formAlert');
    const errorEl = $('#formError');

    if (form) {
        form.addEventListener('submit', (ev) => {
            ev.preventDefault();
            if (form.querySelector('[name="website"]').value) return; // honeypot

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (sending) sending.style.display = 'block';
            if (alertEl) alertEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'none';

            setTimeout(() => {
                if (submitBtn) submitBtn.disabled = false;
                if (sending) sending.style.display = 'none';
                form.reset();
                if (charCount) charCount.textContent = `0 / ${mensagem.getAttribute('maxlength') || 3000}`;
                if (alertEl) { alertEl.textContent = 'Mensagem enviada com sucesso. Obrigado pelo contato.'; alertEl.style.display = 'block'; }
            }, 900);
        });
    }

})();
