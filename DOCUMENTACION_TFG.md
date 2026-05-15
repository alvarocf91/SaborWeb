# Documentación técnica — Proyecto SaborWeb

Última actualización: 15 de mayo de 2026

Resumen
-------
SaborWeb es una plataforma web para compartir, buscar y valorar recetas de cocina. El proyecto sigue una arquitectura cliente-servidor con frontend en React y backend en Laravel (PHP). Está diseñada para ser responsiva, accesible y preparada para escalar como producto tipo startup.

Objetivo de la aplicación
-------------------------
- Permitir a usuarios crear, editar y compartir recetas.
- Buscar recetas e ingredientes, filtrar por tipos de comida, dificultad y tiempo.
- Valorar y reseñar recetas, marcar favoritas.
- Gestionar perfil de usuario y recetas propias.

Estructura del repositorio (resumen)
------------------------------------
- `/front` — Frontend (React + MUI). Contiene `src/` con componentes, páginas, contexto y assets.
- `/back` — Backend (Laravel). Contiene `app/` (controladores, modelos, recursos), `routes/`, `config/`, `database/`.
- `REBRANDING_SUMMARY.md` — Notas de rebranding y cambios realizados.

Tecnologías principales
-----------------------
- Frontend
  - React (JSX) — biblioteca principal para UI.
  - Material UI (MUI v5) — sistema de componentes, thème y utilidades para diseño consistente.
  - Vite / npm — herramienta de bundling y desarrollo (rápida para HMR y builds optimizados).
  - Framer Motion — animaciones suaves para componentes (cards, transiciones).
  - React Router — navegación cliente-side.
  - Google Fonts (`Inter`, `Manrope`) — tipografía corporativa aplicada globalmente.

- Backend
  - Laravel (PHP 12) — framework MVC para API y lógica de servidor.
  - Eloquent ORM — modelos y relaciones (`Receta`, `Ingrediente`, `User`, `Reseña`, `TipoComida`, etc.).
  - Composer — gestor de paquetes PHP.
  - PHPUnit / Pest — pruebas unitarias y de integración (configuración presente en `back/tests`).

- DevOps / Complementos
  - Git — control de versiones.
  - Composer / npm — gestión de dependencias.
  - Vite build — genera `front/dist` para despliegue.

Arquitectura y flujo de datos
----------------------------
1. El cliente (React) consume la API REST del backend (`back/routes/api.php`).
2. `ApiProvider` en el frontend centraliza las llamadas HTTP (GET/POST/PUT/DELETE) y tokens.
3. Laravel expone controladores en `back/app/Http/Controllers/Api/` que validan peticiones y usan Eloquent para persistir datos.
4. Autenticación y autorización se gestionan mediante tokens (p. ej. Sanctum o JWT, según configuración) — el frontend almacena token en `localStorage` tras inicio de sesión.
5. El flujo típico: usuario crea receta → frontend envía formulario a `/api/recipes` → controller valida y persiste → respuesta con recurso creado.

Componentes y responsabilidades (frontend)
------------------------------------------
- `src/App.jsx` — punto de entrada, enrutado y `ThemeProvider` global (MUI). Contiene wrappers `ApiProvider` y `SaborwebProvider`.
- `src/context/ApiProvider.jsx` — funciones para interactuar con la API (autenticación, recetas, ingredientes, reseñas, favoritos).
- `src/context/SaborifyProvider.jsx` (rebautizado a `SaborwebProvider`) — estado global de la aplicación (usuario, recetas en memoria, filtros temporales).
- `src/pages/*` — páginas principales: `HomePage`, `Recetas`, `Receta`, `NuevaReceta`, `MisRecetas`, `InicioSesion`, `Registro`, `Contacto`.
- `src/components/*` — componentes reutilizables: `Header`, `Footer`, `RecetaCard`, `MisRecetasCard`, `ReseñaForm`, `Spinner`, etc.
- `src/css/estilos.css` — estilos globales, variables CSS, tokens de diseño y utilidades.

Modelos y base de datos (backend)
---------------------------------
Modelos representativos (ubicados en `back/app/Models`):
- `User` — usuarios de la plataforma.
- `Receta` — receta principal; contiene título, ingredientes (relación N:M), pasos, tiempo, porciones, dificultad, imagen, autor.
- `Ingrediente` — ingredientes reutilizables.
- `Reseña` — valoraciones y comentarios ligados a `Receta` y `User`.
- `TipoComida`, `TipoComidaReceta` — taxonomía de tipos de comida.

Migraciones y seeders
- Migraciones en `back/database/migrations` crean las tablas y relaciones.
- Seeders proporcionan datos de ejemplo para desarrollo.

Rutas y controladores (backend)
-------------------------------
- `back/routes/api.php` define las rutas públicas y protegidas por middleware (auth).
- Controladores en `back/app/Http/Controllers/Api/` realizan: validación de requests (`Requests/`), operaciones CRUD y respuestas JSON (`Resources/` para formato consistente).

Seguridad y buenas prácticas
---------------------------
- Validación: todas las entradas de usuario pasan por clases `Request` con reglas.
- Autorización: rutas que requieren identidad del usuario usan middleware `auth:sanctum` o equivalente.
- Escape y sanitización: el backend controla campos potencialmente peligrosos antes de persistir.
- Almacenamiento de secretos: variables de entorno en `.env` (no se deben subir a git).
- Dependencias: mantener `composer.lock` y `package-lock.json` para reproduci- bilidad.

Interfaz y experiencia de usuario
---------------------------------
- Diseño responsivo via MUI breakpoints y helpers CSS: el layout adapta el `Header`, menús y grid de tarjetas.
- Componentes con sombras suaves, bordes redondeados y animaciones sutiles para sensación moderna y pulida.
- Accesibilidad: uso de `aria-*` implícito por componentes MUI; asegurarse de revisar contraste y labels en formularios.

Despliegue y ejecución (desarrollo)
----------------------------------
- Frontend (desarrollo):
  - Desde `/front` ejecutar:

```bash
npm install
npm run dev
```

- Frontend (producción/build):

```bash
npm run build
# publica el contenido de /front/dist en tu servidor estático o CDN
```

- Backend (desarrollo):
  - Desde `/back` ejecutar:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

- Asegurarse de configurar en `.env` la URL del frontend y los credenciales de base de datos.

Pruebas
-------
- Tests unitarios y de integración están configurados en `back/tests` y pueden ejecutarse con PHPUnit o Pest. Para ejecutarlos:

```bash
cd back
./vendor/bin/pest
# o
./vendor/bin/phpunit
```

Evolución y mantenimiento
-------------------------
- Arquitectura modular: añadir nuevas entidades (p. ej. colecciones, etiquetas) implica crear migración + modelo + controlador + rutas + llamadas en `ApiProvider` y vistas en `frontend`.
- Internacionalización: añadir soporte i18n es posible vía librerías React (react-i18next) y archivos de traducción.
- Optimización: si los bundles de frontend son grandes, aplicar `code-splitting` dinámico (`React.lazy`, `import()`) y revisar imágenes (optimizar webp, lazy-loading).

Decisiones de diseño relevantes
-------------------------------
- MUI como base de UI para acelerar desarrollo y mantener consistencia.
- Uso de `ApiProvider` y `SaborwebProvider` para separar lógica de llamadas HTTP del estado de la app.
- Tipografía y paleta unificadas (`#1D70B8`) para identidad de marca y legibilidad.
- Eliminación de características experimentales (p. ej. integración AI) para simplificar alcance del proyecto.

Puntos para la defensa (qué destacar)
-------------------------------------
- Arquitectura clara: separación frontend/backend y uso de APIs REST.
- Uso de framework moderno (React + Vite) para experiencia dev y rendimiento.
- Buenas prácticas en backend: validación, migraciones y uso de Eloquent.
- UX enfocada: responsive, accesible y con microinteracciones (Framer Motion).
- Preparado para escalar: uso de gestores de dependencias, lockfiles, y estructura modular.

Apéndice — archivos clave
-------------------------
- Frontend:
  - `front/src/App.jsx` — punto de entrada y `ThemeProvider`.
  - `front/src/context/ApiProvider.jsx` — cliente API central.
  - `front/src/pages/*` — páginas principales.
  - `front/src/components/*` — componentes reutilizables.
  - `front/index.html` — carga de fonts y root.

- Backend:
  - `back/routes/api.php` — definiciones de rutas.
  - `back/app/Http/Controllers/Api/*` — controladores de la API.
  - `back/app/Models/*` — modelos de datos.
  - `back/database/migrations/*` — esquema de la BD.

Contacto y próximos pasos
------------------------
Si quieres, adapto este documento a formato PDF listo para imprimir, o preparo una presentación de diapositivas (PowerPoint/Google Slides) para tu defensa con los puntos clave y capturas de la app.

---
Documento generado automáticamente por el asistente técnico del proyecto. Si quieres que incluya fragmentos de código concretos, métricas de rendimiento o capturas, lo integro en la siguiente iteración.
