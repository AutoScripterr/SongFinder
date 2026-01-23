# Railway Setup - Pasos Simples

## ✅ Configuración Automática Lista

He creado archivos de configuración (`railway.toml` y `server/railway.json`) que Railway detectará automáticamente.

---

## 🚀 Pasos para Desplegar:

### 1. Crear Proyecto en Railway

1. Ve a https://railway.app
2. Click **"+ New"** (botón morado)
3. Selecciona **"Deploy from GitHub repo"**
4. Selecciona **"SongFinder"**
5. Railway detectará la configuración automáticamente

### 2. Agregar Variables de Entorno

Una vez que el servicio se cree, click en el servicio y:

1. Ve a la pestaña **"Variables"**
2. Click **"+ New Variable"**
3. Agrega estas 6 variables (copia y pega):

```
PORT=3001
```
```
NODE_ENV=production
```
```
AUDD_API_KEY=85f2caba7c4fcb7f8d3b8a8a9a3a42b5
```
```
TEMP_AUDIO_PATH=./temp
```
```
RATE_LIMIT_MAX_REQUESTS=100
```
```
ALLOWED_ORIGINS=http://localhost:5173
```

### 3. Esperar el Deploy

- Railway instalará dependencias automáticamente
- El proceso toma 2-3 minutos
- Verás "Deployed" con ✓ verde cuando termine

### 4. Obtener la URL del Backend

1. En el servicio desplegado, ve a **"Settings"**
2. Sección **"Domains"**
3. Click **"Generate Domain"** si no hay ninguno
4. Copia la URL (ejemplo: `https://songfinder-production-xxxx.up.railway.app`)

---

## 🔧 Verificar que Funciona

Una vez desplegado, prueba el backend:

Abre en tu navegador:
```
https://TU-URL-BACKEND.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "timestamp": "..."
}
```

---

## ⚠️ Si Ves Errores:

1. Ve a **"Deployments"** en Railway
2. Click en el deploy actual
3. Revisa los logs
4. Busca errores en rojo

**Errores comunes:**
- Variables faltantes → Verifica que agregaste las 6 variables
- Build fail → Revisa los logs para ver qué faltó
- Timeout → El despliegue puede tardar, espera un poco más

---

## ✅ Siguiente Paso:

Una vez que tengas la URL del backend funcionando, continúa con el despliegue del frontend.
