/* =====================================================
    MAIN.JS - INTERACTIVIDAD DE RESTAURANTE
   =====================================================
   Este archivo JavaScript es cargado al final del index.html (antes de </body>)
   mediante: <script src="main.js"></script>
   
   Propósito: Agregar interactividad y efectos dinámicos a la página
   Funcionalidades:
   1. Menú hamburguesa responsivo (mobile)
   2. Efectos visuales (ripple en botones)
   3. Animaciones (conteo de estadísticas)
   4. Scroll suave entre secciones
   5. Botón "Volver al inicio"
   ===================================================== */

/* ===== 1. MENÚ HAMBURGUESA RESPONSIVO =====
   Permite abrir/cerrar el menú de navegación en dispositivos móviles
   Se activa mediante el icono de hamburguesa (tres líneas)
*/
const hamburger = document.querySelector('.hamburger');  // Selecciona el ícono de menú
const navMenu = document.querySelector('.nav-menu');     // Selecciona el menú navegación

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');  // Alterna la clase 'active' para mostrar/ocultar
    });

    // Cerrar menú automáticamente cuando el usuario hace clic en un enlace
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');  // Elimina 'active' para cerrar el menú
        });
    });
}

/* ===== 2. EFECTO RIPPLE EN BOTONES =====
   Crea un efecto de onda que se propaga desde el punto donde el usuario hizo clic
   Se aplica a todos los botones con clase 'btn-ripple'
*/
document.querySelectorAll('.btn-ripple').forEach(button => {
    button.addEventListener('click', function(e) {
        // Crear un elemento <span> para la onda y añadir estilos en línea seguros
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        const rect = this.getBoundingClientRect();
        const d = Math.max(rect.width, rect.height) * 1.2;
        ripple.style.width = ripple.style.height = d + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255,255,255,0.28)';
        ripple.style.pointerEvents = 'none';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        ripple.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

        // Posición relativa al botón
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        this.style.position = this.style.position || 'relative';
        this.appendChild(ripple);

        // Forzar animación
        requestAnimationFrame(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';
            ripple.style.opacity = '1';
        });

        setTimeout(() => {
            ripple.style.opacity = '0';
            setTimeout(() => ripple.remove(), 400);
        }, 400);
    });
});

/* ===== 3. ANIMACIÓN DE CONTEO DE ESTADÍSTICAS =====
   Anima los números en la sección "Sobre Nosotros"
   Los números cuentan desde 0 hasta el valor objetivo cuando se visualiza la sección
*/
const stats = document.querySelectorAll('.stat-number');  // Selecciona todos los números

const animateStats = () => {
    stats.forEach(stat => {
        // Obtener el número objetivo del atributo 'data-count'
        const target = parseInt(stat.getAttribute('data-count'));
        let current = 0;
        const increment = target / 50;  // Dividir el objetivo en 50 pasos para suavidad
        
        const updateCount = () => {
            if (current < target) {
                current += increment;
                stat.innerText = Math.ceil(current);  // Mostrar número redondeado
                setTimeout(updateCount, 30);  // Actualizar cada 30ms
            } else {
                stat.innerText = target;  // Mostrar número final exacto
            }
        };
        updateCount();  // Iniciar la animación
    });
};

/* Usar Intersection Observer para detectar cuando la sección "about" es visible */
const observerOptions = {
    threshold: 0.5  // Activar cuando el 50% de la sección sea visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();  // Iniciar animación
            observer.unobserve(entry.target);  // Dejar de observar (ejecutar solo una vez)
        }
    });
}, observerOptions);

// Observar la sección "about"
const aboutSection = document.querySelector('.about');
if (aboutSection && stats.length > 0) {
    observer.observe(aboutSection);
}

/* ===== 4. SCROLL SUAVE ENTRE SECCIONES =====
   Cuando el usuario hace clic en un enlace interno (#), 
   la página se desplaza suavemente a esa sección
*/
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();  // Prevenir salto abrupto
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });  // Desplazamiento suave
        }
    });
});

/* ===== 5. BOTÓN "VOLVER AL INICIO" =====
   Muestra un botón flotante para volver al top cuando el usuario desplaza la página
*/
const scrollTopBtn = document.getElementById('scrollTop');
if (scrollTopBtn) {
    // Mostrar/ocultar el botón según la posición del scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {  // Si se ha desplazado más de 300px
            scrollTopBtn.style.display = 'block';  // Mostrar botón
        } else {
            scrollTopBtn.style.display = 'none';   // Ocultar botón
        }
    });

    // Al hacer clic, desplazarse suavemente al inicio
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Cambio de imagen al hover en tarjetas de producto (simulado con efecto)
const productCards = document.querySelectorAll('.producto-card');
if (productCards.length > 0) {
    productCards.forEach(card => {
        const img = card.querySelector('.producto-img');
        if (!img) return;
        
        // Efecto hover (puedes cambiar por otra imagen si tienes)
        card.addEventListener('mouseenter', () => {
            img.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            img.style.transform = 'scale(1)';
        });
    });
}

// Newsletter
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input').value;
        alert(`¡Gracias por suscribirte ${email}! Recibirás nuestras ofertas.`);
        newsletterForm.reset();
    });
}

// Animación de entrada al hacer scroll (fade-in)
const fadeElements = document.querySelectorAll('.producto-card, .reseña-card, .horario-card, .contacto-card');
if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    fadeElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        fadeObserver.observe(el);
    });
}

// Header cambio de fondo al scroll
const header = document.querySelector('.header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    });
}

console.log('RESTAURANTE - Página cargada con éxito 🍔');