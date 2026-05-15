## Componentes Traducidos ✅
1. **Header.jsx** - Búsqueda y botones de login/logout
2. **Footer.jsx** - Enlaces y copyright
3. **NuevaReceta.jsx** - Mensajes de error y títulos principales

## Componentes Pendientes de Traducción 🔄
Los siguientes componentes aún necesitan usar el hook useLanguage:

### Páginas Principales
1. **Receta.jsx** (Ver receta detallada)
2. **Recetas.jsx** (Listar recetas)
3. **EditarReceta.jsx** - agregar t() después del import
4. **InicioSesion.jsx** (Login)
5. **Registro.jsx** (Sign Up)
6. **MiPerfil.jsx** (My Profile)
7. **MisRecetas.jsx** (My Recipes)
8. **FavoritesRecipes.jsx** (Favorites)
9. **Ingredientes.jsx** (Ingredients list)
10. **Ingrediente.jsx** (Ingredient detail)
11. **Contacto.jsx** (Contact)

### Componentes
1. **RecetaCard.jsx** - Textos de botones
2. **RecetaCardMiPerfil.jsx** - Textos
3. **MisRecetasCard.jsx** - Textos
4. **ReseñaCard.jsx** - Textos
5. **FavRecetaCard.jsx** - Textos
6. **ReseñaForm.jsx** - Textos

## Variables de Traducción Disponibles
- Todas las claves están en `/locales/en.json` y `/locales/es.json`
- Se puede acceder con `t('seccion.variable')`
- El idioma se persiste en localStorage
- El botón de idioma está en el Header (EN/ES)

## Pasos para Traducir un Componente
1. Agregar: `import { useLanguage } from '../hooks/useLanguage';`
2. En el componente: `const { t } = useLanguage();`
3. Reemplazar textos: `"texto"` → `{t('seccion.clave')}`
4. Si la clave no existe en .json, agregarla antes
