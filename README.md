# Polla Mundialista 2026 - Mi Bracket

Esta versión agrega la pestaña:

```text
🏆 Mi Bracket
```

## Qué hace

- Mantiene la fase de grupos como está.
- La segunda fase sigue sin empate.
- Cuando el participante elige un clasificado, ese equipo aparece visualmente en la siguiente ronda de su propio bracket.
- El bracket es visual por participante.
- No borra participantes.
- No borra pronósticos existentes.
- No cambia Apps Script.

## Importante

La pestaña Mi Bracket se habilita visualmente cuando en Configuracion esté:

```text
fase2_habilitada = SI
```

## Apps Script

No necesitas cambiar Apps Script si ya tienes funcionando la versión rápida.

## index.html

Pega tu URL de Apps Script en:

```js
const APPS_SCRIPT_URL = "PEGA_AQUI_TU_URL_DE_APPS_SCRIPT";
```

## GitHub

Sube solo:
- index.html
- copa-mundial.svg
- README.md
