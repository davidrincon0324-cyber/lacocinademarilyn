# 🔗 CONEXIONES DEL PROYECTO RESTAURANTE

## Resumen Ejecutivo
El proyecto RESTAURANTE funciona mediante tres archivos principales que se conectan entre sí:
- **index.html** (HTML) → estructura y contenido
- **style.css** (CSS) → estilos y diseño visual  
- **main.js** (JavaScript) → interactividad y efectos dinámicos

---

## 📋 ARCHIVO: index.html

### ¿Qué contiene?
- Estructura HTML de la página web
- Todas las secciones: Header, Hero, Productos, Sobre Nosotros, Contacto, etc.
- Referencias a recursos externos

### Conexiones principales:

#### 1️⃣ **Conexión con style.css** (Línea 7)
```html
<link rel="stylesheet" href="css/style.css">
```
**¿Para qué?** Importa todos los estilos CSS de la página (colores, fuentes, layouts, animaciones)

#### 2️⃣ **Conexión con Google Fonts** (Línea 8)
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700;14..32,800&family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```
**¿Para qué?** Trae las fuentes tipográficas "Inter" y "Montserrat" desde Google Fonts

#### 3️⃣ **Conexión con Font Awesome** (Línea 9)
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```
**¿Para qué?** Proporciona los iconos (⭐, 🛒, 📱, etc.) utilizados en toda la página

#### 4️⃣ **Conexión con main.js** (Línea 287 - antes de </body>)
```html
<script src="js/main.js"></script>
```
**¿Para qué?** Carga el archivo JavaScript que añade:
- Menú hamburguesa responsivo (mobile)
- Efectos ripple en botones
- Animaciones de conteo en estadísticas
- Scroll suave entre secciones
- Botón "Volver al inicio"

---

## 🎨 ARCHIVO: style.css

### ¿Qué contiene?
- Variables CSS con colores, sombras y transiciones
- Estilos para todas las secciones (header, hero, productos, etc.)
- Estilos responsivos (mobile-first)
- Animaciones y transiciones

### Estructura de variables CSS (inicio del archivo):
```css
:root {
    --primary: #FF4B2B;          /* Naranja vibrante (botones principales) */
    --primary-dark: #E63E1F;     /* Naranja oscuro (hover) */
    --secondary: #FFC107;         /* Amarillo (acentos) */
    --dark: #1A1A1A;              /* Negro para header */
    --light: #F8F9FA;             /* Gris claro (fondo general) */
    --white: #FFFFFF;             /* Blanco (textos principales) */
}
```

### ¿Cómo se conecta con main.js?
Algunas clases CSS trabajan con JavaScript:
- `.hamburger` → Icono que dispara el menú
- `.nav-menu.active` → Clase añadida por JS para mostrar/ocultar menú
- `.btn-ripple` → Clase que activa el efecto ripple
- `.stat-number` → Números que animan al scroll

---

## ⚡ ARCHIVO: main.js

### ¿Qué hace?
Añade interactividad dinámica a la página mediante 5 funcionalidades principales:

#### 1️⃣ **Menú Hamburguesa Responsivo**
```javascript
const hamburger = document.querySelector('.hamburger');
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');  // Alterna mostrar/ocultar menú
});
```
- Selecciona el elemento `.hamburger` del HTML
- Al hacer clic, activa/desactiva la clase `active` en `.nav-menu`
- CSS anima la aparición/desaparición del menú

#### 2️⃣ **Efecto Ripple (Ondas al hacer clic)**
```javascript
document.querySelectorAll('.btn-ripple').forEach(button => {
    // Crea una onda visual desde el punto del clic
});
```
- Aplica a todos los botones con clase `.btn-ripple`
- Crea un elemento `<span>` que simula una onda
- Desaparece después de 600ms

#### 3️⃣ **Animación de Conteo en Estadísticas**
```javascript
const animateStats = () => {
    // Anima números de 0 al valor objetivo
};
```
- Se ejecuta cuando el usuario ve la sección "Sobre Nosotros"
- Usa `IntersectionObserver` para detectar visibilidad
- Anima los números "8 años", "50 ingredientes", "15000 clientes"

#### 4️⃣ **Scroll Suave Entre Secciones**
```javascript
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        target.scrollIntoView({ behavior: 'smooth' });
    });
});
```
- Detecta clics en enlaces internos (ej: "#productos")
- Desplaza la página suavemente hacia esa sección
- Complementa `scroll-behavior: smooth` del CSS

#### 5️⃣ **Botón "Volver al Inicio"**
```javascript
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        scrollTopBtn.style.display = 'block';  // Mostrar botón
    }
});
```
- Muestra un botón flotante después de desplazarse 300px
- Al hacer clic, vuelve al inicio con scroll suave
- Se oculta cuando estás en la parte superior

---

## 🔄 Flujo de carga de la página

```
1. Se abre index.html
   ↓
2. Se carga style.css → Estilos aplicados al HTML
   ↓
3. Se importan fuentes de Google Fonts → Tipografía correcta
   ↓
4. Se importan iconos de Font Awesome → Iconos visibles
   ↓
5. Se carga main.js → Interactividad activa
   ↓
6. Página funcional ✓
```

---

## 📁 Estructura de carpetas (actual)

```
RESTAURANTE/
├── index.html
├── pages/              ← Páginas secundarias (menu, admin)
├── css/                ← Estilos (`css/style.css`, `css/style2.css`, `css/cart.css`)
├── js/                 ← Scripts (`js/main.js`, `js/cart.js`)
├── assets/
│   └── images/         ← Todas las imágenes del proyecto
├── docs/               ← Documentación (CONEXIONES.md, RESUMEN_IMPLEMENTACION.txt)
├── scripts/            ← Utilidades (write_qr.py)
└── README.md / otros archivos de raíz
```

---

## ✅ Verificación: ¿Está todo conectado?

- ✓ index.html importa style.css (línea 7)
- ✓ index.html importa Google Fonts (línea 8)
- ✓ index.html importa Font Awesome (línea 9)
- ✓ index.html importa main.js (línea 287)
- ✓ main.js selecciona elementos del HTML
- ✓ CSS aplica estilos a elementos del HTML
- ✓ JavaScript modifica clases CSS (menú hamburguesa, botones)

---

## 🛠️ Cómo modificar cada archivo

### Para cambiar **colores**:
Edita las variables en `style.css` (líneas 26-35)

### Para cambiar **textos o productos**:
Edita el contenido en `index.html`

### Para cambiar **animaciones o efectos**:
Edita `main.js` (tiempos, velocidades, comportamientos)

### Para cambiar **apariencia (fonts, espaciados)**:
Edita los estilos en `style.css`

---

## 🎯 Próximos pasos opcionales

1. Crear carpeta `images/` para organizar imágenes
2. Crear carpeta `css/` para organizar estilos (si lo prefieres)
3. Crear carpeta `js/` para organizar scripts
4. Añadir imágenes reales (reemplaza referencias en index.html)
5. Configurar forma de contacto (newsletter form)

---

**Documento creado el 28 de abril de 2026**
**Proyecto: RESTAURANTE - Hamburguesas Artesanales**
