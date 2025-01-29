# Weather App

Aplicación del clima desarrollada con Angular que permite buscar y visualizar información meteorológica en tiempo real, guardar ubicaciones favoritas y mantener un historial de búsquedas.

## Características Principales

- Búsqueda de ciudades en tiempo real
- Visualización detallada del clima actual
- Sistema de favoritos
- Historial de búsquedas
- Modo offline
- Diseño responsive
- Animaciones fluidas

## Integración con WeatherAPI

La aplicación utiliza WeatherAPI para obtener datos meteorológicos en tiempo real. Se implementaron las siguientes optimizaciones:

### Optimizaciones de Rendimiento

1. **Caché de Datos**:
   - Implementación de Service Worker para almacenamiento offline
   - Caché de respuestas API con estrategia "freshness" (3 horas)
   - Almacenamiento local para favoritos e historial

2. **Optimización de Búsqueda**:
   - Debounce de 300ms en la búsqueda para reducir llamadas API
   - Cancelación automática de solicitudes pendientes
   - Filtrado de términos de búsqueda menores a 2 caracteres

3. **Gestión de Estado**:
   - Uso de ChangeDetectionStrategy.OnPush para mejor rendimiento
   - Manejo eficiente de suscripciones con takeUntil
   - Estado local para sugerencias de búsqueda

### Estructura del Código

```typescript
// Interfaces principales
interface WeatherResponse {
  location: {...}    // Información de ubicación
  current: {...}     // Datos meteorológicos actuales
}

interface LocationSuggestion {
  id: string;        // ID único para tracking
  name: string;      // Nombre de la ciudad
  region: string;    // Región/Estado
  country: string;   // País
}
```

### Componentes Principales

1. **WeatherSearchComponent**:
   - Manejo de búsqueda en tiempo real
   - Sugerencias de autocompletado
   - Tracking optimizado de resultados

2. **WeatherDetailComponent**:
   - Visualización de datos meteorológicos
   - Gestión de favoritos
   - Animaciones de estado

3. **Servicios Core**:
   - WeatherService: Integración con API
   - StorageService: Gestión de datos locales
   - PWA: Configuración para modo offline

### Optimizaciones de UX

1. **Feedback Visual**:
   - Animaciones suaves en transiciones
   - Indicadores de carga
   - Manejo de errores con animaciones

2. **Gestión de Datos**:
   - Persistencia de favoritos
   - Historial de búsquedas recientes
   - Recuperación automática en modo offline

3. **Rendimiento**:
   - Lazy loading de módulos
   - Precarga de assets críticos
   - Optimización de bundle size

## Documentación del Código

### Patrones Implementados

1. **Observer Pattern**:
   ```typescript
   searchControl.valueChanges.pipe(
     debounceTime(300),
     distinctUntilChanged(),
     filter((value): value is string => !!value && value.length >= 2),
     switchMap(value => this.weatherService.searchLocations(value))
   )
   ```

2. **Repository Pattern**:
   ```typescript
   export class StorageService {
     addToFavorites(location: StoredLocation): void
     removeFromFavorites(locationId: string): void
     getFavorites(): StoredLocation[]
   }
   ```

3. **Strategy Pattern** (Caché):
   ```json
   "dataGroups": [{
     "name": "weather-api",
     "cacheConfig": {
       "strategy": "freshness",
       "maxAge": "3h"
     }
   }]
   ```

### Buenas Prácticas

- Tipado estricto en toda la aplicación
- Manejo consistente de errores
- Documentación de interfaces y métodos principales
- Tests unitarios para servicios y componentes
- Uso de constantes para valores configurables
- Implementación de patrones de diseño Angular

## Tecnologías Utilizadas

- Angular 18
- TypeScript
- RxJS
- CSS puro para estilos
- LocalStorage para persistencia
- WeatherAPI para datos meteorológicos

## Requisitos Previos

- Node.js (versión 18 o superior)
- npm (incluido con Node.js)
- Angular CLI (`npm install -g @angular/cli`)

## Configuración del Proyecto

1. Clonar el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd weather-app
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

4. Iniciar el servidor de desarrollo:
   ```bash
   ng serve
   ```

5. Abrir el navegador en `http://localhost:4200`

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   └── services/
│   │       ├── weather.service.ts
│   │       └── storage.service.ts
│   ├── modules/
│   │   ├── weather/
│   │   ├── favorites/
│   │   └── history/
│   └── shared/
├── environments/
└── assets/
```

## Características de Desarrollo

- Componentes standalone
- Arquitectura modular
- Servicios reutilizables
- Manejo de estado con RxJS
- Estilos CSS puros y optimizados
