/**
 * CYBER RONIN TECH STORE - CORE INTERACTIVE ENGINE
 */
(function () {
  'use strict';

  /* ===== 1. BASE DE DATOS DEL CATÁLOGO DE PRODUCTOS ===== */
  var PRODUCTS = [
    {
      id: 'p1',
      name: 'RONIN-X // SHADOW FRAME',
      category: 'wearables',
      price: 499,
      oldPrice: 650,
      rating: 4.9,
      reviewsCount: 128,
      badge: 'MÁS VENDIDO',
      img: 'img/cyber_glasses.png',
      specs: [
        'Pantalla Dual 8K Pulse-OLED',
        'Motor Neuronal R1 Quantum',
        'Autonomía de 48 Horas',
        'Cuadro Ultraligero de Titanio'
      ],
      desc: 'Los visores neuronales más avanzados del mercado. Diseñados para profesionales de la visión sintética, entornos virtuales inmersivos y gaming de latencia cero.'
    },
    {
      id: 'p2',
      name: 'CYBERPHONE QUANTUM PRO',
      category: 'smartphones',
      price: 899,
      oldPrice: 1099,
      rating: 4.8,
      reviewsCount: 94,
      badge: 'NUEVO',
      img: 'img/cyber_phone.png',
      specs: [
        'Pantalla 6.8" AMOLED 165Hz',
        'Chipset CyberSOC 3.4GHz',
        'Batería 5,500mAh / 120W',
        'Triple Cámara Neón 200MP'
      ],
      desc: 'El smartphone gaming definitivo con refrigeración líquida interna, acabado de cristal de zafiro y procesador de red neural integrado.'
    },
    {
      id: 'p3',
      name: 'BLADE-17 QUANTUM LAPTOP',
      category: 'laptops',
      price: 1899,
      oldPrice: 2200,
      rating: 5.0,
      reviewsCount: 62,
      badge: 'OFERTA TOP',
      img: 'img/cyber_laptop.png',
      specs: [
        'Pantalla 17.3" QHD 240Hz Mini-LED',
        'Tensor Neural Core i9 16-Core',
        '64GB RAM DDR5 / 2TB NVMe',
        'Gráficos RTX Cyber Edition'
      ],
      desc: 'Potencia extrema en un chasis ultradelgado de magnesio anodizado. Diseñado para renderizado 3D masivo, desarrollo de IA y videojuegos de última generación.'
    },
    {
      id: 'p4',
      name: 'PULSE ANC WIRELESS HEADPHONES',
      category: 'audio',
      price: 279,
      oldPrice: 350,
      rating: 4.7,
      reviewsCount: 156,
      badge: 'POPULAR',
      img: 'img/cyber_headphones.png',
      specs: [
        'Aislamiento de Ruido Adaptativo ANC',
        'Conductores de Berilio 50mm',
        'Batería de 60 Horas',
        'Micrófonos con Filtro IA'
      ],
      desc: 'Auriculares de fidelidad audiófila con cancelación activa de ruido inteligente, audio espacial 3D y diseño cibernético ergonómico.'
    },
    {
      id: 'p5',
      name: 'NEURAL PULSE SMARTWATCH',
      category: 'wearables',
      price: 320,
      oldPrice: 399,
      rating: 4.6,
      reviewsCount: 81,
      badge: 'HOT',
      img: 'img/cyber_glasses.png',
      specs: [
        'Sensor Biométrico Holográfico',
        'Caja de Titanio Aeroespacial',
        'Resistente al Agua 100m',
        'Conexión Neural Inalámbrica'
      ],
      desc: 'Monitoreo de rendimiento corporal en tiempo real con interfaz holográfica táctil y asistente de inteligencia artificial personal.'
    },
    {
      id: 'p6',
      name: 'CYBER AUDIO PRO ANC EARBUDS',
      category: 'audio',
      price: 189,
      oldPrice: 240,
      rating: 4.8,
      reviewsCount: 210,
      badge: 'DESCUENTO',
      img: 'img/cyber_headphones.png',
      specs: [
        'Cancelación de Ruido -45dB',
        'Estuche de Carga Inalámbrica',
        'Latencia Ultra Baja 20ms',
        'Códec Hi-Res LDAC'
      ],
      desc: 'Sonido cristalino en un formato compacto intrauditivo con resistencia IPX8 y control por gestos táctiles avanzadas.'
    }
  ];

  /* ===== 2. ESTADO DEL CARRITO DE COMPRAS ===== */
  var cartState = JSON.parse(localStorage.getItem('cyber_cart') || '[]');
  var appliedDiscount = 0; // Porcentaje de descuento

  /* ===== 3. SPOTLIGHT REVEAL ENGINE ===== */
  var revealEl = document.getElementById('reveal-img');

  function getRadius() {
    var w = window.innerWidth;
    if (w < 480) return 120;
    if (w < 720) return 160;
    return 440;
  }

  function updateSpotlight(clientX, clientY) {
    if (!revealEl) return;
    var rect = revealEl.getBoundingClientRect();
    var x = clientX - rect.left;
    var y = clientY - rect.top;
    var r = getRadius();
    var mask = 'radial-gradient(circle ' + r + 'px at ' + x + 'px ' + y + 'px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)';
    revealEl.style.webkitMaskImage = mask;
    revealEl.style.maskImage = mask;
  }

  window.addEventListener('mousemove', function (e) {
    updateSpotlight(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* ===== 4. WORD SPLIT & ANIMACIONES SCROLL ===== */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = 'true';
    var wordIndex = 0;

    if (el.tagName === 'H1' && el.querySelector(':scope > span')) {
      var lines = Array.prototype.slice.call(el.children).filter(function (child) {
        return child.tagName === 'SPAN';
      });

      lines.forEach(function (line) {
        var text = line.textContent;
        var words = text.split(/\s+/).filter(Boolean);
        line.textContent = '';
        line.classList.add('pull-line');
        line.style.display = 'block';

        words.forEach(function (word) {
          var span = document.createElement('span');
          span.className = 'pull-word';
          span.textContent = word;
          span.style.animationDelay = (wordIndex * 0.1) + 's';
          wordIndex++;
          line.appendChild(span);
          line.appendChild(document.createTextNode(' '));
        });
      });
    } else {
      var text = el.textContent;
      var words = text.split(/\s+/).filter(Boolean);
      el.textContent = '';

      words.forEach(function (word) {
        var span = document.createElement('span');
        span.className = 'pull-word';
        span.textContent = word;
        span.style.animationDelay = (wordIndex * 0.1) + 's';
        wordIndex++;
        el.appendChild(span);
        el.appendChild(document.createTextNode(' '));
      });
    }
  }

  var wordsPullUpEls = document.querySelectorAll('.words-pull-up');
  wordsPullUpEls.forEach(splitWords);

  if ('IntersectionObserver' in window) {
    var wordsObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('words-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    wordsPullUpEls.forEach(function (el) {
      wordsObserver.observe(el);
    });

    var fadeObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = entry.target.getAttribute('data-delay') || '0';
          entry.target.style.animationDelay = delay + 's';
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up-reveal').forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  /* ===== 5. RENDERING Y FILTRADO DEL CATÁLOGO ===== */
  var currentCategory = 'all';
  var currentSearchQuery = '';
  var currentSort = 'featured';

  function renderCatalog() {
    var grid = document.getElementById('products-grid');
    if (!grid) return;

    var filtered = PRODUCTS.filter(function (p) {
      var matchesCategory = currentCategory === 'all' || p.category === currentCategory;
      var matchesSearch = p.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                            p.desc.toLowerCase().includes(currentSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Ordenamiento
    if (currentSort === 'price-low') {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (currentSort === 'price-high') {
      filtered.sort(function (a, b) { return b.price - a.price; });
    } else if (currentSort === 'rating') {
      filtered.sort(function (a, b) { return b.rating - a.rating; });
    }

    if (filtered.length === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--muted);">' +
                       '<h3>No se encontraron productos</h3><p>Intenta cambiar los términos de búsqueda o los filtros.</p></div>';
      return;
    }

    var html = '';
    filtered.forEach(function (p) {
      var specsHtml = p.specs.slice(0, 2).map(function (s) {
        return '<li>' + s + '</li>';
      }).join('');

      html += '<article class="store-card">' +
              '<span class="card-badge">' + p.badge + '</span>' +
              '<div class="card-media" style="background-image:url(\'' + p.img + '\');">' +
              '  <div class="card-quick-view">' +
              '    <button class="btn-secondary" onclick="openQuickView(\'' + p.id + '\')">Vista Rápida</button>' +
              '  </div>' +
              '</div>' +
              '<div class="card-info">' +
              '  <span class="card-category">' + p.category + '</span>' +
              '  <h3 class="card-title">' + p.name + '</h3>' +
              '  <div class="card-rating">★ ' + p.rating + ' <small>(' + p.reviewsCount + ' opiniones)</small></div>' +
              '  <ul class="card-specs-list">' + specsHtml + '</ul>' +
              '  <div class="card-footer">' +
              '    <div class="price-container">' +
              '      <span class="main-price">$' + p.price + ' USD</span>' +
              '      <span class="old-price-line">$' + p.oldPrice + '</span>' +
              '    </div>' +
              '    <button class="add-btn" onclick="addToCartById(\'' + p.id + '\')">+ Añadir</button>' +
              '  </div>' +
              '</div>' +
              '</article>';
    });

    grid.innerHTML = html;
  }

  // Event Listeners para Filtros
  document.querySelectorAll('.filter-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentCategory = this.getAttribute('data-category');
      renderCatalog();
    });
  });

  var headerSearch = document.getElementById('header-search');
  if (headerSearch) {
    headerSearch.addEventListener('input', function (e) {
      currentSearchQuery = e.target.value;
      renderCatalog();
    });
  }

  var sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      currentSort = e.target.value;
      renderCatalog();
    });
  }

  /* ===== 6. GESTIÓN DEL CARRITO DE COMPRAS ===== */
  function saveCart() {
    localStorage.setItem('cyber_cart', JSON.stringify(cartState));
    updateCartUI();
  }

  window.addToCartById = function (productId) {
    var product = PRODUCTS.find(function (p) { return p.id === productId; });
    if (!product) return;

    var existing = cartState.find(function (item) { return item.id === productId; });
    if (existing) {
      existing.qty++;
    } else {
      cartState.push({
        id: product.id,
        name: product.name,
        price: product.price,
        img: product.img,
        qty: 1
      });
    }

    saveCart();
    showToast('¡' + product.name + ' añadido al carrito!');
    openCartDrawer();
  };

  function updateCartUI() {
    var totalCount = cartState.reduce(function (acc, item) { return acc + item.qty; }, 0);
    var subtotal = cartState.reduce(function (acc, item) { return acc + (item.price * item.qty); }, 0);
    var discountAmt = subtotal * (appliedDiscount / 100);
    var grandTotal = Math.max(0, subtotal - discountAmt);

    // Actualizar Badges
    var badge = document.getElementById('cart-badge');
    var drawerCount = document.getElementById('cart-drawer-count');
    if (badge) badge.textContent = totalCount;
    if (drawerCount) drawerCount.textContent = totalCount;

    // Actualizar Totales
    var subtotalEl = document.getElementById('cart-subtotal');
    var totalEl = document.getElementById('cart-total');
    var discountRow = document.getElementById('discount-row');
    var discountEl = document.getElementById('cart-discount');

    if (subtotalEl) subtotalEl.textContent = '$' + subtotal + ' USD';
    if (totalEl) totalEl.textContent = '$' + Math.round(grandTotal) + ' USD';

    if (discountRow && discountEl) {
      if (appliedDiscount > 0) {
        discountRow.style.display = 'flex';
        discountEl.textContent = '-$' + Math.round(discountAmt) + ' USD (' + appliedDiscount + '%)';
      } else {
        discountRow.style.display = 'none';
      }
    }

    // Renderizar Items en Drawer
    var itemsContainer = document.getElementById('cart-items');
    if (!itemsContainer) return;

    if (cartState.length === 0) {
      itemsContainer.innerHTML = '<div style="text-align:center; padding:40px 0; color:var(--muted);">' +
                                 '<p>Tu carrito está vacío.</p><p style="font-size:12px; margin-top:8px;">Explora el catálogo y añade productos.</p></div>';
      return;
    }

    var html = '';
    cartState.forEach(function (item) {
      html += '<div class="cart-item">' +
              '  <div class="cart-item-img" style="background-image:url(\'' + item.img + '\');"></div>' +
              '  <div class="cart-item-info">' +
              '    <h4>' + item.name + '</h4>' +
              '    <div class="cart-item-price">$' + item.price + ' USD</div>' +
              '    <div class="cart-qty-controls">' +
              '      <button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">-</button>' +
              '      <span>' + item.qty + '</span>' +
              '      <button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
              '    </div>' +
              '  </div>' +
              '  <button class="close-btn" style="font-size:18px;" onclick="removeFromCart(\'' + item.id + '\')">&times;</button>' +
              '</div>';
    });

    itemsContainer.innerHTML = html;
  }

  window.changeQty = function (id, delta) {
    var item = cartState.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cartState = cartState.filter(function (i) { return i.id !== id; });
    }
    saveCart();
  };

  window.removeFromCart = function (id) {
    cartState = cartState.filter(function (i) { return i.id !== id; });
    saveCart();
    showToast('Producto eliminado del carrito');
  };

  // Cupones de Descuento
  var applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', function () {
      var input = document.getElementById('coupon-input');
      var code = input ? input.value.trim().toUpperCase() : '';

      if (code === 'NEURAL20') {
        appliedDiscount = 20;
        showToast('¡Cupón NEURAL20 aplicado! (20% OFF)');
      } else if (code === 'MOTIOS10') {
        appliedDiscount = 10;
        showToast('¡Cupón MOTIOS10 aplicado! (10% OFF)');
      } else if (code === '') {
        showToast('Por favor ingresa un código de cupón.');
      } else {
        showToast('Código de cupón no válido.');
      }
      updateCartUI();
    });
  }

  /* ===== 7. TOGGLE DEL DRAWER DE CARRITO ===== */
  var cartDrawer = document.getElementById('cart-drawer');
  var cartOverlay = document.getElementById('cart-overlay');
  var cartTrigger = document.getElementById('cart-trigger');
  var closeCartBtn = document.getElementById('close-cart');

  function openCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.add('active');
      cartOverlay.classList.add('active');
    }
  }

  function closeCartDrawer() {
    if (cartDrawer && cartOverlay) {
      cartDrawer.classList.remove('active');
      cartOverlay.classList.remove('active');
    }
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  /* ===== 8. MODAL DE VISTA RÁPIDA (QUICK VIEW) ===== */
  window.openQuickView = function (productId) {
    var product = PRODUCTS.find(function (p) { return p.id === productId; });
    if (!product) return;

    var content = document.getElementById('quickview-content');
    var modal = document.getElementById('quickview-modal');
    var overlay = document.getElementById('quickview-overlay');

    var specsList = product.specs.map(function (s) { return '<li>✓ ' + s + '</li>'; }).join('');

    content.innerHTML = '<div class="quickview-grid">' +
                        '  <div class="quickview-img" style="background-image:url(\'' + product.img + '\');"></div>' +
                        '  <div class="quickview-details">' +
                        '    <span class="card-category">' + product.category + '</span>' +
                        '    <h3>' + product.name + '</h3>' +
                        '    <div class="quickview-price">$' + product.price + ' USD <del style="font-size:14px; color:var(--label); margin-left:8px;">$' + product.oldPrice + '</del></div>' +
                        '    <p class="quickview-desc">' + product.desc + '</p>' +
                        '    <ul class="card-specs-list" style="margin-bottom:24px;">' + specsList + '</ul>' +
                        '    <button class="btn-primary" onclick="addToCartById(\'' + product.id + '\'); closeQuickView();">Añadir al Carrito Ahora</button>' +
                        '  </div>' +
                        '</div>';

    modal.classList.add('active');
    overlay.classList.add('active');
  };

  window.closeQuickView = function () {
    var modal = document.getElementById('quickview-modal');
    var overlay = document.getElementById('quickview-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  var qvOverlay = document.getElementById('quickview-overlay');
  if (qvOverlay) qvOverlay.addEventListener('click', closeQuickView);

  /* ===== 9. MODAL DE CHECKOUT & PROCESO DE PAGO ===== */
  window.openCheckout = function () {
    if (cartState.length === 0) {
      showToast('Tu carrito está vacío. Añade productos antes de pagar.');
      return;
    }
    closeCartDrawer();

    var modal = document.getElementById('checkout-modal');
    var overlay = document.getElementById('checkout-overlay');
    var countEl = document.getElementById('checkout-count');
    var totalEl = document.getElementById('checkout-total');
    var form = document.getElementById('checkout-form');
    var successView = document.getElementById('order-success');

    var totalCount = cartState.reduce(function (acc, item) { return acc + item.qty; }, 0);
    var subtotal = cartState.reduce(function (acc, item) { return acc + (item.price * item.qty); }, 0);
    var discountAmt = subtotal * (appliedDiscount / 100);
    var grandTotal = Math.round(subtotal - discountAmt);

    if (countEl) countEl.textContent = totalCount;
    if (totalEl) totalEl.textContent = '$' + grandTotal + ' USD';
    if (form) form.style.display = 'block';
    if (successView) successView.style.display = 'none';

    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
  };

  window.closeCheckout = function () {
    var modal = document.getElementById('checkout-modal');
    var overlay = document.getElementById('checkout-overlay');
    if (modal) modal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
  };

  window.processOrder = function (e) {
    e.preventDefault();
    var submitBtn = document.getElementById('pay-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = 'Procesando Transacción Neuronal...';
      submitBtn.disabled = true;
    }

    setTimeout(function () {
      cartState = [];
      saveCart();

      var form = document.getElementById('checkout-form');
      var successView = document.getElementById('order-success');
      var trackingCode = document.getElementById('tracking-code');

      if (trackingCode) {
        trackingCode.textContent = 'CR-' + Math.floor(10000 + Math.random() * 90000) + '-NX';
      }

      if (form) form.style.display = 'none';
      if (successView) successView.style.display = 'block';

      if (submitBtn) {
        submitBtn.textContent = 'Confirmar y Pagar Pedido';
        submitBtn.disabled = false;
      }
    }, 1500);
  };

  var ckOverlay = document.getElementById('checkout-overlay');
  if (ckOverlay) ckOverlay.addEventListener('click', closeCheckout);

  /* ===== 10. NEWSLETTER SUBMISSION ===== */
  var newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('¡Suscripción exitosa! Tu cupón es: MOTIOS10');
      newsForm.reset();
    });
  }

  /* ===== 11. TOAST SYSTEM ===== */
  function showToast(msg) {
    var container = document.getElementById('toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    container.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(function () { toast.remove(); }, 300);
    }, 3000);
  }

  /* ===== 12. MENÚ MÓVIL HAMBURGUESA ===== */
  var mobileToggle = document.getElementById('mobile-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('mobile-active');
    });

    // Cerrar menú móvil automáticamente al hacer clic en cualquier enlace de navegación
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('mobile-active');
      });
    });
  }

  /* ===== INITIAL RENDER ===== */
  renderCatalog();
  updateCartUI();

})();
