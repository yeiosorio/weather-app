# Weather App

Aplicación del clima desarrollada con Angular que consume la API de WeatherAPI para proporcionar información meteorológica detallada y una experiencia de usuario avanzada.

## Características Principales

- **Búsqueda de Ciudades**
  - Autocompletado de nombres de ciudades
  - Validación de entradas
  - Sugerencias en tiempo real

- **Información del Clima**
  - Temperatura en Celsius y Fahrenheit
  - Estado del clima con íconos
  - Velocidad del viento
  - Humedad
  - Hora local de la ciudad

- **Gestión de Favoritos**
  - Guardar ciudades favoritas
  - Lista persistente usando localStorage
  - Eliminación de favoritos

- **Historial de Búsquedas**
  - Registro de búsquedas recientes
  - Acceso rápido a búsquedas anteriores
  - Opción de limpiar historial

## Tecnologías Utilizadas

- Angular 17
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

3. Configurar API Key:
   - Obtener una API key gratuita en [WeatherAPI](https://www.weatherapi.com)
   - Crear un archivo `src/environments/environment.ts` con el siguiente contenido:
     ```typescript
     export const environment = {
       production: false,
       weatherApiKey: 'TU_API_KEY_AQUI'
     };
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

## Optimizaciones Implementadas

- Lazy loading de módulos
- Caché de respuestas de API
- ChangeDetectionStrategy.OnPush
- Debounce en búsquedas
- Diseño responsivo

## Características de Desarrollo

- Componentes standalone
- Arquitectura modular
- Servicios reutilizables
- Manejo de estado con RxJS
- Estilos CSS puros y optimizados

## Contribuir

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.
