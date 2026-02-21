# Fase 10 — Plataforma SaaS Multi-Tenant

## Briefing

> "Quiero una plataforma SaaS multi-tenant. Cada tenant tiene su workspace.
> Necesito: auth con SSO, billing con Stripe, notifications push y real-time,
> dashboard web y mobile app (React Native). Multi-role: admin, editor, viewer."

## 👤 Respuestas del Humano

| Momento | Respuesta |
|---------|-----------|
| Pregunta sobre SSO provider | "Auth0 o Firebase Auth, tú decide" |
| Pregunta sobre billing tiers | *(sin respuesta)* |
| Pregunta sobre mobile platforms | *(sin respuesta)* |
| Pregunta sobre notification types | "Push y email" |
| **Gate 1** — ¿Aprueba? | **"Yes"** |
| Si no tiene `gh` CLI | "No tengo gh instalado, usa lo que puedas" |
| Si detecta dependency circular | "Rompe la dependencia, tú sabes mejor" |
| **Gate 4** — ¿Aprueba sprint? | **"Yes"** |
| Si build falla 3 veces (Circuit Breaker) | "Déjame ver... intenta con Node 18 en vez de 20" |
| Si bloquea por seguridad | "Fix it" |
| **Gate 7 (1ra vez)** — QA rechaza | **"No, fix everything"** |
| **Gate 7 (2da vez)** — QA pasa | **"Yes, ship it"** |
