# Fase 6 — E-Commerce con 3 Módulos Paralelos

## Briefing

> Steps 1-4 ya están completados. El sprint tiene 3 tickets para desarrollo simultáneo:
> - **Ticket #1:** Cart Module (add/remove items, persist cart)
> - **Ticket #2:** Checkout Flow (payment form, order confirmation)
> - **Ticket #3:** User Profile (edit name, address, avatar upload)
>
> Nota: Ticket #1 y Ticket #2 comparten el archivo `OrderService.ts`.

## 👤 Respuestas del Humano

| Momento | Respuesta |
|---------|-----------|
| ¿Cuántos agentes? | "Usa 3 agentes paralelos, uno por ticket" |
| ¿File CLAIM protocol? | "Sí, que cada agente reclame sus archivos" |
| Si detecta conflicto en un archivo | "Que Checkout espere a que Cart termine con ese archivo" |
| ¿Aprueba PRs? | **"Yes, merge all 3"** |
