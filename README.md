# Blog de artículos — Prueba técnica Fullstack Developer

Aplicación web para gestionar artículos: registro/login de usuarios, creación y edición de artículos propios, y una página pública con autores y buscador.

## Stack técnico

**Frontend:** React + TypeScript + Vite + HeroUI, TanStack Router (routing), TanStack Query (datos del servidor) y TanStack Form (formularios), validación con Zod.

**Backend:** Hono (API), Better Auth (autenticación por email/contraseña), MongoDB con el driver nativo (sin ORM), validación con Zod.


## Demo en producción

- **Frontend:** https://wortise-prueba-tecnica.vercel.app/
- **Backend (API):** https://wortise-prueba-tecnica-xd43.onrender.com

> Nota: el backend está en el plan gratuito de Render, que "duerme" tras un rato de inactividad — la primera request después de un tiempo sin uso puede tardar hasta ~50 segundos en responder mientras el servidor se reactiva.


## Estructura del repositorio

prueba-tecnica-blog-app/
client/ → frontend (Vite + React)
server/ → backend (Hono + MongoDB)




Cada carpeta tiene su propio `package.json`, `.env.example` y se ejecuta de forma independiente.

## Requisitos previos

- Node.js 20 o superior
- Una base de datos MongoDB (local o en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), gratis)

## Instalación y ejecución local

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Completá `.env` con tus valores:

MONGODB_URI= # connection string de tu MongoDB (local o Atlas)
MONGODB_DB_NAME=blog_app
BETTER_AUTH_SECRET= # cualquier string largo y random (podés generarlo con: openssl rand -base64 32)
BETTER_AUTH_URL=http://localhost:3001
CORS_ORIGIN=http://localhost:5173
PORT=3001
RESEND_API_KEY= # necesaria solo para probar la recuperación de contraseña (ver sección "Adicionales" abajo)

Levantar el servidor:

```bash
npm run dev
```

El backend queda disponible en `http://localhost:3001`.

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
cp .env.example .env
```

El `.env` del cliente ya viene con el valor correcto por defecto:


VITE_API_URL=http://localhost:3001

Levantar el cliente:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### 3. Usar la app

1. Andá a `http://localhost:5173`
2. Registrate desde `/register`
3. Creá, editá y eliminá tus artículos desde `/articles`
4. La home (`/`) es pública: cualquiera puede ver autores y buscar artículos sin necesidad de una cuenta.

### Datos de prueba (seed)

Para no tener que registrarte y crear artículos a mano, hay un script que carga usuarios y artículos de ejemplo:

```bash
cd server
npm run seed
```

Esto crea 2 usuarios de prueba (contraseña `password123` para ambos) con artículos de ejemplo asociados. El script es seguro de correr varias veces — no duplica datos que ya existan.

## Decisiones técnicas

- **Client-Side Rendering (sin SSR):** la aplicación es una SPA renderizada del lado del cliente. Esto implica limitaciones de SEO en la página pública, ya que el contenido no está presente en el HTML inicial. Se evaluó agregar SSR, pero se descartó por estar fuera del alcance de los requisitos técnicos pedidos (Vite + TanStack Router no incluyen SSR nativo; requeriría adoptar un framework distinto, como TanStack Start) y del plazo de la prueba.
- **Validación de permisos en el servidor:** las operaciones de editar y eliminar un artículo verifican en el backend que el artículo pertenezca al usuario autenticado, más allá de que la interfaz ya oculte esos botones a quien no es el dueño.
- **Búsqueda pública:** se implementa con `$regex` case-insensitive sobre título, contenido y nombre de autor, ejecutada del lado del servidor.
- **Estado de búsqueda y paginación en la URL:** los parámetros `q` y `page` viven en la URL (vía search params de TanStack Router), no en estado local — así los resultados son compartibles y persisten al recargar la página.


- **Cookies de sesión cross-domain:** como el frontend (Vercel) y el backend (Render) viven en dominios distintos, la cookie de sesión de Better Auth requiere `sameSite: "none"` y `secure: true` en producción (y `sameSite: "lax"` sin `secure` en desarrollo local, donde no se corre sobre HTTPS).
- **Rewrites de SPA en Vercel:** se agregó un `vercel.json` con un rewrite a `index.html` para todas las rutas, ya que sin esto, entrar directo a una URL como `/login` (o recargarla) devuelve 404 — el servidor no sabe que esa ruta la maneja el JavaScript del lado del cliente.

## Uso de herramientas de IA

Utilicé **Claude (Anthropic)** durante toda la prueba, principalmente como guía de aprendizaje y para destrabar errores de configuración de librerías (varias con cambios de API entre versiones, como HeroUI v3 y TanStack Router), no como generador de código a copiar sin entender. Concretamente lo usé para:

- Explicarme conceptos que no conocía previamente (TanStack Query/Router/Form, patrones de Better Auth, reglas de hooks de React) mientras escribía el código yo misma.
- Debuggear errores puntuales de configuración (Tailwind v4, orden de rutas en Hono, problemas de compatibilidad de versiones de HeroUI v3).
- Revisar y sugerir mejoras de accesibilidad y responsive design.
- Redactar este README.




## Adicionales implementados

- Filtros de búsqueda y paginación reflejados en la URL, con valores por defecto ocultos (`stripSearchParams`)
- Estados de carga (con `Spinner`), vacío (con ilustración) y error (con ícono y botón de reintentar) especialmente cuidados en todas las vistas
- Paginación tanto en el listado privado como en la búsqueda pública
- Diseño responsive (mobile/desktop)
- Mejoras de accesibilidad: `alt` descriptivo en imágenes, `aria-label` en botones sin texto, `role="dialog"` en el modal de confirmación, `lang="es"` en el documento
- Mejoras de SEO: meta tags dinámicos (título de pestaña por página), `sitemap.xml` y `robots.txt`, `loading="lazy"` en imágenes de las grillas
- Mostrar/ocultar contraseña en los formularios de login, registro y cambio de contraseña
- Seed de datos para facilitar la revisión (`npm run seed`)
- Despliegue funcional (Vercel + Render) — links arriba
- Recuperación de contraseña por email (con [Resend](https://resend.com)), aunque el enunciado aclara que no es un requisito — la agregué como práctica adicional. Para probarla hace falta una `RESEND_API_KEY`; te la comparto por separado (no la subo al repo por ser una credencial real), ya que no es necesaria para el resto de la funcionalidad.
