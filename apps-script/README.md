# Bakery Ops Board v1 (Google Apps Script)

## Qué incluye
- Captura rápida de órdenes (manual + pegado JSON de Square/GPT agente).
- Kanban de producción con drag & drop y prioridad FIFO por antigüedad.
- Folio legible diario: `ORD-14FEB-001`.
- Popup de menú por familias para agregar productos.
- UI bilingüe ES/EN con selector manual.

## Estructura
- `Code.gs`: backend API + reglas de negocio + acceso a Sheets.
- `Admin.gs`: utilidades de backup, preparación y smoke tests.
- `Index.html`: UI web app (captura + kanban).
- `appsscript.json`: manifest Apps Script.
- `DEPLOYMENT_CHECKLIST.md`: paso a paso staging -> producción.
- `qa_e2e.py`: suite QA E2E (API + UI headless).

## Hojas esperadas
La función `setup()` crea/ajusta estas pestañas:
- `Orders`
- `Products`
- `Expenses`

Si ya existen, agrega columnas faltantes para compatibilidad.

## Conexión al Spreadsheet correcto
El backend puede leer el Spreadsheet de dos formas:

1. `SPREADSHEET_ID` en Script Properties (recomendado).
2. `getActiveSpreadsheet()` si el proyecto está bound al Sheet.

Para fijar el documento correcto:
- Apps Script -> Project Settings -> Script properties
- Agregar:
  - Key: `SPREADSHEET_ID`
  - Value: `<ID del Google Sheet>`

Tip:
- El ID es la parte entre `/d/` y `/edit` en la URL del Sheet.

## Seguridad (repositorio)
- No hardcodear IDs/tokens en `Code.gs` o `Admin.gs`.
- Mantener valores sensibles fuera del repo en:
  - `apps-script/private.local.json` (archivo local, ignorado por git).
  - Script Properties en Apps Script (`SPREADSHEET_ID`, etc).
- Usa `apps-script/private.local.json.example` como plantilla.

## Reglas clave implementadas
- Estados: `Pending`, `Working`, `Baked`, `Delivered`, `Cancelled`.
- FIFO estricto por `captured_at`.
- `Delivered` no editable ni movible.
- Solo `Baked -> Delivered`.
- `Cancelled` reversible con confirmación.
- Alerta visual de antigüedad > 90 min (borde rojo).
- Delivery `Unpaid` permitido con alerta.
- Histórico sin folio se marca `LEGACY`.

## Flujo de despliegue recomendado
1. Crear copia de respaldo del Spreadsheet productivo.
2. Publicar deployment de staging en Apps Script.
3. Probar checklist funcional (abajo).
4. Publicar deployment de producción.

También puedes ejecutar el flujo administrado con funciones:
1. `adminBackupSpreadsheet()`
2. `adminPrepareEnvironment()`
3. `adminRunSmokeTests()`

## Checklist QA mínimo
1. Crear orden manual genera `order_number` y `captured_at`.
2. Folio diario incrementa secuencia (`...-001`, `...-002`).
3. Órdenes antiguas salen con `LEGACY`.
4. Kanban ordena por antigüedad de captura.
5. Ticket > 90 min muestra borde rojo.
6. No se puede editar orden `Delivered`.
7. `Cancelled` se puede revertir solo con confirmación.
8. No permite pasar a `Delivered` desde estado distinto de `Baked`.
9. Delivery `Unpaid` muestra alerta y permite guardar.
10. Refresco cada 5s mantiene tablero actualizado.

## QA automatizado
Prerequisitos:
- Python 3.9+
- `pip install --user playwright`
- `python3 -m playwright install chromium`

Ejecutar:
```bash
cd apps-script
python3 qa_e2e.py \
  --api-base "https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec" \
  --local-dir "$(pwd)"
```

La suite valida:
- Creación de órdenes y formato de folio.
- FIFO por `captured_at`.
- Reglas de transición de estado.
- Bloqueos de `Delivered`.
- Reversión de `Cancelled` con confirmación.
- Flujo UI de popup de menú + creación en Kanban.

## Nota operativa
- Este MVP está diseñado para uso interno sin login.
- ChatGPT agente se usa como herramienta externa para rellenar payload JSON; la app valida y permite corrección humana antes de guardar.
