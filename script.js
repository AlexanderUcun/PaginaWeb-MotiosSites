
/*
 * Todo el código está dentro de una función aislada para no crear variables
 * globales. El archivo se carga con defer desde index.html.
 */
(function () {
'use strict';

/* ===== 1. SPOTLIGHT REVEAL ===== */
var revealEl = document.getElementById('reveal-img');
// Debe coincidir con el id de la imagen superior en index.html.

/**
 * Devuelve el tamaño del foco según el ancho de la ventana.
 * Modifica 120, 160 y 260 para hacer el foco más pequeño o más grande.
 */
function getRadius() {
var w = window.innerWidth;
if (w < 480) return 120;
if (w < 720) return 160;
return 460;
}

/**
 * Mueve el foco de la imagen superior hasta la posición indicada.
 * clientX y clientY son las coordenadas del ratón o del dedo en la pantalla.
 * Para cambiar el aspecto del foco, edita la variable "mask" y sus porcentajes.
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

window.addEventListener('mousemove', function (e) {
// Actualiza el foco mientras se mueve el ratón por la ventana.
updateSpotlight(e.clientX, e.clientY);
});

window.addEventListener('touchmove', function (e) {
// Permite el mismo efecto en teléfonos y tabletas mediante el dedo.
if (e.touches && e.touches[0]) {
    updateSpotlight(e.touches[0].clientX, e.touches[0].clientY);
}
}, { passive: true });

/* ===== 2. WORD SPLIT ===== */
/**
 * Separa el texto de un elemento en palabras independientes.
 * Esto permite que CSS anime cada palabra con un retraso progresivo.
 * Para aplicarlo a otro elemento, añade la clase "words-pull-up" en el HTML.
 */
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
// Para animar otro texto, añade esta clase en index.html.
wordsPullUpEls.forEach(splitWords);

/* ===== 3. SCROLL REVEAL ===== */
/*
 * Observa los elementos animados cuando entran en pantalla.
 * Cambia threshold: 0.2 y threshold: 0.15 para iniciar las animaciones
 * cuando haya entrado una proporción distinta del elemento en la ventana.
 */
if ('IntersectionObserver' in window) {
// IntersectionObserver ejecuta las animaciones solo cuando los elementos son visibles.
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
} else {
// Alternativa para navegadores antiguos que no tienen IntersectionObserver.
wordsPullUpEls.forEach(function (el) {
    el.classList.add('words-visible');
});
document.querySelectorAll('.fade-up-reveal').forEach(function (el) {
    var delay = el.getAttribute('data-delay') || '0';
    el.style.animationDelay = delay + 's';
    el.classList.add('is-visible');
});
}
})();
