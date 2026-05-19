# Polla Mundialista 2026 - Versión Vercel Proxy

Esta versión evita que el navegador se conecte directamente a Supabase.
La página llama a:

```text
/api/supabase
```

y Vercel se conecta a Supabase.

## Antes de subir

Abre:

```text
api/supabase.js
```

Busca esta línea:

```js
const SUPABASE_KEY = "PEGA_AQUI_TU_PUBLISHABLE_KEY";
```

y reemplázala por tu Publishable Key completa de Supabase:

```js
const SUPABASE_KEY = "sb_publishable_TU_KEY_COMPLETA";
```

No cambies esta línea:

```js
const SUPABASE_REST_URL = "https://kenkufeidbmhclrawpnk.supabase.co/rest/v1";
```

## Archivos/carpetas que debes subir a GitHub

- index.html
- copa-mundial.svg
- README.md
- carpeta api
  - supabase.js

## Vercel

Como esta versión usa una función `/api/supabase`, sube también la carpeta `api`.

Luego haz Redeploy.
