# SmartParking App

Una aplicación móvil de parqueo inteligente desarrollada con React Native y Expo, que utiliza SQLite para el manejo de datos.

## 🚀 Características

- **Autenticación completa**: Login y registro con base de datos SQLite
- **Gestión de parqueos**: Visualización en tiempo real de espacios disponibles
- **Historial de reservas**: Seguimiento completo de todas las actividades de parqueo
- **Perfil de usuario**: Información personalizada y estadísticas de uso
- **Base de datos local**: SQLite para almacenamiento eficiente y offline-first

## 🛠️ Tecnologías utilizadas

- **Frontend**: React Native con Expo
- **Base de datos**: SQLite (expo-sqlite)
- **Navegación**: Expo Router
- **Iconos**: Lucide React Native
- **Estilos**: StyleSheet nativo de React Native

## 📱 Funcionalidades principales

### Autenticación
- Login seguro con verificación de credenciales
- Registro de nuevos usuarios con validación de datos
- Gestión de sesión persistente
- Logout con confirmación

### Dashboard principal
- Lista de parqueos disponibles en tiempo real
- Estadísticas de espacios disponibles
- Búsqueda automática de parqueos cercanos
- Filtros por disponibilidad y características

### Historial de reservas
- Registro completo de todas las reservas
- Estadísticas personalizadas (tiempo total, dinero gastado)
- Filtros por período de tiempo
- Detalles de cada reserva

### Perfil de usuario
- Información personal editable
- Estadísticas de uso
- Configuración de notificaciones
- Gestión de métodos de pago y vehículos

## 🗄️ Estructura de la base de datos

### Tablas principales:

- **users**: Información de usuarios
- **parkings**: Datos de parqueos y disponibilidad
- **reservations**: Historial de reservas
- **payment_methods**: Métodos de pago del usuario
- **vehicles**: Vehículos registrados

## 🚀 Instalación y uso

1. **Clonar el repositorio**:
   ```bash
   git clone [url-del-repositorio]
   cd project-parqueosint
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Iniciar la aplicación**:
   ```bash
   npm run dev
   ```

4. **Usar la aplicación**:
   - Escanea el código QR con Expo Go (móvil)
   - O visita http://localhost:8081 (web)

## 👤 Usuario de prueba

**Email**: juan.perez@email.com  
**Contraseña**: cualquier contraseña (para efectos de demo)

## 📂 Estructura del proyecto

```
project-parqueosint/
├── app/                    # Pantallas de la aplicación
│   ├── auth/              # Autenticación (login, registro)
│   ├── (tabs)/            # Pantallas principales con tabs
│   └── _layout.tsx        # Layout principal con providers
├── components/            # Componentes reutilizables
├── contexts/             # Contextos de React (AuthContext)
├── db/                   # Configuración de base de datos
│   ├── database.ts       # Configuración principal de SQLite
│   ├── models.ts         # Interfaces TypeScript
│   └── services/         # Servicios de base de datos
│       ├── AuthService.ts
│       ├── ParkingService.ts
│       └── ReservationService.ts
└── hooks/                # Hooks personalizados
```

## 🔧 Servicios de base de datos

### AuthService
- Manejo de login y registro
- Gestión de perfiles de usuario
- Autenticación segura

### ParkingService
- Consulta de parqueos disponibles
- Filtros y búsquedas
- Estadísticas de disponibilidad

### ReservationService
- Historial de reservas del usuario
- Cálculo de estadísticas
- Gestión de reservas activas

## 🎯 Próximas características

- [ ] Integración con mapas GPS
- [ ] Notificaciones push
- [ ] Pagos integrados
- [ ] Reservas en tiempo real
- [ ] Sistema de calificaciones
- [ ] Integración con servicios de terceros

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

