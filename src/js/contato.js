// js/contato.js
(() => {
    // helpers
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

    // elements
    const body = document.documentElement;
    const darkBtn = $('#darkModeToggle');

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
