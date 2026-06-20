/* ============================================================
   RESTAURANTE – Carrito de Compras con Integración WhatsApp
   ============================================================ */

(function () {
    'use strict';

    // ── Número de WhatsApp del negocio (formato internacional sin + ni espacios) ──
    const WHATSAPP_NUMBER = '573045274626';

    // ── Estado del carrito ──
    let cart = [];

    // ── Productos: mapeo nombre → imagen (para mostrar en el carrito) ──
    function getProductData(card) {
        const img    = card.querySelector('.producto-img');
        const name   = card.querySelector('h3')?.textContent.trim()    || 'Producto';
        const priceEl = card.querySelector('.precio');
        const priceStr = priceEl?.textContent.replace(/[^0-9.]/g, '') || '0';
        const price  = parseFloat(priceStr);
        const imgSrc = img?.src || '';

        return { name, price, imgSrc };
    }

    // ── Agregar al carrito ──
    function addToCart(productData) {
        const existing = cart.find(i => i.name === productData.name);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...productData, qty: 1, id: Date.now() + Math.random() });
        }
        saveCart();
        renderCart();
        updateBadge();
        bounceCartBtn();
        showToast(`"${productData.name}" añadido al carrito 🍔`);
    }

    // ── Cambiar cantidad ──
    function changeQty(id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart();
        renderCart();
        updateBadge();
    }

    // ── Eliminar item ──
    function removeItem(id) {
        cart = cart.filter(i => i.id !== id);
        saveCart();
        renderCart();
        updateBadge();
    }

    // ── Vaciar carrito ──
    function clearCart() {
        cart = [];
        saveCart();
        renderCart();
        updateBadge();
    }

    // ── Persistencia (sessionStorage) ──
    function saveCart() {
        try { sessionStorage.setItem('restauranteCart', JSON.stringify(cart)); } catch (e) {}
    }

    function loadCart() {
        try {
            const data = sessionStorage.getItem('restauranteCart');
            if (data) cart = JSON.parse(data);
        } catch (e) { cart = []; }
    }

    // ── Total ──
    function getTotal() {
        return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    }

    function getTotalItems() {
        return cart.reduce((sum, i) => sum + i.qty, 0);
    }

    // ── Render del carrito ──
    function renderCart() {
        const itemsContainer = document.getElementById('cartItems');
        const footer         = document.getElementById('cartFooter');
        if (!itemsContainer) return;

        if (cart.length === 0) {
            itemsContainer.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-basket"></i>
                    <p>Tu carrito está vacío</p>
                    <small>Agrega tus hamburguesas favoritas 🍔</small>
                </div>`;
            if (footer) footer.style.display = 'none';
            return;
        }

        if (footer) footer.style.display = 'flex';

        // Items
        itemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                    <img class="cart-item-img"
                     src="${item.imgSrc}"
                     alt="${item.name}"
                     onerror="this.src='assets/images/logo1.png'">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</p>
                    <div class="cart-item-controls">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                        <span class="qty-num">${item.qty}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" data-remove="${item.id}" title="Eliminar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Totals
        const total    = getTotal();
        const totalEl  = document.getElementById('cartTotal');
        const countEl  = document.getElementById('cartItemCount');
        if (totalEl)  totalEl.textContent  = `$${total.toFixed(2)}`;
        if (countEl)  countEl.textContent  = `${getTotalItems()} producto${getTotalItems() !== 1 ? 's' : ''}`;

        // Event listeners sobre los items renderizados
        itemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id     = parseFloat(btn.dataset.id);
                const delta  = btn.dataset.action === 'increase' ? 1 : -1;
                changeQty(id, delta);
            });
        });

        itemsContainer.querySelectorAll('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => {
                removeItem(parseFloat(btn.dataset.remove));
            });
        });
    }

    // ── Badge del botón flotante ──
    function updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (!badge) return;
        const count = getTotalItems();
        badge.textContent = count;
        if (count > 0) {
            badge.classList.add('visible');
        } else {
            badge.classList.remove('visible');
        }
    }

    // ── Animación del botón ──
    function bounceCartBtn() {
        const btn = document.getElementById('cartFloatBtn');
        if (!btn) return;
        btn.classList.remove('bounce');
        void btn.offsetWidth; // reflow
        btn.classList.add('bounce');
        btn.addEventListener('animationend', () => btn.classList.remove('bounce'), { once: true });
    }

    // ── Toast ──
    function showToast(msg) {
        let toast = document.getElementById('cartToast');
        if (!toast) return;
        toast.querySelector('span').textContent = msg;
        toast.classList.add('show');
        clearTimeout(toast._timer);
        toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
    }

    // ── Abrir / Cerrar drawer ──
    function openCart() {
        document.getElementById('cartDrawer')?.classList.add('open');
        document.getElementById('cartOverlay')?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        document.getElementById('cartDrawer')?.classList.remove('open');
        document.getElementById('cartOverlay')?.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ── Generar mensaje para WhatsApp ──
    function buildWhatsAppMessage() {
        if (cart.length === 0) return '';

        let msg = '🍔 *PEDIDO - RESTAURANTE*\n';
        msg += '━━━━━━━━━━━━━━━━━━━\n\n';

        cart.forEach((item, idx) => {
            msg += `${idx + 1}. *${item.name}*\n`;
            msg += `   Cantidad: ${item.qty}\n`;
            msg += `   Precio unitario: $${item.price.toFixed(2)}\n`;
            msg += `   Subtotal: $${(item.price * item.qty).toFixed(2)}\n\n`;
        });

        msg += '━━━━━━━━━━━━━━━━━━━\n';
        msg += `💰 *TOTAL: $${getTotal().toFixed(2)}*\n\n`;
        msg += '📍 Por favor indícame:\n';
        msg += '• Tu nombre\n';
        msg += '• ¿Mesa, para llevar o delivery?\n';
        msg += '• Dirección (si es delivery)\n\n';
        msg += '¡Gracias por elegir RESTAURANTE! 🙌';

        return encodeURIComponent(msg);
    }

    // ── Crear el HTML del carrito y botón flotante ──
    function injectCartUI() {
        // CSS link: cargar relativo al archivo JS o al documento si no está disponible
        if (!document.querySelector('link[href*="cart.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            // Determinar base del script (carpeta donde está cart.js)
            const scriptSrc = (document.currentScript && document.currentScript.src) ? document.currentScript.src : null;
            let base = '';
            try {
                if (scriptSrc) {
                    base = new URL('.', scriptSrc).href;
                } else {
                    base = new URL('.', location.href).href;
                }
            } catch (e) { base = '' }
            link.href = base + 'cart.css';
            document.head.appendChild(link);
        }

        // HTML del carrito
        const html = `
        <!-- Botón flotante del carrito -->
        <div class="cart-float">
            <button class="cart-btn" id="cartFloatBtn" title="Ver carrito">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge" id="cartBadge">0</span>
            </button>
        </div>

        <!-- Overlay -->
        <div class="cart-overlay" id="cartOverlay"></div>

        <!-- Drawer -->
        <aside class="cart-drawer" id="cartDrawer" aria-label="Carrito de compras">
            <div class="cart-header">
                <h2><i class="fas fa-shopping-cart"></i> Mi Pedido</h2>
                <button class="cart-close" id="cartClose" aria-label="Cerrar carrito">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="cart-items" id="cartItems">
                <!-- Items se renderizan aquí -->
            </div>

            <div class="cart-footer" id="cartFooter" style="display:none;">
                <div class="cart-summary">
                    <div class="cart-summary-row">
                        <span id="cartItemCount">0 productos</span>
                    </div>
                    <div class="cart-total-row">
                        <span class="cart-total-label">Total</span>
                        <span class="cart-total-price" id="cartTotal">$0.00</span>
                    </div>
                </div>

                <a class="btn-whatsapp" id="btnWhatsApp"
                   href="#" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    Enviar pedido por WhatsApp
                </a>

                <button class="btn-clear-cart" id="btnClearCart">
                    <i class="fas fa-trash-alt"></i> Vaciar carrito
                </button>
            </div>
        </aside>

        <!-- Toast -->
        <div class="cart-toast" id="cartToast">
            <i class="fas fa-check-circle"></i>
            <span></span>
        </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    }

    // ── Vincular botones "Pedir" de los productos ──
    function bindProductButtons() {
        document.querySelectorAll('.btn-pedir').forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const card = btn.closest('.producto-card');
                if (!card) return;
                const data = getProductData(card);
                if (!data.name || isNaN(data.price)) return;
                addToCart(data);
            });
        });
    }

    // ── Vincular controles del drawer ──
    function bindCartControls() {
        document.getElementById('cartFloatBtn')?.addEventListener('click', openCart);
        document.getElementById('cartClose')?.addEventListener('click', closeCart);
        document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

        document.getElementById('btnClearCart')?.addEventListener('click', () => {
            if (confirm('¿Deseas vaciar el carrito?')) clearCart();
        });

        document.getElementById('btnWhatsApp')?.addEventListener('click', function (e) {
            if (cart.length === 0) {
                e.preventDefault();
                showToast('Añade productos antes de ordenar 🛒');
                return;
            }
            const msg = buildWhatsAppMessage();
            this.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
        });

        // Cerrar con tecla Escape
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeCart();
        });
    }

    // ── Inicialización ──
    function init() {
        loadCart();
        injectCartUI();

        // Esperar a que el DOM esté completamente listo
        setTimeout(() => {
            bindProductButtons();
            bindCartControls();
            renderCart();
            updateBadge();
        }, 50);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
