# Fase 5 — API de Pagos

## Briefing

> "Necesito una API de pagos para mi e-commerce. Procesa tarjetas de crédito,
> guarda historial de transacciones, y tiene un portal admin para ver reportes.
> Debe manejar tokens de pago y cumplir con PCI. El portal tiene login con 2FA."

## 👤 Respuestas del Humano

| Momento | Respuesta |
|---------|-----------|
| Pregunta sobre compliance | "Necesitamos PCI-DSS, no GDPR por ahora" |
| Pregunta sobre 2FA | "TOTP con app authenticator, no SMS" |
| Pregunta sobre data retention | "Guardar historial 7 años por regulación" |
| **Gate 1** — ¿Aprueba? | **"Yes"** |
| **Gate 4** — ¿Aprueba sprint? | **"Yes"** |
| Si bloquea por seguridad | "Fix it and re-review" |
| **Gate 7** — ¿Aprueba release? | **"Yes"** |
