# Polla Mundialista 2026 - Restaurar versión estable

Esta es la versión estable para restaurar la app.

Incluye:
- Registro con PIN.
- Botón de registro bloqueado al primer clic.
- Pronósticos rápidos.
- Guardar y confirmar al final.
- Google Sheets funcionando.
- Eliminatorias sin empate.
- Admin funcionando.

NO incluye:
- Mi Bracket.

## Importante

Este cambio NO toca Google Sheets. No borra:
- Participantes
- Pronósticos
- Pagos
- Partidos
- Configuración

## Antes de subir

Abre `index.html` y pega tu URL de Apps Script en:

```js
const APPS_SCRIPT_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
```

## Subir a GitHub

Sube solo:
- index.html
- copa-mundial.svg
- README.md

Luego espera Vercel y abre la app con Ctrl + F5.
