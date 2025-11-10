# Naveo - Guía de Instalación y Configuración

## Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- npm o yarn

## Instalación

### 1. Instalar Dependencias

Desde la raíz del proyecto:

```bash
npm run install:all
```

O manualmente:

```bash
# Raíz del proyecto
npm install

# Frontend
cd frontend
npm install
```

### 2. Iniciar Backend (Supabase Local)

Desde la raíz del proyecto:

```bash
npm run dev:backend
```

Este comando:
- Inicia los contenedores de Docker de Supabase
- Levanta PostgreSQL, Auth, Storage, Realtime, etc.
- Expone la API en `http://localhost:54321`

Las credenciales por defecto son:
- **API URL:** `http://localhost:54321`
- **Anon Key:** Ver el output del comando `npm run status`
- **Service Role Key:** Ver el output del comando `npm run status`

### 3. Verificar Estado de Supabase

```bash
npm run status
```

Este comando muestra:
- URLs de los servicios
- Credenciales (API keys)
- Estado de los contenedores

### 4. Configurar Variables de Entorno

Copia el archivo de ejemplo y actualiza con las credenciales reales:

```bash
cd frontend
cp .env.example .env
```

Edita `frontend/.env` con las credenciales obtenidas del comando `status`.

### 5. Iniciar Frontend

Desde la raíz del proyecto:

```bash
npm run dev:frontend
```

O desde la carpeta frontend:

```bash
cd frontend
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## Portales Disponibles

- **Admin Owner:** `http://localhost:5173/admin-owner`
- **Admin Client (Gestor):** `http://localhost:5173/admin-client`
- **Investor:** `http://localhost:5173/investor`

## Comandos Útiles

### Supabase

```bash
# Iniciar servicios
npm run dev:backend

# Detener servicios
npm run stop:backend

# Ver estado y credenciales
npm run status

# Resetear base de datos
npm run db:reset

# Aplicar migraciones
npm run db:migrate
```

### Frontend

```bash
# Modo desarrollo
npm run dev:frontend

# Build producción
cd frontend && npm run build

# Preview build
cd frontend && npm run preview
```

## Estructura del Proyecto

```
naveo/
├── frontend/               # Aplicación React + Refine
│   ├── src/
│   │   ├── portals/       # Los 3 portales
│   │   │   ├── admin-owner/
│   │   │   ├── admin-client/
│   │   │   └── investor/
│   │   ├── components/    # Componentes compartidos
│   │   ├── services/      # Servicios (Supabase, APIs)
│   │   └── App.tsx        # Configuración principal
│   └── package.json
├── supabase/              # Configuración Supabase
│   ├── config.toml
│   └── migrations/        # Migraciones SQL
├── docs/                  # Documentación
└── package.json           # Scripts del proyecto
```

## Próximos Pasos

1. Configurar el schema de base de datos en `supabase/migrations/`
2. Implementar autenticación y roles
3. Desarrollar los dashboards de cada portal
4. Integrar KYC/KYB (Persona)
5. Integrar on/off ramp (Stripe/Transak)
6. Implementar sistema NAV
7. Configurar smart contracts (Diamond Proxy)

## Soporte

Para problemas o preguntas, revisa los logs:

```bash
# Logs de Supabase
docker compose -f supabase/docker/docker-compose.yml logs -f

# Logs específicos de un servicio
docker logs supabase-db
```
