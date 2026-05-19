# Polla Mundialista 2026 - Supabase REST

Esta versión usa conexión REST directa con Supabase para evitar problemas con supabase-js.

## Antes de subir

Abre `index.html` y reemplaza esta línea:

```js
const SUPABASE_KEY = "PEGA_AQUI_TU_PUBLISHABLE_KEY";
```

por tu Publishable Key completa de Supabase.

La URL REST ya está configurada:

```js
const SUPABASE_REST_URL = "https://kenkufeidbmhclrawpnk.supabase.co/rest/v1";
```

## Archivos para GitHub

- index.html
- copa-mundial.svg
- README.md

## Vercel

- Framework Preset: Other
- Build Command: vacío
- Output Directory: .
- Install Command: vacío
