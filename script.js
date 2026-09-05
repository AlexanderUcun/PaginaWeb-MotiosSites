/**
 * ====================================================================================
 * CYBER RONIN TECH STORE - MOTOR INTERACTIVO Y ARQUITECTURA DE JAVASCRIPT
 * ====================================================================================
 * 
 * GUÍA DE ARQUITECTURA Y MANTENIMIENTO PARA DESARROLLADORES:
 * 
 * 1. ESTRUCTURA DEL MÓDULO:
 *    - Encapsulado mediante una IIFE (Immediately Invoked Function Expression) con 'use strict'
 *      para evitar la contaminación del ámbito global (`window`).
 *    - Expone únicamente funciones globales necesarias adjuntadas explícitamente a `window`
 *      (ej. `window.addToCartById`, `window.openQuickView`, `window.slideProducts`).
 * 
 * 2. SECCIONES PRINCIPALES Y FLUJO DE DATOS:
 *    - 1. BASE DE DATOS (`PRODUCTS`): Array estático de 22 objetos con especificaciones, precios y categorías.
 *    - 2. ESTADO DEL CARRITO (`cartState`): Sincronizado dinámicamente con `localStorage` ('cyber_cart').
 *    - 3. REVEAL SPOTLIGHT: Efecto de máscara radial dinámico según la posición del cursor/touch.
 *    - 4. REVEAL SCROLL ANIMATIONS: Animaciones tipográficas mediante `IntersectionObserver`.
 *    - 5. MOTOR DE CATÁLOGOS: Filtrado por categoría/búsqueda, ordenamiento y paginación ("Cargar Más").
 *    - 6. MOTOR DE CARRITO: Lógica CRUD (Añadir, eliminar, cambiar cantidad, aplicar cupones).
 *    - 7. DRAWER Y MODALES: Paneles deslizantes y modales interactivos (Quick View, Checkout).
 *    - 8. CARRUSELES HORIZONTALES: Desplazamiento suave multi-tarjeta estilo e-commerce masivo.
 * 
 * 3. CÓMO AGREGAR NUEVOS PRODUCTOS:
 *    - Añade un objeto al array `PRODUCTS` siguiendo la estructura:
 *      { id: 'p23', name: 'NOMBRE', category: 'laptops|wearables|smartphones|audio', price: 999, oldPrice: 1200, rating: 4.8, reviewsCount: 50, badge: 'NUEVO', img: 'img/...', specs: [...], desc: '...' }
 *    - Los contadores de categoría (`updateTabCounts()`) se actualizarán automáticamente.
 * 
 * 4. CÓMO SOLUCIONAR BUGS COMUNES:
 *    - El carrito no guarda productos -> Revisa si `localStorage` está deshabilitado o si se arrojó una excepción en `JSON.parse`.
 *    - Los carruseles no se desplazan -> Verifica que el ID pasado a `slideProducts(sliderId, dir)` coincida exactamente con el HTML.
 *    - El efecto Spotlight se corta en móviles -> Ajusta el radio en la función `getRadius()` dentro de la sección 3.
 * ====================================================================================
 */

(function () {
  'use strict';

  /* ====================================================================================
   * ===== 1. BASE DE DATOS EXTENDIDA DE PRODUCTOS (22 ITEMS) ==========================
   * ====================================================================================
   * Propósito: Servir como fuente única de verdad para el catálogo general y los carruseles.
   * Categorías válidas: 'wearables', 'smartphones', 'laptops', 'audio'.
   * ==================================================================================== */
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
    },
    {
      id: 'p7',
      name: 'RONIN VR MATRIX GOGGLES',
      category: 'wearables',
      price: 650,
      oldPrice: 799,
      rating: 4.9,
      reviewsCount: 45,
      badge: 'NUEVO',
      img: 'img/cyber_glasses.png',
      specs: [
        'Visión Foveal 10K OLED',
        'Retroalimentación Háptica',
        'Procesador Neural R2 Ultra',
        'Lentes Asféricas Custom'
      ],
      desc: 'Sumérgete en simulación virtual hiperrealista con el sistema de rastreo ocular activo y campo de visión ampliado de 140 grados.'
    },
    {
      id: 'p8',
      name: 'CYBERPHONE ULTRA 5G',
      category: 'smartphones',
      price: 1150,
      oldPrice: 1350,
      rating: 4.9,
      reviewsCount: 88,
      badge: 'FLAGSHIP',
      img: 'img/cyber_phone.png',
      specs: [
        'Pantalla Cuántica 6.9" 180Hz',
        'Cámara Holográfica 3D 200MP',
        'Batería Grapheno 6,000mAh',
        'Armazón de Carbo-Titanio'
      ],
      desc: 'El buque insignia con batería de grafeno de ultra velocidad, conectividad satellital global y seguridad biométrica cuántica.'
    },
    {
      id: 'p9',
      name: 'CYBERBOOK SLIM AI LAPTOP',
      category: 'laptops',
      price: 1450,
      oldPrice: 1699,
      rating: 4.7,
      reviewsCount: 39,
      badge: 'ULTRABOOK',
      img: 'img/cyber_laptop.png',
      specs: [
        'Pantalla 14" OLED 3.2K 120Hz',
        'Procesador AI Core Ultra 7',
        '32GB LPDDR5X / 1TB SSD',
        'Peso Pluma 1.1kg'
      ],
      desc: 'La laptop ultraligera definitiva para ejecutivos y creadores de contenido que exigen máxima movilidad y aceleración por hardware AI.'
    },
    {
      id: 'p10',
      name: 'PULSE STUDIO MONITOR PRO',
      category: 'audio',
      price: 340,
      oldPrice: 420,
      rating: 4.9,
      reviewsCount: 112,
      badge: 'ESTUDIO',
      img: 'img/cyber_headphones.png',
      specs: [
        'Drivers Planares de Magneto 55mm',
        'Respuesta Plana 5Hz-50kHz',
        'Construcción de Magnesio',
        'Cable Balanceado 4.4mm'
      ],
      desc: 'Auriculares de referencia de estudio para ingenieros de mezcla y apasionados del audio analógico-digital de alta resolución.'
    },
    {
      id: 'p11',
      name: 'RONIN AI COMPANION POD',
      category: 'wearables',
      price: 290,
      oldPrice: 350,
      rating: 4.5,
      reviewsCount: 29,
      badge: 'GADGET',
      img: 'img/cyber_glasses.png',
      specs: [
        'Asistente Holográfico 3D',
        'Procesamiento Local de Voz',
        'Hub de Domótica Neuronal',
        'Batería Inductiva 7 días'
      ],
      desc: 'Dispositivo asistente portátil con proyección holográfica compacta e integración domótica con todos tus equipos Cyber Ronin.'
    },
    {
      id: 'p12',
      name: 'CYBERPHONE FOLDABLE NEURAL',
      category: 'smartphones',
      price: 1499,
      oldPrice: 1799,
      rating: 4.8,
      reviewsCount: 53,
      badge: 'PREMIUM',
      img: 'img/cyber_phone.png',
      specs: [
        'Pantalla Plegable 8.0" FlexOLED',
        'Bisagra de Titanio Líquido',
        'S Pen Cyber Edition',
        'Multitarea en 4 Ventanas'
      ],
      desc: 'Combina el formato de un smartphone compacto con una tableta de trabajo completa de 8 pulgadas mediante pantalla flexible de zafiro.'
    },
    {
      id: 'p13',
      name: 'TITAN STATION GAMING DESKTOP',
      category: 'laptops',
      price: 2499,
      oldPrice: 2999,
      rating: 5.0,
      reviewsCount: 74,
      badge: 'POTENCIA AI',
      img: 'img/cyber_laptop.png',
      specs: [
        'Procesador Quantum i9 24-Core',
        'NVIDIA RTX 5090 Cyber Edition',
        '128GB RAM DDR5 / 4TB SSD',
        'Refrigeración Líquida Neón'
      ],
      desc: 'Estación de trabajo y gaming de potencia bruta extrema con arquitectura neuronal dedicada y chasis cibernético iluminado.'
    },
    {
      id: 'p14',
      name: 'NEURAL RING APEX SMART RING',
      category: 'wearables',
      price: 240,
      oldPrice: 299,
      rating: 4.6,
      reviewsCount: 92,
      badge: 'WEARABLE',
      img: 'img/cyber_glasses.png',
      specs: [
        'Monitoreo Cardíaco & Sueño EEG',
        'Titanio Grado Médico 5',
        'Control Gestual Táctil',
        'Sumergible hasta 50m'
      ],
      desc: 'Anillo inteligente ultraligero que analiza tus constantes biológicas en tiempo real y permite controlar dispositivos por gestos.'
    },
    {
      id: 'p15',
      name: 'CYBERPHONE MINI COMPACT',
      category: 'smartphones',
      price: 699,
      oldPrice: 850,
      rating: 4.7,
      reviewsCount: 67,
      badge: 'COMPACTO',
      img: 'img/cyber_phone.png',
      specs: [
        'Pantalla 5.4" OLED 120Hz',
        'Chip CyberSOC Lite 3.0GHz',
        'Doble Cámara Neón 50MP',
        'Cuerpo Ultra Delgado 140g'
      ],
      desc: 'Toda la potencia cibernética en una pantalla compacta de 5.4 pulgadas diseñada para uso ergonómico a una sola mano.'
    },
    {
      id: 'p16',
      name: 'SOUNDCUBE NEON SPEAKER',
      category: 'audio',
      price: 149,
      oldPrice: 199,
      rating: 4.5,
      reviewsCount: 143,
      badge: 'LIMITADA',
      img: 'img/cyber_headphones.png',
      specs: [
        'Sonido 360° Neón 60W',
        'Graves Sub-Woofer Pasivos',
        'Iluminación RGB Audiorítmica',
        'Batería de 24 Horas'
      ],
      desc: 'Altavoz inalámbrico portátil con sonido estéreo 360 grados, iluminación RGB reactiva al ritmo de la música y resistencia IP67.'
    },
    {
      id: 'p17',
      name: 'QUANTUM COREFLEX LAPTOP 15',
      category: 'laptops',
      price: 1299,
      oldPrice: 1550,
      rating: 4.8,
      reviewsCount: 51,
      badge: 'OFERTA',
      img: 'img/cyber_laptop.png',
      specs: [
        'Pantalla 15.6" OLED 165Hz',
        'Intel Core i7 14th Gen',
        '16GB RAM DDR5 / 1TB SSD',
        'Teclado RGB Programable'
      ],
      desc: 'El balance perfecto entre portabilidad, rendimiento para programación y procesamiento de IA en un formato versátil de 15.6 pulgadas.'
    },
    {
      id: 'p18',
      name: 'CYBER SOUNDBAR PRO 7.1',
      category: 'audio',
      price: 450,
      oldPrice: 580,
      rating: 4.9,
      reviewsCount: 38,
      badge: 'HI-FI HOME',
      img: 'img/cyber_headphones.png',
      specs: [
        'Sonido Envolvente Dolby Atmos',
        'Subwoofer Inalámbrico 300W',
        'HDMI eARC 8K Pass-Through',
        'Calibración Acústica por IA'
      ],
      desc: 'Barra de sonido de cine en casa con 11 altavoces integrados, proyección espacial Dolby Atmos y subwoofer inalámbrico retumbante.'
    },
    {
      id: 'p19',
      name: 'RONIN XR AR GLASSES LITE',
      category: 'wearables',
      price: 399,
      oldPrice: 499,
      rating: 4.7,
      reviewsCount: 84,
      badge: 'LIVIANO',
      img: 'img/cyber_glasses.png',
      specs: [
        'Pantalla Proyectada 201" Micro-OLED',
        'Peso Pluma de 75g',
        'Compatibilidad Universal USB-C',
        'Audio Espacial Incorporado'
      ],
      desc: 'Gafas de realidad aumentada ligeras que proyectan un monitor virtual de 201 pulgadas ante tus ojos para trabajar o jugar donde sea.'
    },
    {
      id: 'p20',
      name: 'CYBERPHONE GAMING RED',
      category: 'smartphones',
      price: 950,
      oldPrice: 1199,
      rating: 4.8,
      reviewsCount: 105,
      badge: 'GAMER',
      img: 'img/cyber_phone.png',
      specs: [
        'Pantalla 6.78" AMOLED 165Hz',
        'Gatillos Ultrasónicos Laterales',
        'Ventilador Físico Interno 20k RPM',
        'Carga Rápida 65W Bypass'
      ],
      desc: 'Diseñado puramente para e-sports móviles con gatillos capacitivos configurables, ventilación activa por turbina y batería dual.'
    },
    {
      id: 'p21',
      name: 'QUANTUM POWERBANK 50000MAH',
      category: 'audio',
      price: 110,
      oldPrice: 150,
      rating: 4.9,
      reviewsCount: 230,
      badge: 'ACCESORIO',
      img: 'img/cyber_headphones.png',
      specs: [
        'Capacidad 50,000 mAh PD 100W',
        'Carga Simultánea de 4 Equipos',
        'Pantalla Digital OLED de Wats',
        'Linterna LED SOS Integrada'
      ],
      desc: 'Estación de energía portátil capaz de cargar tu laptop, teléfono y visores VR múltiples veces con potencia de salida de 100W.'
    },
    {
      id: 'p22',
      name: 'NEURAL DISPLAY CURVED 49"',
      category: 'laptops',
      price: 1399,
      oldPrice: 1699,
      rating: 5.0,
      reviewsCount: 41,
      badge: '240HZ 4K',
      img: 'img/cyber_laptop.png',
      specs: [
        'Panel Curvo 1000R QD-OLED 49"',
        'Resolución DQHD 5120x1440',
        'Tiempo de Respuesta 0.03ms',
        'Hub USB-C con Carga 90W'
      ],
      desc: 'Monitor super ultrawide equivalente a dos pantallas 4K integradas sin bisel, con frecuencia de actualización récord de 240Hz.'
    }
  ];

  /* ====================================================================================
   * ===== 2. ESTADO DEL CARRITO DE COMPRAS ============================================
   * ====================================================================================
   * Propósito: Mantener la lista de productos seleccionados por el usuario y persistirla.
   * `cartState`: Array de objetos `{ id, name, price, img, qty }`.
   * `appliedDiscount`: Porcentaje entero de descuento activo (ej. 20 para 20% OFF).
   * ==================================================================================== */
  var cartState = JSON.parse(localStorage.getItem('cyber_cart') || '[]');
  var appliedDiscount = 0;

  /* ====================================================================================
   * ===== 3. REVEAL SPOTLIGHT ENGINE (EFECTO LINTERNA/LENTE SEGUNDA CAPA) ==============
   * ====================================================================================
   * Propósito: Revelar la imagen `#reveal-img` (fondo de alta definición/neón) aplicando
   * una máscara de degradado radial en la posición exacta del puntero o touch.
   * ==================================================================================== */
  var revealEl = document.getElementById('reveal-img');

  /**
   * Obtiene el radio del círculo de revelado ajustado dinámicamente según el ancho de pantalla.
   * @returns {number} Radio en píxeles.
   */
  function getRadius() {
    var w = window.innerWidth;
    if (w < 480) return 120; // Tamaño reducido para smartphones pequeños
    if (w < 720) return 160; // Tablets portátiles
    return 440;              // Desktop full HD
  }

  /**
   * Actualiza el atributo `mask-image` de la capa `#reveal-img` usando coordenadas relativas.
   * @param {number} clientX - Coordenada X global del evento.
   * @param {number} clientY - Coordenada Y global del evento.
   */
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

  // Escuchadores de eventos para escritorio (mousemove) y pantallas táctiles (touchmove)
  window.addEventListener('mousemove', function (e) {
    updateSpotlight(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', function (e) {
    if (e.touches && e.touches[0]) {
      updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  /* ====================================================================================
   * ===== 4. WORD SPLIT & ANIMACIONES AL HACER SCROLL =================================
   * ====================================================================================
   * Propósito: Descomponer el texto de los títulos con la clase `.words-pull-up` en <span>
   * individuales por palabra para aplicar la animación CSS de revelado secuencial.
   * Integrado con `IntersectionObserver` para activar la animación solo cuando es visible.
   * ==================================================================================== */
  function splitWords(el) {
    if (el.dataset.split) return;
    el.dataset.split = 'true';
    var wordIndex = 0;

    // Caso especial para H1 con elementos <span> hijos por línea de texto
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

  // Inicializar observadores de intersección si el navegador los soporta
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

  /* ====================================================================================
   * ===== 5. RENDERING, FILTRADO Y PAGINACIÓN DEL CATÁLOGO ===========================
   * ====================================================================================
   * Propósito: Controlar la renderización dinámica de la cuadrícula principal `#products-grid`.
   * Soporta:
   * - Filtrado por categorías (`all`, `wearables`, `smartphones`, `laptops`, `audio`).
   * - Búsqueda por coincidencia de texto en título o descripción.
   * - Ordenamiento (Destacados, Precio Bajo/Alto, Rating).
   * - Paginación incremental ("Cargar Más" de a 6 productos).
   * ==================================================================================== */
  var currentCategory = 'all';
  var currentSearchQuery = '';
  var currentSort = 'featured';
  var itemsPerPage = 6;
  var visibleCount = 6;

  /**
   * Carga 6 productos adicionales en el catálogo al hacer clic en "Ver Más Productos".
   */
  window.loadMoreProducts = function () {
    visibleCount += itemsPerPage;
    renderCatalog(false);
  };

  /**
   * Procesa los filtros activos y vuelve a renderizar el HTML del catálogo principal.
   * @param {boolean} resetPaging - Si es true, reinicia el contador visible a 6 (ej. al cambiar filtro).
   */
  function renderCatalog(resetPaging) {
    if (resetPaging !== false) {
      visibleCount = itemsPerPage;
    }

    var grid = document.getElementById('products-grid');
    var infoBar = document.getElementById('catalog-info-bar');
    var paginationWrapper = document.getElementById('pagination-wrapper');
    if (!grid) return;

    // 1. Filtrado de Array
    var filtered = PRODUCTS.filter(function (p) {
      var matchesCategory = currentCategory === 'all' || p.category === currentCategory;
      var matchesSearch = p.name.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                            p.desc.toLowerCase().includes(currentSearchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // 2. Ordenamiento de Array
    if (currentSort === 'price-low') {
      filtered.sort(function (a, b) { return a.price - b.price; });
    } else if (currentSort === 'price-high') {
      filtered.sort(function (a, b) { return b.price - a.price; });
    } else if (currentSort === 'rating') {
      filtered.sort(function (a, b) { return b.rating - a.rating; });
    }

    var totalMatches = filtered.length;

    // 3. Actualizar barra de estado con contadores
    if (infoBar) {
      if (totalMatches === 0) {
        infoBar.innerHTML = '<span>No se encontraron productos coincidentes.</span>';
      } else {
        var showingUntil = Math.min(visibleCount, totalMatches);
        infoBar.innerHTML = '<span>Mostrando <strong style="color:var(--orange);">' + showingUntil + '</strong> de <strong>' + totalMatches + '</strong> productos de tecnología</span>';
      }
    }

    // 4. Manejo de estado sin resultados
    if (totalMatches === 0) {
      grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px 20px; background:var(--card); border-radius:18px; border:1px solid var(--card-border);">' +
                       '<h3 style="color:var(--cream); font-size:1.2rem; margin-bottom:8px;">No se encontraron resultados</h3>' +
                       '<p style="color:var(--muted); font-size:13px;">Intenta cambiar el filtro de categoría o usar otros términos de búsqueda.</p></div>';
      if (paginationWrapper) paginationWrapper.innerHTML = '';
      return;
    }

    // 5. Cortar la lista según el número actual de items visibles
    var visibleProducts = filtered.slice(0, visibleCount);

    // 6. Generación del HTML de las tarjetas
    var html = '';
    visibleProducts.forEach(function (p) {
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

    // 7. Renderizado del botón "Ver Más Productos" o mensaje de fin
    if (paginationWrapper) {
      if (visibleCount < totalMatches) {
        var remaining = totalMatches - visibleCount;
        paginationWrapper.innerHTML = '<button class="btn-load-more" onclick="loadMoreProducts()">' +
                                       '<span>Ver Más Productos (' + remaining + ' restantes)</span>' +
                                       '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                                       '</button>';
      } else if (totalMatches > itemsPerPage) {
        paginationWrapper.innerHTML = '<div class="all-loaded-msg">✓ Has visto todos los ' + totalMatches + ' productos disponibles</div>';
      } else {
        paginationWrapper.innerHTML = '';
      }
    }
  }

  /**
   * Actualiza el texto numérico en los botones de categoría (ej. "Smartphones (5)").
   */
  function updateTabCounts() {
    var counts = {
      all: PRODUCTS.length,
      wearables: PRODUCTS.filter(function(p){ return p.category === 'wearables'; }).length,
      smartphones: PRODUCTS.filter(function(p){ return p.category === 'smartphones'; }).length,
      laptops: PRODUCTS.filter(function(p){ return p.category === 'laptops'; }).length,
      audio: PRODUCTS.filter(function(p){ return p.category === 'audio'; }).length
    };

    document.querySelectorAll('.filter-tab').forEach(function (tab) {
      var cat = tab.getAttribute('data-category');
      var labels = {
        all: 'Todos los Productos',
        wearables: 'VR & Wearables',
        smartphones: 'Smartphones',
        laptops: 'Laptops',
        audio: 'Audio High-End'
      };
      if (labels[cat] && counts[cat] !== undefined) {
        tab.textContent = labels[cat] + ' (' + counts[cat] + ')';
      }
    });
  }

  // Escuchadores para pestañas de filtrado
  document.querySelectorAll('.filter-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-tab').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      currentCategory = this.getAttribute('data-category');
      renderCatalog(true);
    });
  });

  // Escuchador de entrada de texto para búsqueda en vivo
  var headerSearch = document.getElementById('header-search');
  if (headerSearch) {
    headerSearch.addEventListener('input', function (e) {
      currentSearchQuery = e.target.value;
      renderCatalog(true);
    });
  }

  // Escuchador de cambio en el selector de ordenamiento
  var sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function (e) {
      currentSort = e.target.value;
      renderCatalog(true);
    });
  }

  /* ====================================================================================
   * ===== 6. GESTIÓN DEL CARRITO DE COMPRAS (OPERACIONES Y INTERFAZ) ===================
   * ====================================================================================
   * Propósito: Manejar la lógica de negocio del carrito (agregar, eliminar, modificar qty),
   * calcular subtotales/descuentos y sincronizar la interfaz del Drawer y Badges.
   * ==================================================================================== */
  
  /**
   * Guarda la variable `cartState` en `localStorage` y actualiza la UI del carrito.
   */
  function saveCart() {
    localStorage.setItem('cyber_cart', JSON.stringify(cartState));
    updateCartUI();
  }

  /**
   * Añade un producto al carrito por su ID único o incrementa la cantidad si ya existe.
   * @param {string} productId - ID del producto (ej. 'p1').
   */
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

  /**
   * Recalcula los montos del carrito y actualiza todos los elementos del DOM relacionados.
   */
  function updateCartUI() {
    var totalCount = cartState.reduce(function (acc, item) { return acc + item.qty; }, 0);
    var subtotal = cartState.reduce(function (acc, item) { return acc + (item.price * item.qty); }, 0);
    var discountAmt = subtotal * (appliedDiscount / 100);
    var grandTotal = Math.max(0, subtotal - discountAmt);

    // Actualizar Badges y Contadores
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

    // Renderizar lista de ítems dentro del Drawer
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

  /**
   * Modifica la cantidad de un ítem en el carrito.
   * @param {string} id - ID del producto.
   * @param {number} delta - Variación (+1 o -1).
   */
  window.changeQty = function (id, delta) {
    var item = cartState.find(function (i) { return i.id === id; });
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cartState = cartState.filter(function (i) { return i.id !== id; });
    }
    saveCart();
  };

  /**
   * Elimina un producto por completo del carrito.
   * @param {string} id - ID del producto.
   */
  window.removeFromCart = function (id) {
    cartState = cartState.filter(function (i) { return i.id !== id; });
    saveCart();
    showToast('Producto eliminado del carrito');
  };

  // Escuchador para la aplicación de Cupones de Descuento
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

  /* ====================================================================================
   * ===== 7. TOGGLE DEL DRAWER DE CARRITO DESLIZANTE ==================================
   * ====================================================================================
   * Propósito: Abrir y cerrar el panel lateral del carrito activando/desactivando
   * las clases `.active` en `#cart-drawer` y `#cart-overlay`.
   * ==================================================================================== */
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

  /* ====================================================================================
   * ===== 8. MODAL DE VISTA RÁPIDA (QUICK VIEW) =======================================
   * ====================================================================================
   * Propósito: Mostrar los detalles completos del producto en una ventana modal flotante
   * sin redirigir de página.
   * ==================================================================================== */
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

  /* ====================================================================================
   * ===== 9. MODAL DE CHECKOUT & PROCESO DE PAGO ======================================
   * ====================================================================================
   * Propósito: Simular la pasarela de pago final con validación de carrito no vacío,
   * cálculo de totales finales y generación de un código de rastreo aleatorio.
   * ==================================================================================== */
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

  /**
   * Procesa el formulario de checkout simulando una petición de 1.5 segundos a la pasarela.
   */
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

  /* ====================================================================================
   * ===== 10. ENVÍO DE FORMULARIO DE NEWSLETTER =======================================
   * ====================================================================================
   * Propósito: Capturar el registro del boletín informativo y notificar el cupón obtenido.
   * ==================================================================================== */
  var newsForm = document.getElementById('newsletter-form');
  if (newsForm) {
    newsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('¡Suscripción exitosa! Tu cupón es: MOTIOS10');
      newsForm.reset();
    });
  }

  /* ====================================================================================
   * ===== 11. SISTEMA DE NOTIFICACIONES TOAST ========================================
   * ====================================================================================
   * Propósito: Generar pequeñas burbujas flotantes de alerta temporal en la esquina del sitio.
   * ==================================================================================== */
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

  /* ====================================================================================
   * ===== 12. MENÚ MÓVIL HAMBURGUESA ==================================================
   * ====================================================================================
   * Propósito: Conmutar la visibilidad de la navegación flotante en dispositivos móviles.
   * ==================================================================================== */
  var mobileToggle = document.getElementById('mobile-toggle');
  var navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', function () {
      navMenu.classList.toggle('mobile-active');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('mobile-active');
      });
    });
  }

  /* ====================================================================================
   * ===== 13. CARRUSELES HORIZONTALES / SLIDERS ENGINE ================================
   * ====================================================================================
   * Propósito: Controlar el desplazamiento suave horizontal (`scrollBy`) mediante los botones
   * de navegación `<` y `>`, y generar las tarjetas estilo e-commerce (Mercado Libre / Amazon)
   * con etiquetas de cuotas sin interés, porcentaje de descuento verde y envío ⚡ FULL.
   * ==================================================================================== */

  /**
   * Desplaza el slider horizontal un 75% del ancho visible del contenedor.
   * @param {string} sliderId - ID del contenedor con overflow-x auto.
   * @param {number} direction - -1 para izquierda, 1 para derecha.
   */
  window.slideProducts = function (sliderId, direction) {
    var slider = document.getElementById(sliderId);
    if (!slider) return;
    var amount = slider.clientWidth * 0.75;
    slider.scrollBy({
      left: direction * amount,
      behavior: 'smooth'
    });
  };

  /**
   * Plantilla HTML para la creación de tarjetas dentro de los carruseles horizontales.
   * @param {Object} p - Objeto producto proveniente de `PRODUCTS`.
   * @returns {string} String HTML de la tarjeta de producto.
   */
  function createSliderCardHTML(p) {
    var discountPercent = Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100);
    var cuotaPrice = Math.round(p.price / 6);

    return '<article class="slider-card">' +
           '<span class="card-badge">' + p.badge + '</span>' +
           '<div class="card-media" style="background-image:url(\'' + p.img + '\');">' +
           '  <div class="card-quick-view">' +
           '    <button class="btn-secondary" onclick="openQuickView(\'' + p.id + '\')">Vista Rápida</button>' +
           '  </div>' +
           '</div>' +
           '<div class="card-info">' +
           '  <span class="card-category">' + p.category + '</span>' +
           '  <h3 class="card-title">' + p.name + '</h3>' +
           '  <div class="card-rating">★ ' + p.rating + ' <small>(' + p.reviewsCount + ')</small></div>' +
           '  <div style="margin-top:auto;">' +
           '    <div class="price-container">' +
           '      <div style="display:flex; align-items:center;">' +
           '        <span class="main-price">$' + p.price + ' USD</span>' +
           '        <span class="discount-badge-green">' + discountPercent + '% OFF</span>' +
           '      </div>' +
           '      <span class="old-price-line">$' + p.oldPrice + ' USD</span>' +
           '    </div>' +
           '    <div class="cuotas-tag">6 cuotas de $' + cuotaPrice + ' sin interés</div>' +
           '    <div class="full-shipping-tag"><span>Llega gratis mañana</span> ⚡ FULL</div>' +
           '    <button class="add-btn" style="width:100%; margin-top:10px;" onclick="addToCartById(\'' + p.id + '\')">+ Añadir al Carrito</button>' +
           '  </div>' +
           '</div>' +
           '</article>';
  }

  /**
   * Filtra los productos de la base de datos y los inyecta en los 3 carruseles horizontales del DOM.
   */
  function renderSliders() {
    var recentSlider = document.getElementById('slider-recent');
    var mobileSlider = document.getElementById('slider-mobiles');
    var laptopSlider = document.getElementById('slider-laptops');

    if (recentSlider) {
      var recentItems = PRODUCTS.slice(0, 8);
      recentSlider.innerHTML = recentItems.map(createSliderCardHTML).join('');
    }

    if (mobileSlider) {
      var mobileItems = PRODUCTS.filter(function (p) { return p.category === 'smartphones' || p.category === 'wearables'; });
      mobileSlider.innerHTML = mobileItems.map(createSliderCardHTML).join('');
    }

    if (laptopSlider) {
      var laptopItems = PRODUCTS.filter(function (p) { return p.category === 'laptops' || p.category === 'audio'; });
      laptopSlider.innerHTML = laptopItems.map(createSliderCardHTML).join('');
    }
  }

  /* ====================================================================================
   * ===== INICIALIZACIÓN DE COMPONENTES AL CARGAR LA PÁGINA ============================
   * ==================================================================================== */
  updateTabCounts();
  renderCatalog();
  renderSliders();
  updateCartUI();

})();
