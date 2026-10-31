// Una sola constante controla todos los enlaces de WhatsApp con JavaScript.
const WHATSAPP_NUMBER = '50432708285';

function createWhatsAppLink(message = '') {
    const base = `https://wa.me/${WHATSAPP_NUMBER}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

function createProductMessage(product, price) {
    const question = product === 'Camarones'
        ? '¿Qué tamaños tienen disponibles?'
        : '¿Tienen disponibilidad?';
    return `¡Hola! Estoy visitando la página web de Mariscos Danzarina del Mar y quisiera consultar por ${product.toLowerCase()} de L ${price} por libra. ${question}`;
}

// Los enlaces siguen siendo enlaces reales: el cliente revisa y envía el mensaje.
document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    link.href = link.dataset.product
        ? createWhatsAppLink(createProductMessage(link.dataset.product, link.dataset.price))
        : createWhatsAppLink();
});

const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-principal');

function closeMenu(returnFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    menu.classList.remove('is-open');
    if (returnFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Abrir menú' : 'Cerrar menú');
    menu.classList.toggle('is-open', !isOpen);
});

menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
        const wasOpen = menu.classList.contains('is-open');
        closeMenu();
        // Tras cerrar el menú móvil, el teclado continúa en la sección elegida.
        if (wasOpen) {
            const section = document.querySelector(link.getAttribute('href'));
            section.setAttribute('tabindex', '-1');
            section.focus({ preventScroll: true });
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
});

document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) closeMenu();
});

window.matchMedia('(min-width: 900px)').addEventListener('change', () => closeMenu());

// Resalta la sección visible sin alterar el historial del navegador.
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            menu.querySelectorAll('a').forEach((link) => {
                if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
                else link.removeAttribute('aria-current');
            });
        });
    }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();
document.documentElement.classList.add('js');
