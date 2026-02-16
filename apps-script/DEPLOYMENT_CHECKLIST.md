# Deployment Checklist (Staging -> Production)

## 0) Preconditions
- Spreadsheet activo con pestañas `Orders`, `Products`, `Expenses`.
- Proyecto Apps Script con estos archivos:
  - `Code.gs`
  - `Admin.gs`
  - `Index.html`
  - `appsscript.json`

## 1) Backup obligatorio
En Apps Script, ejecutar:
1. `adminBackupSpreadsheet()`

Expected:
- `status: success`
- `backup_url` retornado

Guardar el `backup_url` en tu bitácora del deploy.

## 2) Preparación de entorno
Ejecutar:
1. `adminPrepareEnvironment()`

Expected:
- `status: success`
- `orders_headers` contiene nuevas columnas:
  - `order_number`
  - `captured_at`
  - `delivery_time`
  - `delivery_at`
  - `channel`
  - `source_notes`
  - `payment_method`
  - `deposit_amount`
  - `updated_at`
  - `sync_version`
  - `is_legacy`

## 3) Smoke tests
Ejecutar:
1. `adminRunSmokeTests()`

Expected:
- `status: success`
- métricas de órdenes/productos/gastos

Si falla:
- Corregir antes de deploy.
- No pasar a producción.

## 4) Staging deploy
1. Deploy web app en staging.
2. Validar en navegador:
  - Captura: crear orden nueva.
  - Kanban: mover `Pending -> Working -> Baked -> Delivered`.
  - Bloqueo: no editar `Delivered`.
  - Reglas: no `Pending -> Delivered` directo.
  - FIFO: orden antigua primero.
  - Folio: formato `ORD-DDMMM-###`.
  - Dashboard: métricas visibles.
  - Gastos: alta y reflejo.

## 5) Production deploy
Solo si staging está OK:
1. Nuevo deployment de producción.
2. Ejecutar `adminRunSmokeTests()` en productivo.
3. Validar 3 casos en vivo:
  - Crear orden manual.
  - Cambio de estado en Kanban.
  - Registro de gasto.

## 6) Rollback plan
Si hay problema crítico:
1. Volver al deployment anterior.
2. Restaurar spreadsheet desde `backup_url`.
3. Revalidar operación con 3 casos básicos.

## 7) Operación diaria (recomendado)
- Monitorear bordes rojos (>90 min) en Kanban.
- Revisar tardías en Dashboard al menos 2 veces al día.
- Usar `LEGACY` solo para histórico, nuevas órdenes siempre con folio automático.
