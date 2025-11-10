# 👋 CODEX - EMPIEZA AQUÍ

**¡Bienvenido al proyecto Naveo!** 🚀

Este documento te guiará para empezar a trabajar inmediatamente.

---

## ⚡ INICIO RÁPIDO (30 segundos)

### 1. Abrir las tareas asignadas
```bash
cat /root/miralabs-projects/naveo/CODEX_TASKS.md
```

### 2. Ver el estado del proyecto
```bash
cat /root/miralabs-projects/naveo/docs/PROGRESS_UPDATE.md
```

### 3. Verificar que el servidor esté corriendo
```
✅ Frontend: http://172.23.3.62:5175/
✅ Backend: http://172.23.3.62:54323
```

Si no está corriendo:
```bash
cd /root/miralabs-projects/naveo
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2
```

---

## 📋 TUS TAREAS (SPRINT 2)

Tienes **5 tareas** asignadas en orden de prioridad:

### 🔴 CRÍTICAS (hacer primero)
1. **Assets Management Page** (Admin Client)
2. **Portfolio Page** (Investor)

### 🟡 ALTAS (hacer después)
3. **Mejorar BuySellModal** (componente compartido)
4. **Traders Management Page** (Admin Client)

### 🟢 MEDIA (hacer al final)
5. **Conectar con Supabase** (preparar BD)

**👉 Lee los detalles completos en:** `CODEX_TASKS.md`

---

## 🗺️ MAPA DEL PROYECTO

```
/root/miralabs-projects/naveo/
├── frontend/                    ← TRABAJARÁS AQUÍ
│   ├── src/
│   │   ├── portals/
│   │   │   ├── admin-owner/    ← Portal dueño plataforma
│   │   │   ├── admin-client/   ← Portal fund manager (TU FOCO)
│   │   │   └── investor/       ← Portal inversionista (TU FOCO)
│   │   ├── components/
│   │   │   ├── common/         ← Componentes reutilizables
│   │   │   └── modals/         ← Modals (BuySellModal aquí)
│   │   └── services/           ← Supabase client
│   └── package.json
├── supabase/                    ← Base de datos
│   └── migrations/             ← SQL migrations
├── docs/                        ← Documentación
├── CODEX_TASKS.md              ← TUS TAREAS DETALLADAS ⭐
└── PROJECT_MANAGEMENT.md       ← Estado del proyecto
```

---

## 🎯 OBJETIVO DE TU SPRINT

**Meta:** Completar gestión de activos e portfolios

**Resultado esperado:**
- Fund Managers puedan gestionar assets del fondo
- Inversionistas puedan ver portfolio detallado
- Sistema de compra/venta mejorado
- Base de datos preparada

**Progreso:** 37.5% → 55% (+17.5%)

---

## 🛠️ TECNOLOGÍAS QUE USARÁS

- **React 18** + TypeScript
- **Ant Design** (componentes UI)
- **@ant-design/charts** (gráficos)
- **React Router v7** (navegación)
- **Supabase** (backend/BD)

**Documentación útil:**
- Ant Design: https://ant.design/components
- Ant Charts: https://charts.ant.design/
- Supabase: https://supabase.com/docs

---

## 📝 PATRÓN DE CÓDIGO A SEGUIR

### Estructura de una página:

```typescript
import { Card, Table, Button, Space } from 'antd';
import { SomeIcon } from '@ant-design/icons';
import { StatCard } from '../../../components/common';

export default function MyPage() {
  // 1. Mock data (por ahora)
  const data = [
    { id: 1, name: 'Item 1', value: 100 },
    // ...
  ];

  // 2. Handlers
  const handleAction = () => {
    console.log('Action');
  };

  // 3. Render
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)' }}>
        Page Title
      </h1>

      {/* Métricas */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatCard title="Metric" value="100" />
        </Col>
      </Row>

      {/* Tabla */}
      <Card title="Data Table">
        <Table dataSource={data} />
      </Card>
    </div>
  );
}
```

### Estructura de un Modal:

```typescript
import { Modal, Form, Input, Button } from 'antd';

interface MyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

export default function MyModal({ visible, onClose, onSubmit }: MyModalProps) {
  const [form] = Form.useForm();

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit(values);
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Modal Title"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="field" label="Label" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
```

---

## 🚦 FLUJO DE TRABAJO RECOMENDADO

### Para cada tarea:

1. **Leer requisitos** en `CODEX_TASKS.md`
2. **Crear archivo** en la ruta indicada
3. **Implementar** siguiendo el patrón de código
4. **Probar** en el navegador:
   - Abrir http://172.23.3.62:5175/
   - Navegar a la página
   - Verificar que funciona
5. **Verificar** que no hay errores de compilación
6. **Marcar como completada** en `CODEX_TASKS.md`
7. **Continuar** con la siguiente tarea

---

## 🔍 CÓMO PROBAR TU TRABAJO

### 1. Assets Management Page:
```
1. Ir a: http://172.23.3.62:5175/admin-client
2. Click en "Assets Management" en sidebar
3. Verificar:
   - ✅ Tabla muestra assets
   - ✅ Botón "Add Asset" abre modal
   - ✅ Botones Edit/Delete funcionan
   - ✅ Métricas se muestran arriba
```

### 2. Portfolio Page:
```
1. Ir a: http://172.23.3.62:5175/investor
2. Click en "Mi Portafolio" en sidebar
3. Verificar:
   - ✅ Holdings table muestra datos
   - ✅ Gráficos se renderizan
   - ✅ Métricas son correctas
   - ✅ Botones Buy/Sell funcionan
```

### 3. BuySellModal mejorado:
```
1. Desde cualquier página con botón Buy/Sell
2. Click en Buy o Sell
3. Verificar:
   - ✅ Steps se muestran (1,2,3)
   - ✅ Validaciones funcionan
   - ✅ Cálculos son correctos
   - ✅ Confirmación aparece
```

---

## ⚠️ ERRORES COMUNES A EVITAR

### ❌ NO hacer:
```typescript
// NO importar así
import Button from 'antd/es/button';

// NO olvidar tipos
const data = [...];  // ❌

// NO usar any
const handleClick = (item: any) => {}  // ❌
```

### ✅ SÍ hacer:
```typescript
// SÍ importar así
import { Button } from 'antd';

// SÍ definir tipos
const data: AssetData[] = [...];  // ✅

// SÍ usar tipos específicos
const handleClick = (item: AssetData) => {}  // ✅
```

---

## 🆘 AYUDA Y RECURSOS

### Si encuentras un error:

1. **Leer el error** en la consola del navegador (F12)
2. **Verificar** que el servidor esté corriendo
3. **Revisar** que los imports sean correctos
4. **Comparar** con páginas existentes que funcionan

### Archivos de referencia:

- **Tabla con datos:** `/admin-owner/pages/FundsManagementPage.tsx`
- **Dashboard completo:** `/admin-owner/pages/DashboardPage.tsx`
- **Modal existente:** `/components/modals/BuySellModal.tsx`
- **Componente reutilizable:** `/components/common/StatCard.tsx`

---

## 📊 PROGRESO ESPERADO

| Día | Tarea | Tiempo | Progreso |
|-----|-------|--------|----------|
| **Día 1** | TAREA 1 + TAREA 2 | 4-5h | +10% |
| **Día 2** | TAREA 3 + TAREA 4 | 3-4h | +5% |
| **Día 3** | TAREA 5 | 3h | +2.5% |

**Total:** 10-12 horas de desarrollo
**Resultado:** 37.5% → 55%

---

## ✅ CHECKLIST ANTES DE EMPEZAR

- [ ] Leí `CODEX_TASKS.md` completo
- [ ] Entiendo la estructura del proyecto
- [ ] El servidor frontend está corriendo
- [ ] El servidor Supabase está corriendo
- [ ] Puedo acceder a http://172.23.3.62:5175/
- [ ] Sé dónde crear los archivos
- [ ] Entiendo el patrón de código a seguir

---

## 🎯 PRIMERA TAREA - ASSETS MANAGEMENT

**Archivo a crear:**
```
/root/miralabs-projects/naveo/frontend/src/portals/admin-client/pages/AssetsManagementPage.tsx
```

**Tiempo estimado:** 2-3 horas

**Requisitos completos:** Ver `CODEX_TASKS.md` → TAREA 1

**Empezar ahora:**
```bash
cd /root/miralabs-projects/naveo/frontend/src/portals/admin-client/pages
touch AssetsManagementPage.tsx
```

---

## 📞 COMUNICACIÓN

Al completar cada tarea, actualiza:
- `CODEX_TASKS.md` (marca checkbox ✅)
- `PROGRESS_UPDATE.md` (agrega línea de progreso)

---

**¡Éxito en tu desarrollo! 💪**

Si tienes dudas, revisa:
1. `CODEX_TASKS.md` (tareas detalladas)
2. `PROJECT_MANAGEMENT.md` (contexto del proyecto)
3. Archivos de referencia (páginas existentes)

**¡Ahora empieza con TAREA 1! 🚀**
