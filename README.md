# Blog de artículos — Prueba técnica Fullstack Developer

Aplicación web para gestionar artículos: registro/login de usuarios, creación y edición de artículos propios, y una página pública con autores y buscador.

## Stack técnico

**Frontend:** React + TypeScript + Vite + HeroUI, TanStack Router (routing), TanStack Query (datos del servidor) y TanStack Form (formularios), validación con Zod.

**Backend:** Hono (API), Better Auth (autenticación por email/contraseña), MongoDB con el driver nativo (sin ORM), validación con Zod.

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

## Decisiones técnicas

- **Client-Side Rendering (sin SSR):** la aplicación es una SPA renderizada del lado del cliente. Esto implica limitaciones de SEO en la página pública, ya que el contenido no está presente en el HTML inicial. Se evaluó agregar SSR, pero se descartó por estar fuera del alcance de los requisitos técnicos pedidos (Vite + TanStack Router no incluyen SSR nativo; requeriría adoptar un framework distinto, como TanStack Start) y del plazo de la prueba.
- **Validación de permisos en el servidor:** las operaciones de editar y eliminar un artículo verifican en el backend que el artículo pertenezca al usuario autenticado, más allá de que la interfaz ya oculte esos botones a quien no es el dueño.
- **Búsqueda pública:** se implementa con `$regex` case-insensitive sobre título, contenido y nombre de autor, ejecutada del lado del servidor.
- **Estado de búsqueda y paginación en la URL:** los parámetros `q` y `page` viven en la URL (vía search params de TanStack Router), no en estado local — así los resultados son compartibles y persisten al recargar la página.

## Uso de herramientas de IA

Utilicé **Claude (Anthropic)** durante toda la prueba, principalmente como guía de aprendizaje y para destrabar errores de configuración de librerías (varias con cambios de API entre versiones, como HeroUI v3 y TanStack Router), no como generador de código a copiar sin entender. Concretamente lo usé para:

- Explicarme conceptos que no conocía previamente (TanStack Query/Router/Form, patrones de Better Auth, reglas de hooks de React) mientras escribía el código yo misma.
- Debuggear errores puntuales de configuración (Tailwind v4, orden de rutas en Hono, problemas de compatibilidad de versiones de HeroUI v3).
- Revisar y sugerir mejoras de accesibilidad y responsive design.
- Redactar este README.

## Adicionales implementados

- Filtros de búsqueda reflejados en la URL (`?q=...&page=...`)
- Estados de carga, vacío y error en todas las vistas
- Paginación tanto en el listado privado como en la búsqueda pública
- Diseño responsive (mobile/desktop)
- Recuperación de contraseña por email (con [Resend](https://resend.com)), aunque el enunciado aclara que no es un requisito — la agregué como práctica adicional. Para probarla hace falta una `RESEND_API_KEY`; te la comparto por separado (no la subo al repo por ser una credencial real), ya que no es necesaria para el resto de la funcionalidad.